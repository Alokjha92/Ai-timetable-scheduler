import { useEffect, useMemo, useState } from "react";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import LoadingScreen from "./components/LoadingScreen";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import AICopilotSection from "./components/sections/AICopilotSection";
import ForecastSection from "./components/sections/ForecastSection";
import OverviewSection from "./components/sections/OverviewSection";
import GeneratorSection from "./components/sections/GeneratorSection";
import FacultySection from "./components/sections/FacultySection";
import RoomsSection from "./components/sections/RoomsSection";
import AnalyticsSection from "./components/sections/AnalyticsSection";
import SettingsSection from "./components/sections/SettingsSection";
import { deleteTimetable, fetchDashboardData, generateTimetable } from "./services/api";
import { sendOtpEmail } from "./services/email";
import "./styles/app.css";

const sidebarItems = [
  { label: "Overview", icon: "grid" },
  { label: "Generate", icon: "spark" },
  { label: "AI Copilot", icon: "spark" },
  { label: "Forecasts", icon: "chart" },
  { label: "Faculty", icon: "users" },
  { label: "Rooms", icon: "building" },
  { label: "Courses", icon: "book" },
  { label: "Analytics", icon: "chart" },
  { label: "History", icon: "clock" },
  { label: "Settings", icon: "gear" },
];

const defaultGeneratorState = {
  department: "",
  section: "",
  strength: "",
  goal: "",
  faculty: [],
  rooms: [],
  courses: [],
};

const defaultAuthForm = {
  fullName: "Ayush Kumar",
  email: "admin@smarttimetable.ai",
  password: "",
  organization: "",
  otp: "",
};

const defaultAuthStatus = {
  otpSent: false,
  sendingOtp: false,
  verifyingOtp: false,
  generatedOtp: "",
  helper: "",
  error: "",
};

const loadingSteps = [
  "Collecting faculty, room, and course inputs",
  "Checking clashes and validating constraints",
  "Applying preference balancing and room matching",
  "Generating timetable candidates with AI assistance",
  "Fixing corrections and optimizing weak slots",
  "Preparing the final timetable for review",
];

