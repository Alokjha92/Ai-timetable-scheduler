import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  deleteTimetableRecord,
  generateTimetableRecord,
  getHealthState,
  getTimetableRecords,
} from "./services/timetableService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", async (_req, res) => {
  res.json({
    service: "smart-timetable-backend",
    status: "ok",
    api: "/api",
  });
});

app.get("/healthz", async (_req, res) => {
  res.json(await getHealthState());
});

app.get("/api/health", async (_req, res) => {
  res.json(await getHealthState());
});

app.get("/api/timetables", async (_req, res) => {
  res.json(await getTimetableRecords());
});

app.post("/api/timetables/generate", async (req, res) => {
  try {
    const record = await generateTimetableRecord(req.body);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to generate timetable." });
  }
});

app.delete("/api/timetables/:id", async (req, res) => {
  try {
    await deleteTimetableRecord(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ error: error.message || "Failed to delete timetable." });
  }
});

app.listen(port, () => {
  console.log(`Smart Timetable backend running on http://localhost:${port}`);
});
