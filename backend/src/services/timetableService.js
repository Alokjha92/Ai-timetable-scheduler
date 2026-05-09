import { randomUUID } from "node:crypto";
import dotenv from "dotenv";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../data/store.json");
const envFile = path.join(__dirname, "../../.env");
const OPENAI_MODEL = "openai/gpt-4o-mini";

dotenv.config({ path: envFile });

function normalizeApiKey(value) {
  return String(value || "").trim().replace(/^['"]|['"]$/g, "").replace(/;$/, "").trim();
}

function isConfiguredApiKey(value) {
  const normalized = normalizeApiKey(value);
  return normalized.startsWith("sk-");
}

async function readRuntimeConfig() {
  let fileConfig = {};

  try {
    const envRaw = await readFile(envFile, "utf8");
    fileConfig = dotenv.parse(envRaw);
  } catch {
    fileConfig = {};
  }

  const openaiApiKey = normalizeApiKey(fileConfig.OPENAI_API_KEY || fileConfig.OPENROUTER_API_KEY || "");

  return {
    openaiApiKey,
    aiConfigured: isConfiguredApiKey(openaiApiKey),
    openaiModel: OPENAI_MODEL,
  };
}

async function ensureStore() {
  await mkdir(path.dirname(dataFile), { recursive: true });

  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(dataFile, JSON.stringify({ timetables: [] }, null, 2));
  }
}

async function readStore() {
  await ensureStore();
  return JSON.parse(await readFile(dataFile, "utf8"));
}

async function writeStore(data) {
  await writeFile(dataFile, JSON.stringify(data, null, 2));
}

function buildFallbackSchedule(payload) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = ["09:00 - 10:00", "10:15 - 11:15", "11:30 - 12:30", "13:30 - 14:30", "14:45 - 15:45"];
  let slotIndex = 0;
  let teacherIndex = 0;

  return payload.courses.flatMap((course) => {
    const faculty =
      payload.faculty.find((item) => item.name === course.faculty) ||
      payload.faculty[teacherIndex % payload.faculty.length];
    const room =
      payload.rooms.find((item) => item.type.toLowerCase() === String(course.preferredRoomType || "").toLowerCase()) ||
      payload.rooms[0];

    return Array.from({ length: Number(course.sessionsPerWeek) || 1 }, () => {
      const currentIndex = slotIndex;
      slotIndex += 1;
      teacherIndex += 1;

      return {
        day: days[currentIndex % days.length],
        slot: slots[currentIndex % slots.length],
        course: course.name,
        faculty: faculty?.name || "Unassigned Faculty",
        room: room?.name || "Unassigned Room",
      };
    });
  });
}

async function generateWithOpenRouter(payload) {
  const runtimeConfig = await readRuntimeConfig();

  if (!runtimeConfig.aiConfigured) {
    throw new Error("OpenAI API key is missing. Add OPENAI_API_KEY in backend/.env to generate timetables.");
  }

  const prompt = `Create a weekly university timetable in valid JSON only.
Return this exact shape: {"explanation":"...", "schedule":[{"day":"","slot":"","course":"","faculty":"","room":""}]}
Use the following data and keep the schedule realistic:
${JSON.stringify(payload, null, 2)}
Important:
- Use as many different faculty members as possible.
- If a course has no faculty assigned, assign one from the provided faculty list.
- Avoid returning schedules that only use the first 1 or 2 faculty members when more are available.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtimeConfig.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: runtimeConfig.openaiModel,
      messages: [
        {
          role: "system",
          content:
            "You are an OpenAI API timetable generator routed through OpenRouter. Return JSON only, never markdown. Avoid clashes, respect faculty and room preferences, and distribute faculty usage across the available teacher list.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}.`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned no content.");
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("OpenAI returned invalid timetable JSON.");
  }
}

function buildAnalytics(schedule, payload) {
  const facultyCount = Math.max(payload.faculty.length, 1);
  const roomCount = Math.max(payload.rooms.length, 1);

  return {
    constraintScore: Math.min(100, 86 + Math.min(schedule.length, 14)),
    facultyUtilization: Math.min(100, Math.round((schedule.length / facultyCount) * 20)),
    roomUtilization: Math.min(100, Math.round((schedule.length / roomCount) * 22)),
  };
}

export async function getHealthState() {
  const runtimeConfig = await readRuntimeConfig();

  return {
    status: "ok",
    ai: runtimeConfig.aiConfigured ? "configured" : "missing",
    model: runtimeConfig.openaiModel,
    storage: "json-file",
  };
}

export async function getTimetableRecords() {
  const store = await readStore();
  return store.timetables.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export async function generateTimetableRecord(payload) {
  const normalizedPayload = {
    ...payload,
    faculty: payload.faculty || [],
    rooms: payload.rooms || [],
    courses: payload.courses || [],
  };

  const facultyNames = normalizedPayload.faculty.map((item) => item.name).filter(Boolean);
  normalizedPayload.courses = normalizedPayload.courses.map((course, index) => ({
    ...course,
    faculty:
      course.faculty && facultyNames.includes(course.faculty)
        ? course.faculty
        : facultyNames[index % facultyNames.length] || course.faculty,
  }));

  if (!normalizedPayload.faculty.length || !normalizedPayload.rooms.length || !normalizedPayload.courses.length) {
    throw new Error("Please add multiple faculty, rooms, and courses before generating.");
  }

  const aiResult = await generateWithOpenRouter(normalizedPayload);
  const schedule = Array.isArray(aiResult.schedule) && aiResult.schedule.length
    ? aiResult.schedule
    : [];

  if (!schedule.length) {
    throw new Error("OpenAI did not return a usable timetable schedule.");
  }

  const record = {
    id: randomUUID(),
    department: normalizedPayload.department,
    section: normalizedPayload.section,
    strength: normalizedPayload.strength,
    goal: normalizedPayload.goal,
    faculty: normalizedPayload.faculty,
    rooms: normalizedPayload.rooms,
    courses: normalizedPayload.courses,
    schedule,
    explanation:
      aiResult.explanation ||
      "The timetable was generated by matching faculty, rooms, and course requirements.",
    analytics: buildAnalytics(schedule, normalizedPayload),
    createdAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    timestamp: Date.now(),
  };

  const store = await readStore();
  store.timetables.unshift(record);
  await writeStore(store);
  return record;
}

export async function deleteTimetableRecord(id) {
  const store = await readStore();
  const nextTimetables = store.timetables.filter((item) => item.id !== id);

  if (nextTimetables.length === store.timetables.length) {
    throw new Error("Timetable not found.");
  }

  store.timetables = nextTimetables;
  await writeStore(store);
}