function App() {
  const [screen, setScreen] = useState("landing");
  const [activeItem, setActiveItem] = useState("Overview");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(defaultAuthForm);
  const [authStatus, setAuthStatus] = useState(defaultAuthStatus);
  const [generatorState, setGeneratorState] = useState(defaultGeneratorState);
  const [dashboardData, setDashboardData] = useState({
    health: null,
    timetables: [],
    analytics: null,
  });
  const [loadingContext, setLoadingContext] = useState({
    active: false,
    title: "Preparing workspace",
    steps: loadingSteps,
    duration: 2000,
    nextScreen: "dashboard",
    nextItem: "Overview",
    onComplete: null,
  });
  const [error, setError] = useState("");

  const latestTimetable = dashboardData.timetables[0] || null;

  useEffect(() => {
    if (screen !== "dashboard") {
      return;
    }

    loadDashboardData();
  }, [screen]);

  async function loadDashboardData() {
    try {
      const data = await fetchDashboardData();
      setDashboardData(data);
      setError("");
    } catch (dashboardError) {
      setError(dashboardError.message);
    }
  }

  function updateAuthField(field, value) {
    setAuthForm((current) => ({ ...current, [field]: value }));
    setAuthStatus((current) => ({ ...current, error: "", helper: field === "otp" ? current.helper : "" }));
  }

  function updateGeneratorField(field, value) {
    setGeneratorState((current) => ({ ...current, [field]: value }));
  }

  function updateCollectionItem(collection, index, field, value) {
    setGeneratorState((current) => ({
      ...current,
      [collection]: current[collection].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addCollectionItem(collection, template) {
    setGeneratorState((current) => ({
      ...current,
      [collection]: [...current[collection], template],
    }));
  }

  function removeCollectionItem(collection, index) {
    setGeneratorState((current) => ({
      ...current,
      [collection]: current[collection].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function resetAuthState(nextMode = authMode) {
    setAuthMode(nextMode);
    setAuthForm((current) => ({
      ...defaultAuthForm,
      fullName: current.fullName || defaultAuthForm.fullName,
      email: current.email || defaultAuthForm.email,
      organization: nextMode === "signup" ? current.organization || "" : "",
    }));
    setAuthStatus(defaultAuthStatus);
  }

  function startLoader({ title, duration, nextScreen, nextItem, onComplete }) {
    setLoadingContext({
      active: true,
      title,
      steps: loadingSteps,
      duration,
      nextScreen,
      nextItem,
      onComplete,
    });
    setScreen("loading");
  }

  async function sendOtpCode() {
    const email = authForm.email.trim();
    const fullName = authForm.fullName.trim();

    if (!email) {
      setAuthStatus((current) => ({ ...current, error: "Enter your email before requesting an OTP." }));
      return;
    }

    if (authMode === "signup" && !fullName) {
      setAuthStatus((current) => ({ ...current, error: "Enter your full name before requesting an OTP." }));
      return;
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    try {
      setAuthStatus((current) => ({
        ...current,
        sendingOtp: true,
        error: "",
        helper: "",
      }));

      await sendOtpEmail({
        toEmail: email,
        toName: fullName || email,
        otp,
        mode: authMode,
      });

      setAuthStatus((current) => ({
        ...current,
        sendingOtp: false,
        otpSent: true,
        generatedOtp: otp,
        helper: `OTP sent to ${email}. Enter the 6-digit code to continue.`,
      }));
    } catch (otpError) {
      const rawMessage = otpError?.text || otpError?.message || "Failed to send OTP email.";
      const friendlyMessage = rawMessage.toLowerCase().includes("recipients address is empty")
        ? "EmailJS could not detect the recipient address. Check that your EmailJS template uses a recipient field like to_email or email."
        : rawMessage;

      setAuthStatus((current) => ({
        ...current,
        sendingOtp: false,
        error: friendlyMessage,
      }));
    }
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();

    if (!authStatus.otpSent) {
      await sendOtpCode();
      return;
    }

    if (authForm.otp.trim() !== authStatus.generatedOtp) {
      setAuthStatus((current) => ({
        ...current,
        error: "The OTP you entered is incorrect. Please try again.",
      }));
      return;
    }

    setAuthStatus((current) => ({
      ...current,
      verifyingOtp: true,
      error: "",
      helper: "OTP verified. Opening your workspace.",
    }));

    startLoader({
      title: authMode === "signup" ? "Creating your Smart Timetable workspace" : "Logging you into Smart Timetable AI",
      duration: 2000,
      nextScreen: "dashboard",
      nextItem: "Overview",
      onComplete: async () => {
        await loadDashboardData();
        setAuthStatus(defaultAuthStatus);
        setAuthForm((current) => ({ ...current, otp: "", password: "" }));
      },
    });
  }

  function handleSidebarChange(item) {
    if (item === activeItem) {
      return;
    }

    startLoader({
      title: `Opening ${item}`,
      duration: 2000,
      nextScreen: "dashboard",
      nextItem: item,
      onComplete: loadDashboardData,
    });
  }

  async function handleGenerate() {
    if (dashboardData.health?.ai !== "configured") {
      setError("OpenAI API key is required in backend/.env before timetable generation can run.");
      return;
    }

    if (
      !generatorState.department.trim() ||
      !generatorState.section.trim() ||
      !generatorState.faculty.length ||
      !generatorState.rooms.length ||
      !generatorState.courses.length
    ) {
      setError("Please add department, section, faculty, rooms, and courses before generating.");
      return;
    }

    startLoader({
      title: "Making your timetable ready",
      duration: 10000,
      nextScreen: "dashboard",
      nextItem: "Overview",
      onComplete: async () => {
        try {
          await generateTimetable(generatorState);
          await loadDashboardData();
          setError("");
        } catch (generationError) {
          setError(generationError.message);
        }
      },
    });
  }

  async function handleDeleteTimetable(id) {
    try {
      await deleteTimetable(id);
      await loadDashboardData();
      setError("");
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  function handleLogout() {
    setScreen("landing");
    setActiveItem("Overview");
    resetAuthState("login");
    setDashboardData({
      health: null,
      timetables: [],
      analytics: null,
    });
    setError("");
  }

  function handleAuthBack() {
    resetAuthState("login");
    setScreen("landing");
    setError("");
  }

  function handleDashboardBack() {
    if (activeItem !== "Overview") {
      setActiveItem("Overview");
      setError("");
      return;
    }

    handleLogout();
  }

  const overviewMetrics = useMemo(() => {
    const latestAnalytics = dashboardData.analytics;

    return [
      {
        label: "Saved timetables",
        value: String(dashboardData.timetables.length),
        detail: "All generated data is persisted by the backend",
      },
      {
        label: "Constraint score",
        value: latestAnalytics ? `${latestAnalytics.constraintScore}%` : "Pending",
        detail: "Measures how well hard rules and preferences are satisfied",
      },
      {
        label: "AI readiness",
        value:
          !dashboardData.health
            ? "Checking"
            : dashboardData.health.status !== "ok"
              ? "Backend Offline"
              : dashboardData.health?.ai === "configured"
                ? "Live"
                : "Missing Key",
        detail: `OpenAI powers timetable suggestions using ${dashboardData.health?.model || "a fixed backend model"}`,
      },
    ];
  }, [dashboardData]);

  function renderActiveSection() {
    switch (activeItem) {
      case "Generate":
        return (
          <GeneratorSection
            generatorState={generatorState}
            onFieldChange={updateGeneratorField}
            onCollectionItemChange={updateCollectionItem}
            onAddCollectionItem={addCollectionItem}
            onRemoveCollectionItem={removeCollectionItem}
            onGenerate={handleGenerate}
          />
        );
      case "AI Copilot":
        return (
          <AICopilotSection
            latestTimetable={latestTimetable}
            health={dashboardData.health}
          />
        );
      case "Forecasts":
        return (
          <ForecastSection
            latestTimetable={latestTimetable}
            faculty={generatorState.faculty}
            rooms={generatorState.rooms}
            courses={generatorState.courses}
          />
        );
      case "Faculty":
        return <FacultySection faculty={generatorState.faculty} />;
      case "Rooms":
        return <RoomsSection rooms={generatorState.rooms} />;
      case "Courses":
        return <FacultySection faculty={generatorState.courses} title="Course Planning" />;
      case "Analytics":
        return <AnalyticsSection analytics={dashboardData.analytics} timetables={dashboardData.timetables} />;
      case "History":
        return (
          <OverviewSection
            title="Generation History"
            subtitle="Previously generated timetables and OpenAI API backed explanations"
            timetables={dashboardData.timetables}
            metrics={overviewMetrics}
            onDelete={handleDeleteTimetable}
            compact
          />
        );
      case "Settings":
        return (
          <SettingsSection
            health={dashboardData.health}
            timetables={dashboardData.timetables}
            onDelete={handleDeleteTimetable}
          />
        );
      default:
        return (
          <OverviewSection
            title="Smart Timetable Project Dashboard"
            subtitle="A real project workspace for timetable generation, demand forecasting, constraint optimization, and OpenAI API assisted planning."
            timetables={dashboardData.timetables}
            metrics={overviewMetrics}
            onDelete={handleDeleteTimetable}
            latestTimetable={latestTimetable}
          />
        );
    }
  }

  if (screen === "landing") {
    return (
      <LandingPage
        onLogin={() => {
          resetAuthState("login");
          setScreen("auth");
        }}
        onSignup={() => {
          resetAuthState("signup");
          setScreen("auth");
        }}
      />
    );
  }

  if (screen === "auth") {
    return (
      <AuthPage
        mode={authMode}
        form={authForm}
        status={authStatus}
        onFieldChange={updateAuthField}
        onSubmit={handleAuthSubmit}
        onSendOtp={sendOtpCode}
        onBack={handleAuthBack}
        onSwitchMode={() => resetAuthState(authMode === "login" ? "signup" : "login")}
      />
    );
  }

  if (screen === "loading") {
    return (
      <LoadingScreen
        title={loadingContext.title}
        steps={loadingContext.steps}
        duration={loadingContext.duration}
        onComplete={async () => {
          setActiveItem(loadingContext.nextItem);
          setScreen(loadingContext.nextScreen);
          if (loadingContext.onComplete) {
            await loadingContext.onComplete();
          }
          setLoadingContext((current) => ({ ...current, active: false }));
        }}
      />
    );
  }

  return (
    <div className="dashboard-shell">
      <Sidebar
        items={sidebarItems}
        activeItem={activeItem}
        userName={authForm.fullName}
        onSelect={handleSidebarChange}
        onLogout={handleLogout}
      />
      <main className="dashboard-content">
        <DashboardHeader
          activeItem={activeItem}
          metrics={overviewMetrics}
          error={error}
          onBack={handleDashboardBack}
        />
        {renderActiveSection()}
      </main>
    </div>
  );
}

export default App;
