"use client";

import FullCalendar from "@fullcalendar/react";
import type { EventDropArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import { addDays, differenceInCalendarDays, format, isPast, parseISO } from "date-fns";
import {
  AlertTriangle,
  Archive,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Download,
  FileText,
  Filter,
  Inbox,
  LayoutDashboard,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  Settings,
  Upload,
  XCircle
} from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import {
  checkConflicts,
  createBudget,
  createEventReport,
  createMarketingTasks,
  denialReasons,
  eventStatuses,
  recommendationToEvent
} from "@/lib/roadmap";
import type {
  DashboardState,
  EventCategory,
  EventRecommendation,
  EventStatus,
  EventTask,
  RoadmapEvent,
  ScoreFactors
} from "@/lib/types";

const storageKey = "on-par-marketing-roadmap-state";

const manualRecommendationSchema = z.object({
  title: z.string().min(3, "Event name is required."),
  concept: z.string().min(10, "Add a short event concept."),
  recommendedDate: z.string().min(1, "Suggested date is required."),
  intendedAudience: z.string().min(3, "Target audience is required."),
  category: z.string().min(1),
  estimatedTicketPrice: z.coerce.number().min(0),
  estimatedAttendance: z.coerce.number().min(1),
  reason: z.string().min(5, "Reason is required."),
  inspirationLink: z.string().optional(),
  notes: z.string().optional(),
  researchRequested: z.boolean().default(false)
});

const manualCalendarEventSchema = z.object({
  name: z.string().min(3, "Event name is required."),
  concept: z.string().min(10, "Add a short event concept."),
  date: z.string().min(1, "Event date is required."),
  startTime: z.string().min(1, "Start time is required."),
  endTime: z.string().min(1, "End time is required."),
  category: z.string().min(1),
  admissionType: z.enum(["Free", "Paid", "Donation", "Private"]),
  ticketPrice: z.coerce.number().min(0),
  expectedAttendance: z.coerce.number().min(1),
  audience: z.string().min(3, "Audience is required."),
  ageRestriction: z.string().min(2, "Age restriction is required."),
  owner: z.string().min(2, "Owner is required."),
  status: z.string().min(1)
});

type ActivePage =
  | "Dashboard"
  | "Master Calendar"
  | "Annual Roadmap"
  | "Yearly Marketing Plan"
  | "Recommendation Inbox"
  | "Event Research"
  | "Event Reports"
  | "Marketing Timeline"
  | "Tasks"
  | "Budget Overview"
  | "Past Performance"
  | "Imported Events"
  | "Sources"
  | "Settings";

const navItems: Array<{ label: ActivePage; icon: React.ElementType }> = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Master Calendar", icon: CalendarDays },
  { label: "Annual Roadmap", icon: CalendarDays },
  { label: "Yearly Marketing Plan", icon: Filter },
  { label: "Recommendation Inbox", icon: Inbox },
  { label: "Event Research", icon: Search },
  { label: "Event Reports", icon: FileText },
  { label: "Marketing Timeline", icon: ClipboardList },
  { label: "Tasks", icon: CheckCircle2 },
  { label: "Budget Overview", icon: DollarSign },
  { label: "Past Performance", icon: Archive },
  { label: "Imported Events", icon: Upload },
  { label: "Sources", icon: FileText },
  { label: "Settings", icon: Settings }
];

const eventCategories: EventCategory[] = [
  "Trivia",
  "Bingo",
  "Dating",
  "Mixer",
  "Tasting",
  "Holiday",
  "Competition",
  "Dance Party",
  "Customer Appreciation",
  "Imported",
  "Partner",
  "Food",
  "Other"
];

const statusColors: Record<string, string> = {
  Idea: "#8b8f8d",
  Researching: "#7257a8",
  "Recommendation Ready": "#4b74a8",
  "Needs Review": "#bd4777",
  "Tentatively Approved": "#f0b744",
  "Budget Review": "#a86f2d",
  Approved: "#12633d",
  Planning: "#4b74a8",
  Marketing: "#0d7d6b",
  "Registration Open": "#12633d",
  "Sold Out": "#7e251b",
  Completed: "#56615d",
  "Post-Event Review": "#65716d",
  Denied: "#c84c3c",
  Postponed: "#b7771f",
  Cancelled: "#7e251b",
  Archived: "#7a827f"
};

export function MarketingRoadmapApp({ initialState }: { initialState: DashboardState }) {
  const [state, setState] = useState<DashboardState>(() => loadState(initialState));
  const [activePage, setActivePage] = useState<ActivePage>("Dashboard");
  const [selectedEventId, setSelectedEventId] = useState<string>(state.events[0]?.id ?? "");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [message, setMessage] = useState("Ready. AI cannot approve or publish events automatically.");
  const [manualError, setManualError] = useState("");
  const [calendarEventDate, setCalendarEventDate] = useState<string | null>(null);
  const [calendarEventError, setCalendarEventError] = useState("");

  const selectedEvent = state.events.find((event) => event.id === selectedEventId) ?? state.events[0];

  const filteredEvents = useMemo(() => {
    return state.events.filter((event) => {
      const matchesSearch = [event.name, event.concept, event.audience, event.owner].join(" ").toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === "All" || event.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || event.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryFilter, searchText, state.events, statusFilter]);

  const tasks = useMemo(() => state.events.flatMap((event) => event.tasks.map((task) => ({ ...task, eventName: event.name }))), [state.events]);
  const overdueTasks = tasks.filter((task) => task.status === "Overdue" || (isPast(parseISO(task.dueDate)) && task.status !== "Done"));
  const nextEvent = state.events
    .filter((event) => differenceInCalendarDays(parseISO(event.date), new Date()) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const next30 = state.events.filter((event) => {
    const diff = differenceInCalendarDays(parseISO(event.date), new Date());
    return diff >= 0 && diff <= 30;
  });
  const awaitingApproval = state.recommendations.filter((recommendation) => recommendation.status === "Needs Review").length;
  const paidWeeksOpen = state.events.filter((event) => event.admissionType === "Paid" && ["Idea", "Needs Review"].includes(event.status)).length;

  function persist(nextState: DashboardState, successMessage: string) {
    setState(nextState);
    localStorage.setItem(storageKey, JSON.stringify(nextState));
    setMessage(successMessage);
  }

  function updateEvent(eventId: string, updates: Partial<RoadmapEvent>, successMessage = "Event updated.") {
    const nextEvents = state.events.map((event) => (event.id === eventId ? { ...event, ...updates } : event));
    const rechecked = nextEvents.map((event) => ({ ...event, warnings: checkConflicts(event, nextEvents) }));
    persist({ ...state, events: rechecked }, successMessage);
  }

  function handleCalendarDateClick(info: DateClickArg) {
    setCalendarEventDate(info.dateStr);
    setCalendarEventError("");
    setMessage(`Adding a manual event for ${format(parseISO(info.dateStr), "MMMM d, yyyy")}.`);
  }

  function handleCalendarEventSubmit(formData: FormData) {
    const parsed = manualCalendarEventSchema.safeParse({
      name: formData.get("name"),
      concept: formData.get("concept"),
      date: formData.get("date"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      category: formData.get("category"),
      admissionType: formData.get("admissionType"),
      ticketPrice: formData.get("ticketPrice"),
      expectedAttendance: formData.get("expectedAttendance"),
      audience: formData.get("audience"),
      ageRestriction: formData.get("ageRestriction"),
      owner: formData.get("owner"),
      status: formData.get("status")
    });

    if (!parsed.success) {
      setCalendarEventError(parsed.error.issues[0]?.message ?? "Unable to add event.");
      return;
    }

    const data = parsed.data;
    const date = parseISO(data.date);
    const eventSize = data.admissionType === "Paid" ? "Standard" : "Small";
    const newEvent: RoadmapEvent = {
      id: `manual-event-${Date.now()}`,
      name: data.name,
      concept: data.concept,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      category: data.category as EventCategory,
      admissionType: data.admissionType,
      ticketPrice: data.admissionType === "Paid" ? data.ticketPrice : data.ticketPrice || undefined,
      status: data.status as EventStatus,
      audience: data.audience,
      ageRestriction: data.ageRestriction,
      expectedAttendance: data.expectedAttendance,
      owner: data.owner,
      planningProgress: 10,
      marketingProgress: 0,
      marketingStage: "Concept",
      profitability: data.admissionType === "Paid" ? "Unknown" : "Moderate",
      internalOrPartner: "Internal",
      source: "Manual",
      warnings: [],
      report: createEventReport(data.name, data.category as EventCategory, date, data.ticketPrice),
      tasks: createMarketingTasks(date, eventSize),
      budget: createBudget(data.expectedAttendance, data.admissionType === "Paid" ? data.ticketPrice : 0),
      auditHistory: [
        {
          id: `audit-${Date.now()}`,
          date: new Date().toISOString(),
          actor: "Marketing user",
          action: "Manual calendar event created",
          notes: "Created by clicking a calendar day. Human approval still controls publishing."
        }
      ]
    };
    const nextEvents = [...state.events, newEvent].map((event) => ({ ...event, warnings: checkConflicts(event, [...state.events, newEvent]) }));
    persist({ ...state, events: nextEvents }, `${data.name} was added to ${format(date, "MMMM d, yyyy")}.`);
    setCalendarEventDate(null);
    setCalendarEventError("");
    setSelectedEventId(newEvent.id);
    setActivePage("Event Reports");
  }

  function approveRecommendation(recommendation: EventRecommendation) {
    const newEvent = recommendationToEvent(recommendation);
    const nextRecommendations = state.recommendations.map((item) =>
      item.id === recommendation.id ? { ...item, status: "Tentatively Approved" as EventStatus } : item
    );
    const nextEvents = [...state.events, newEvent].map((event) => ({ ...event, warnings: checkConflicts(event, [...state.events, newEvent]) }));
    persist({ ...state, events: nextEvents, recommendations: nextRecommendations }, `${recommendation.title} was added as tentative. It is not published.`);
    setSelectedEventId(newEvent.id);
  }

  function denyRecommendation(recommendation: EventRecommendation) {
    const reason = window.prompt(`Denial reason for ${recommendation.title}`, "Poor timing");
    if (!reason) return;
    const nextRecommendations = state.recommendations.map((item) =>
      item.id === recommendation.id ? { ...item, status: "Denied" as EventStatus, denialReason: reason } : item
    );
    persist({ ...state, recommendations: nextRecommendations }, `${recommendation.title} was denied and saved with the reason: ${reason}`);
  }

  function archiveRecommendation(recommendation: EventRecommendation) {
    const nextRecommendations = state.recommendations.map((item) =>
      item.id === recommendation.id ? { ...item, status: "Archived" as EventStatus } : item
    );
    persist({ ...state, recommendations: nextRecommendations }, `${recommendation.title} was archived.`);
  }

  function requestMoreResearch(recommendation: EventRecommendation) {
    const nextRecommendations = state.recommendations.map((item) =>
      item.id === recommendation.id
        ? {
            ...item,
            status: "Researching" as EventStatus,
            researchSources: [
              ...item.researchSources,
              {
                title: "Research requested by staff",
                url: "https://onparbar.com/",
                publisher: "Internal note",
                searchDate: new Date().toISOString(),
                summary: "Research queue item created. Configure web-search and LLM environment variables to produce cited live research.",
                excerpt: "Requires Verification",
                reliability: "Requires Verification" as const
              }
            ]
          }
        : item
    );
    persist({ ...state, recommendations: nextRecommendations }, `More research requested for ${recommendation.title}.`);
  }

  function mergeRecommendation(recommendation: EventRecommendation) {
    if (!selectedEvent) return;
    updateEvent(
      selectedEvent.id,
      {
        concept: `${selectedEvent.concept}\n\nMerged recommendation: ${recommendation.title} - ${recommendation.concept}`,
        auditHistory: [
          ...selectedEvent.auditHistory,
          {
            id: `audit-${Date.now()}`,
            date: new Date().toISOString(),
            actor: "Marketing user",
            action: "Merged recommendation",
            notes: recommendation.title
          }
        ]
      },
      `${recommendation.title} was merged into ${selectedEvent.name}.`
    );
  }

  function handleManualSubmit(formData: FormData) {
    const parsed = manualRecommendationSchema.safeParse({
      title: formData.get("title"),
      concept: formData.get("concept"),
      recommendedDate: formData.get("recommendedDate"),
      intendedAudience: formData.get("intendedAudience"),
      category: formData.get("category"),
      estimatedTicketPrice: formData.get("estimatedTicketPrice"),
      estimatedAttendance: formData.get("estimatedAttendance"),
      reason: formData.get("reason"),
      inspirationLink: formData.get("inspirationLink"),
      notes: formData.get("notes"),
      researchRequested: formData.get("researchRequested") === "on"
    });

    if (!parsed.success) {
      setManualError(parsed.error.issues[0]?.message ?? "Unable to submit recommendation.");
      return;
    }

    setManualError("");
    const data = parsed.data;
    const factors = defaultScoreFactors();
    const recommendation: EventRecommendation = {
      id: `manual-${Date.now()}`,
      title: data.title,
      concept: data.concept,
      recommendedDate: data.recommendedDate,
      recommendedDayOfWeek: format(parseISO(data.recommendedDate), "EEEE"),
      recommendedStartTime: "7:00 PM",
      estimatedTicketPrice: data.estimatedTicketPrice,
      estimatedAttendance: data.estimatedAttendance,
      intendedAudience: data.intendedAudience,
      category: data.category as EventCategory,
      reason: data.reason,
      seasonalRelevance: data.notes || "Staff-submitted idea. Seasonal fit requires research.",
      researchSources: data.inspirationLink
        ? [
            {
              title: "Staff inspiration link",
              url: data.inspirationLink,
              publisher: "Staff supplied",
              searchDate: new Date().toISOString(),
              summary: "Manual source added by staff. Verify before approval.",
              excerpt: "Requires Verification",
              reliability: "Requires Verification"
            }
          ]
        : [],
      planningDifficulty: "Medium",
      marketingDifficulty: "Medium",
      revenuePotential: data.estimatedTicketPrice > 0 ? "Moderate" : "Low",
      riskLevel: data.category === "Tasting" ? "High" : "Medium",
      confidenceScore: 72,
      similarOnParEvents: [],
      potentialConflicts: [],
      status: data.researchRequested ? "Researching" : "Needs Review",
      source: "Manual Staff Submission",
      scoreFactors: factors
    };
    persist({ ...state, recommendations: [recommendation, ...state.recommendations] }, `${data.title} was added to the recommendation inbox.`);
  }

  function refreshRecommendations(rangeLabel: string) {
    const createdAt = new Date();
    const recommendation: EventRecommendation = {
      id: `refresh-${Date.now()}`,
      title: `${format(createdAt, "MMMM")} Paid Event Gap Recommendation`,
      concept: "A researched placeholder for an open paid-event week. Configure LLM and web-search keys to replace this dry-run with cited recommendations.",
      recommendedDate: format(addDays(createdAt, 45), "yyyy-MM-dd"),
      recommendedDayOfWeek: format(addDays(createdAt, 45), "EEEE"),
      recommendedStartTime: "7:00 PM",
      estimatedTicketPrice: 18,
      estimatedAttendance: 80,
      intendedAudience: "On Par guests and Dayton-area social groups",
      category: "Mixer",
      reason: "Manual refresh identified a future paid-event opening. Source-backed research is still required.",
      seasonalRelevance: "Requires Verification",
      researchSources: [
        {
          title: "Dry-run recommendation",
          url: "https://onparbar.com/",
          publisher: "On Par Entertainment",
          searchDate: new Date().toISOString(),
          summary: "This dry-run does not call external APIs. It proves the recommendation workflow without auto-approval.",
          excerpt: "Human approval required.",
          reliability: "Requires Verification"
        }
      ],
      planningDifficulty: "Medium",
      marketingDifficulty: "Medium",
      revenuePotential: "Moderate",
      riskLevel: "Medium",
      confidenceScore: 68,
      similarOnParEvents: [],
      potentialConflicts: [],
      status: "Needs Review",
      source: "AI Generated",
      scoreFactors: defaultScoreFactors()
    };

    persist(
      {
        ...state,
        recommendations: [recommendation, ...state.recommendations],
        researchRuns: [
          {
            id: `research-${Date.now()}`,
            runAt: new Date().toISOString(),
            rangeLabel,
            queriesUsed: ["open paid-event weeks", "seasonal On Par event opportunity", "Dayton entertainment trend"],
            sourcesReviewed: 0,
            recommendationsCreated: 1,
            duplicatesSkipped: 0,
            errors: ["Dry run only. Configure WEB_SEARCH_API_KEY and AI_GATEWAY_API_KEY for live cited research."],
            tokenUsage: "0",
            searchCosts: "$0.00"
          },
          ...state.researchRuns
        ]
      },
      `Recommendation refresh completed for ${rangeLabel}. Human review is still required.`
    );
  }

  function handleEventDrop(info: EventDropArg) {
    const event = state.events.find((item) => item.id === info.event.id);
    if (!event) return;
    const newDate = info.event.start ? format(info.event.start, "yyyy-MM-dd") : event.date;
    const moved = { ...event, date: newDate, tasks: createMarketingTasks(parseISO(newDate), event.isAnniversary ? "Anniversary" : event.admissionType === "Paid" ? "Standard" : "Small") };
    const warnings = checkConflicts(moved, state.events.map((item) => (item.id === event.id ? moved : item)));
    const warningText = warnings.map((warning) => warning.message).join("\n");
    if (warningText && !window.confirm(`Move event with these warnings?\n\n${warningText}`)) {
      info.revert();
      return;
    }
    updateEvent(event.id, { ...moved, warnings }, `${event.name} moved to ${format(parseISO(newDate), "MMM d, yyyy")}.`);
  }

  function importCsv(file: File) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const rows = String(reader.result)
        .split(/\r?\n/)
        .map((row) => row.trim())
        .filter(Boolean);
      const imported = rows.slice(1).map((row, index) => {
        const [date, name, category = "Imported", ticketPrice = "0"] = row.split(",");
        const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : format(addDays(new Date(), index + 14), "yyyy-MM-dd");
        const price = Number(ticketPrice) || 0;
        return {
          ...recommendationToEvent({
            id: `import-${Date.now()}-${index}`,
            title: name || `Imported Event ${index + 1}`,
            concept: "Imported existing event. Original description should be verified after import.",
            recommendedDate: parsedDate,
            recommendedDayOfWeek: format(parseISO(parsedDate), "EEEE"),
            recommendedStartTime: "7:00 PM",
            estimatedTicketPrice: price,
            estimatedAttendance: 50,
            intendedAudience: "Imported audience needs review",
            category: category as EventCategory,
            reason: "Imported from CSV",
            seasonalRelevance: "Imported Existing Event",
            researchSources: [],
            planningDifficulty: "Medium",
            marketingDifficulty: "Medium",
            revenuePotential: price > 0 ? "Moderate" : "Low",
            riskLevel: "Medium",
            confidenceScore: 50,
            similarOnParEvents: [],
            potentialConflicts: [],
            status: "Needs Review",
            source: "Imported Event",
            scoreFactors: defaultScoreFactors()
          }),
          id: `imported-${Date.now()}-${index}`,
          status: "Needs Review" as EventStatus,
          category: "Imported" as EventCategory,
          source: "Imported Existing Event" as const,
          isImported: true
        };
      });
      persist({ ...state, events: [...state.events, ...imported] }, `${imported.length} imported events added for review.`);
    });
    reader.readAsText(file);
  }

  function exportState() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "on-par-marketing-roadmap-export.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetState() {
    if (!window.confirm("Reset local roadmap draft to the current seed data?")) return;
    localStorage.removeItem(storageKey);
    setState(initialState);
    setMessage("Local draft reset to seed data.");
  }

  return (
    <div className="min-h-screen bg-sand text-ink">
      <header className="no-print border-b-4 border-lime bg-[#11251b] px-5 py-5 text-white lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-lime">On Par Entertainment</p>
            <h1 className="mt-1 text-3xl font-black tracking-normal md:text-5xl">On Par Marketing Roadmap</h1>
            <p className="mt-2 max-w-4xl text-sm text-white/78 md:text-base">
              Rolling 12-month planning dashboard for recurring trivia, recurring bingo, paid event gaps, approvals, reports, tasks, imports, and research logs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => refreshRecommendations("Next 90 days")} icon={RefreshCw}>
              Refresh Recommendations
            </Button>
            <Button onClick={exportState} icon={Download}>
              Export
            </Button>
            <Button onClick={() => window.print()} icon={Printer}>
              Print
            </Button>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="no-print border-b border-[#d9dedb] bg-white p-4 shadow-panel lg:min-h-screen lg:border-b-0 lg:border-r">
          <nav className="grid gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-bold transition ${
                    activePage === item.label ? "border-moss bg-[#edf8ed] text-moss" : "border-transparent hover:border-[#d9dedb] hover:bg-sand"
                  }`}
                  onClick={() => setActivePage(item.label)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-5 rounded-lg border border-[#d9dedb] bg-sand p-3 text-xs text-muted">
            <p className="font-bold text-ink">Human approval gate</p>
            <p className="mt-1">AI and cron workflows can recommend, research, and draft reports, but cannot confirm, publish, contact vendors, or spend money.</p>
          </div>
        </aside>

        <main className="p-4 lg:p-6">
          <div className="no-print mb-4 rounded-lg border border-[#d9dedb] bg-white p-3 text-sm shadow-panel">
            <span className="font-bold">Status:</span> {message}
          </div>

          {activePage === "Dashboard" && (
            <DashboardView
              nextEvent={nextEvent}
              next30={next30.length}
              paidWeeksOpen={paidWeeksOpen}
              awaitingApproval={awaitingApproval}
              overdueTasks={overdueTasks.length}
              events={state.events}
              recommendations={state.recommendations}
              setActivePage={setActivePage}
            />
          )}

          {activePage === "Master Calendar" && (
            <section className="grid gap-4">
              <FilterBar
                searchText={searchText}
                setSearchText={setSearchText}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
              <div className="rounded-lg border border-[#d9dedb] bg-white p-3 shadow-panel">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,listMonth"
                  }}
                  height="auto"
                  editable
                  selectable
                  droppable={false}
                  dateClick={handleCalendarDateClick}
                  eventDrop={handleEventDrop}
                  eventClick={(info) => {
                    setSelectedEventId(info.event.id);
                    setActivePage("Event Reports");
                  }}
                  events={filteredEvents.map((event) => ({
                    id: event.id,
                    title: `${event.name} (${event.status})`,
                    start: event.date,
                    backgroundColor: statusColors[event.status],
                    borderColor: statusColors[event.status]
                  }))}
                />
              </div>
            </section>
          )}

          {activePage === "Annual Roadmap" && <AnnualRoadmap events={filteredEvents} onSelect={(id) => { setSelectedEventId(id); setActivePage("Event Reports"); }} />}

          {activePage === "Yearly Marketing Plan" && <YearlyMarketingPlanView plan={state.yearlyPlan} />}

          {activePage === "Recommendation Inbox" && (
            <RecommendationInbox
              recommendations={state.recommendations}
              onApprove={approveRecommendation}
              onDeny={denyRecommendation}
              onArchive={archiveRecommendation}
              onResearch={requestMoreResearch}
              onMerge={mergeRecommendation}
              onRefresh={refreshRecommendations}
            />
          )}

          {activePage === "Event Research" && (
            <ResearchView
              recommendations={state.recommendations}
              researchRuns={state.researchRuns}
              onRefresh={refreshRecommendations}
              manualError={manualError}
              onSubmit={handleManualSubmit}
            />
          )}

          {activePage === "Event Reports" && selectedEvent && (
            <EventReportView event={selectedEvent} onUpdate={updateEvent} onPrint={() => window.print()} />
          )}

          {activePage === "Marketing Timeline" && <TimelineView events={state.events} tasks={tasks} />}
          {activePage === "Tasks" && <TasksView tasks={tasks} />}
          {activePage === "Budget Overview" && <BudgetView events={state.events} />}
          {activePage === "Past Performance" && <PastPerformanceView events={state.events} />}
          {activePage === "Imported Events" && <ImportView events={state.events} onImport={importCsv} />}
          {activePage === "Sources" && <SourcesView recommendations={state.recommendations} />}
          {activePage === "Settings" && <SettingsView templates={state.templates} onReset={resetState} />}
        </main>
      </div>
      {calendarEventDate && (
        <CalendarEventModal
          date={calendarEventDate}
          error={calendarEventError}
          onClose={() => {
            setCalendarEventDate(null);
            setCalendarEventError("");
          }}
          onSubmit={handleCalendarEventSubmit}
        />
      )}
    </div>
  );
}

function CalendarEventModal({
  date,
  error,
  onClose,
  onSubmit
}: {
  date: string;
  error: string;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  return (
    <div className="no-print fixed inset-0 z-50 grid place-items-center bg-[#11251b]/70 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-lg border border-[#d9dedb] bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-moss">Manual Calendar Event</p>
            <h2 className="text-2xl font-black tracking-normal">Add Event for {format(parseISO(date), "MMMM d, yyyy")}</h2>
            <p className="mt-1 text-sm text-muted">This creates an internal planning event. It does not publish or confirm anything publicly.</p>
          </div>
          <button className="rounded-lg border border-[#cbd3cf] px-3 py-2 text-sm font-black hover:border-moss hover:text-moss" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <form action={onSubmit} className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <FormInput name="name" label="Event name" defaultValue="New On Par Event" />
            <FormInput name="date" label="Event date" type="date" defaultValue={date} />
            <FormInput name="startTime" label="Start time" type="time" defaultValue="19:00" />
            <FormInput name="endTime" label="End time" type="time" defaultValue="21:00" />
            <label className="grid gap-1 text-sm font-bold">
              Category
              <select name="category" className="rounded-lg border border-[#cbd3cf] px-3 py-2 font-normal" defaultValue="Other">
                {eventCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Free or paid
              <select name="admissionType" className="rounded-lg border border-[#cbd3cf] px-3 py-2 font-normal" defaultValue="Paid">
                {["Free", "Paid", "Donation", "Private"].map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <FormInput name="ticketPrice" label="Ticket price" type="number" defaultValue="15" />
            <FormInput name="expectedAttendance" label="Expected attendance" type="number" defaultValue="75" />
            <FormInput name="audience" label="Audience" defaultValue="On Par guests" />
            <FormInput name="ageRestriction" label="Age restriction" defaultValue="Management to confirm" />
            <FormInput name="owner" label="Planning owner" defaultValue="Marketing" />
            <label className="grid gap-1 text-sm font-bold">
              Planning status
              <select name="status" className="rounded-lg border border-[#cbd3cf] px-3 py-2 font-normal" defaultValue="Idea">
                {eventStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>
          <FormText name="concept" label="Event concept" defaultValue="Describe the event idea, audience, food/drink angle, entertainment needs, and promotion notes." />
          {error && <p className="rounded-lg bg-[#fff0ed] p-2 text-sm font-bold text-[#7e251b]">{error}</p>}
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" icon={Plus}>Add Event</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DashboardView({
  nextEvent,
  next30,
  paidWeeksOpen,
  awaitingApproval,
  overdueTasks,
  events,
  recommendations,
  setActivePage
}: {
  nextEvent?: RoadmapEvent;
  next30: number;
  paidWeeksOpen: number;
  awaitingApproval: number;
  overdueTasks: number;
  events: RoadmapEvent[];
  recommendations: EventRecommendation[];
  setActivePage: (page: ActivePage) => void;
}) {
  const projectedRevenue = events.reduce((sum, event) => sum + event.budget[1].ticketRevenue + event.budget[1].foodRevenue + event.budget[1].beverageRevenue, 0);
  const missingReports = events.filter((event) => !event.report).length;
  const missingPricing = events.filter((event) => event.admissionType === "Paid" && !event.ticketPrice).length;

  return (
    <section className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="Next Event" value={nextEvent ? format(parseISO(nextEvent.date), "MMM d") : "None"} detail={nextEvent?.name ?? "No upcoming event"} />
        <Metric title="Next 30 Days" value={String(next30)} detail="Events on the active roadmap" />
        <Metric title="Open Paid Weeks" value={String(paidWeeksOpen)} detail="Ideas or needs-review paid slots" />
        <Metric title="Awaiting Approval" value={String(awaitingApproval)} detail="Recommendations in inbox" />
        <Metric title="Missing Reports" value={String(missingReports)} detail="Events without report records" />
        <Metric title="Missing Pricing" value={String(missingPricing)} detail="Paid events needing price" />
        <Metric title="Overdue Tasks" value={String(overdueTasks)} detail="Marketing or planning deadlines" />
        <Metric title="Projected Revenue" value={`$${projectedRevenue.toLocaleString()}`} detail="Expected scenario estimate" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Planning Alerts">
          <div className="grid gap-2">
            {events
              .flatMap((event) => event.warnings.map((warning) => ({ event, warning })))
              .slice(0, 8)
              .map(({ event, warning }) => (
                <div key={`${event.id}-${warning.id}`} className="rounded-lg border border-[#f2d4cc] bg-[#fff0ed] p-3 text-sm">
                  <p className="font-bold">{warning.type}: {event.name}</p>
                  <p className="text-muted">{warning.message}</p>
                </div>
              ))}
          </div>
        </Panel>
        <Panel title="Recommendation Queue">
          <div className="grid gap-2">
            {recommendations.slice(0, 5).map((recommendation) => (
              <button
                key={recommendation.id}
                className="rounded-lg border border-[#d9dedb] p-3 text-left hover:border-moss"
                onClick={() => setActivePage("Recommendation Inbox")}
              >
                <p className="font-bold">{recommendation.title}</p>
                <p className="text-xs text-muted">Score {recommendation.confidenceScore} | {recommendation.status}</p>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function FilterBar(props: {
  searchText: string;
  setSearchText: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
}) {
  return (
    <div className="no-print grid gap-3 rounded-lg border border-[#d9dedb] bg-white p-3 shadow-panel lg:grid-cols-[1fr_220px_220px]">
      <label className="grid gap-1 text-sm font-bold">
        Search
        <input className="rounded-lg border border-[#cbd3cf] px-3 py-2 font-normal" value={props.searchText} onChange={(event) => props.setSearchText(event.target.value)} />
      </label>
      <label className="grid gap-1 text-sm font-bold">
        Status
        <select className="rounded-lg border border-[#cbd3cf] px-3 py-2 font-normal" value={props.statusFilter} onChange={(event) => props.setStatusFilter(event.target.value)}>
          <option>All</option>
          {eventStatuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-bold">
        Category
        <select className="rounded-lg border border-[#cbd3cf] px-3 py-2 font-normal" value={props.categoryFilter} onChange={(event) => props.setCategoryFilter(event.target.value)}>
          <option>All</option>
          {eventCategories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </label>
    </div>
  );
}

function AnnualRoadmap({ events, onSelect }: { events: RoadmapEvent[]; onSelect: (id: string) => void }) {
  const grouped = groupBy(events, (event) => event.date.slice(0, 7));
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Object.entries(grouped).map(([month, monthEvents]) => (
        <Panel key={month} title={format(parseISO(`${month}-01`), "MMMM yyyy")}>
          <div className="grid gap-2">
            {monthEvents.sort((a, b) => a.date.localeCompare(b.date)).map((event) => (
              <button key={event.id} className="rounded-lg border border-[#d9dedb] p-3 text-left hover:border-moss" onClick={() => onSelect(event.id)}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold">{event.name}</p>
                  <StatusBadge status={event.status} />
                </div>
                <p className="text-xs text-muted">{format(parseISO(event.date), "EEE, MMM d")} | {event.category} | {event.admissionType}</p>
              </button>
            ))}
          </div>
        </Panel>
      ))}
    </section>
  );
}

function YearlyMarketingPlanView({ plan }: { plan: DashboardState["yearlyPlan"] }) {
  return (
    <section className="grid gap-4">
      <Panel
        title="Yearly Marketing Plan"
        action={<span className="rounded-full bg-[#edf8ed] px-3 py-1 text-xs font-black text-moss">Rolling 12 months</span>}
      >
        <p className="text-sm text-muted">
          Researched plan for August 2026 through July 2027. It combines federal holidays, Dayton-area happenings, major sports/entertainment moments, food/social media hooks, and On Par's existing trivia/bingo/fandom themes. Verify dates and licensing before publishing public campaigns.
        </p>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        {plan.map((month) => (
          <Panel key={month.month} title={month.month}>
            <div className="grid gap-4">
              <div>
                <p className="text-xs font-black uppercase text-muted">Strategy</p>
                <p className="mt-1 text-sm">{month.strategy}</p>
              </div>
              <PlanList title="Calendar anchors" items={month.calendarAnchors} />
              <PlanList title="On Par tie-ins" items={month.onParTieIns} />
              <PlanList title="Best event ideas" items={month.recommendedEvents} />
              <PlanList title="Content angles" items={month.contentAngles} />
              <PlanList title="Timing notes" items={month.timingNotes} />
              <div>
                <p className="text-xs font-black uppercase text-muted">Sources</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {month.sources.map((source) => (
                    <a
                      key={`${month.month}-${source.url}`}
                      className="rounded-full border border-[#cbd3cf] px-3 py-1 text-xs font-bold text-moss hover:border-moss"
                      href={source.url}
                      target="_blank"
                    >
                      {source.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </section>
  );
}

function PlanList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-black uppercase text-muted">{title}</p>
      <ul className="mt-2 grid gap-1 pl-5 text-sm">
        {items.map((item) => (
          <li className="list-disc" key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function RecommendationInbox(props: {
  recommendations: EventRecommendation[];
  onApprove: (recommendation: EventRecommendation) => void;
  onDeny: (recommendation: EventRecommendation) => void;
  onArchive: (recommendation: EventRecommendation) => void;
  onResearch: (recommendation: EventRecommendation) => void;
  onMerge: (recommendation: EventRecommendation) => void;
  onRefresh: (range: string) => void;
}) {
  return (
    <section className="grid gap-4">
      <div className="no-print flex flex-wrap gap-2">
        {["Next 30 days", "Next 90 days", "Next 6 months", "Next 12 months", "Fall season"].map((range) => (
          <Button key={range} onClick={() => props.onRefresh(range)} icon={RefreshCw}>{range}</Button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {props.recommendations.map((recommendation) => (
          <Panel key={recommendation.id} title={recommendation.title} action={<StatusBadge status={recommendation.status} />}>
            <p className="text-sm text-muted">{recommendation.concept}</p>
            <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
              <Info label="Recommended date" value={`${format(parseISO(recommendation.recommendedDate), "MMM d, yyyy")} (${recommendation.recommendedDayOfWeek})`} />
              <Info label="Ticket price" value={`$${recommendation.estimatedTicketPrice} estimated`} />
              <Info label="Attendance" value={`${recommendation.estimatedAttendance} estimated`} />
              <Info label="Audience" value={recommendation.intendedAudience} />
              <Info label="Risk" value={recommendation.riskLevel} />
              <Info label="Confidence" value={`${recommendation.confidenceScore}/100`} />
            </div>
            <p className="mt-3 text-sm"><span className="font-bold">Reason:</span> {recommendation.reason}</p>
            <ScoreGrid factors={recommendation.scoreFactors} />
            {recommendation.denialReason && <p className="mt-3 rounded-lg bg-[#fff0ed] p-2 text-sm font-bold text-[#7e251b]">Denied: {recommendation.denialReason}</p>}
            <div className="no-print mt-4 flex flex-wrap gap-2">
              <Button onClick={() => props.onApprove(recommendation)} icon={CheckCircle2}>Approve Tentative</Button>
              <Button onClick={() => props.onDeny(recommendation)} icon={XCircle}>Deny</Button>
              <Button onClick={() => props.onResearch(recommendation)} icon={Search}>More Research</Button>
              <Button onClick={() => props.onMerge(recommendation)} icon={Plus}>Merge</Button>
              <Button onClick={() => props.onArchive(recommendation)} icon={Archive}>Archive</Button>
            </div>
          </Panel>
        ))}
      </div>
    </section>
  );
}

function ResearchView(props: {
  recommendations: EventRecommendation[];
  researchRuns: DashboardState["researchRuns"];
  onRefresh: (range: string) => void;
  manualError: string;
  onSubmit: (formData: FormData) => void;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Panel title="Staff Recommendation Form">
        <form action={props.onSubmit} className="grid gap-3">
          <FormInput name="title" label="Event name" />
          <FormText name="concept" label="Event concept" />
          <div className="grid gap-3 md:grid-cols-2">
            <FormInput name="recommendedDate" label="Suggested date" type="date" />
            <label className="grid gap-1 text-sm font-bold">
              Event category
              <select name="category" className="rounded-lg border border-[#cbd3cf] px-3 py-2 font-normal">
                {eventCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <FormInput name="intendedAudience" label="Target audience" />
            <FormInput name="estimatedTicketPrice" label="Suggested ticket price" type="number" defaultValue="15" />
            <FormInput name="estimatedAttendance" label="Estimated attendance" type="number" defaultValue="75" />
            <FormInput name="inspirationLink" label="Inspiration link" />
          </div>
          <FormText name="reason" label="Reason for suggestion" />
          <FormText name="notes" label="Food, drink, decor, entertainment, and notes" />
          <label className="flex items-center gap-2 text-sm font-bold">
            <input name="researchRequested" type="checkbox" className="h-4 w-4 accent-moss" />
            Research this event after submission
          </label>
          {props.manualError && <p className="rounded-lg bg-[#fff0ed] p-2 text-sm font-bold text-[#7e251b]">{props.manualError}</p>}
          <Button type="submit" icon={Plus}>Submit Recommendation</Button>
        </form>
      </Panel>

      <Panel title="Monthly Research Log">
        <div className="no-print mb-3 flex flex-wrap gap-2">
          {["Next 30 days", "Next 90 days", "Next 6 months", "Next 12 months"].map((range) => (
            <Button key={range} onClick={() => props.onRefresh(range)} icon={RefreshCw}>{range}</Button>
          ))}
        </div>
        <div className="grid gap-3">
          {props.researchRuns.map((run) => (
            <div key={run.id} className="rounded-lg border border-[#d9dedb] p-3 text-sm">
              <p className="font-bold">{run.rangeLabel}</p>
              <p className="text-muted">{format(parseISO(run.runAt), "MMM d, yyyy h:mm a")}</p>
              <p>Queries: {run.queriesUsed.join(", ")}</p>
              <p>Recommendations created: {run.recommendationsCreated}; duplicates skipped: {run.duplicatesSkipped}</p>
              <p>Token usage: {run.tokenUsage}; search costs: {run.searchCosts}</p>
              {run.errors.map((error) => <p key={error} className="mt-1 text-[#7e251b]">{error}</p>)}
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function EventReportView({ event, onUpdate, onPrint }: { event: RoadmapEvent; onUpdate: (id: string, updates: Partial<RoadmapEvent>, message?: string) => void; onPrint: () => void }) {
  const [draft, setDraft] = useState(event);
  const report = draft.report;

  function save() {
    onUpdate(event.id, draft, `${draft.name} report saved.`);
  }

  return (
    <section className="grid gap-4">
      <div className="no-print flex flex-wrap gap-2">
        <Button onClick={save} icon={Save}>Save Report</Button>
        <Button onClick={onPrint} icon={Printer}>Print Event Packet</Button>
        <select className="rounded-lg border border-[#cbd3cf] bg-white px-3 py-2 text-sm font-bold" value={draft.status} onChange={(change) => setDraft({ ...draft, status: change.target.value as EventStatus })}>
          {eventStatuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </div>

      <Panel title={draft.name} action={<StatusBadge status={draft.status} />}>
        <div className="grid gap-3 md:grid-cols-2">
          <FormInput label="Event name" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
          <FormInput label="Date" type="date" value={draft.date} onChange={(value) => setDraft({ ...draft, date: value })} />
          <FormInput label="Ticket price" type="number" value={String(draft.ticketPrice ?? 0)} onChange={(value) => setDraft({ ...draft, ticketPrice: Number(value) })} />
          <FormInput label="Expected attendance" type="number" value={String(draft.expectedAttendance)} onChange={(value) => setDraft({ ...draft, expectedAttendance: Number(value), budget: createBudget(Number(value), draft.ticketPrice ?? 0) })} />
        </div>
        <label className="mt-3 grid gap-1 text-sm font-bold">
          Concept
          <textarea className="min-h-28 rounded-lg border border-[#cbd3cf] px-3 py-2 font-normal" value={draft.concept} onChange={(eventChange) => setDraft({ ...draft, concept: eventChange.target.value })} />
        </label>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <ReportSection title="A. Event Overview" items={Object.entries(report.overview).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)} />
        <ReportSection title="B. Why This Fits On Par" items={report.brandFit} />
        <ReportSection title="C. Run of Show" items={report.runOfShow.map((item) => `${item.time}: ${item.item}`)} />
        <ReportSection title="D. Space and Floor Plan" items={report.floorPlan} />
        <ReportSection title="E. Decor and Design Direction" items={report.decor} />
        <ReportSection title="F. Food Plan" items={report.food} />
        <ReportSection title="G. Alcohol and Beverage Plan" items={report.beverage} />
        <ReportSection title="H. Entertainment and Equipment" items={report.equipment} />
        <ReportSection title="I. Staffing" items={report.staffing} />
        <ReportSection title="J. Ticket Pricing" items={report.pricing} />
        <ReportSection title="K. Preliminary Budget" items={report.budgetNotes} />
        <ReportSection title="L. Marketing Plan" items={report.marketing.map((task) => `${task.dueDate}: ${task.title}`)} />
        <ReportSection title="M. Content Recommendations" items={report.content} />
        <ReportSection title="N. Risk and Compliance" items={report.risks} />
        <ReportSection title="O. Success Measurements" items={report.successMeasurements} />
        <ReportSection title="P. Post-Event Review" items={report.postEventReview} />
      </div>
    </section>
  );
}

function TimelineView({ events, tasks }: { events: RoadmapEvent[]; tasks: Array<EventTask & { eventName: string }> }) {
  return (
    <section className="grid gap-4">
      <Panel title="Marketing Timeline">
        <div className="grid gap-2">
          {tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 80).map((task) => (
            <div key={`${task.eventName}-${task.id}`} className="grid gap-2 rounded-lg border border-[#d9dedb] p-3 md:grid-cols-[130px_1fr_120px]">
              <p className="font-bold">{format(parseISO(task.dueDate), "MMM d")}</p>
              <p>{task.title} <span className="text-muted">for {task.eventName}</span></p>
              <StatusBadge status={task.status} />
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Event Pipeline">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          {eventStatuses.slice(0, 13).map((status) => (
            <div key={status} className="rounded-lg border border-[#d9dedb] p-3">
              <p className="font-bold">{status}</p>
              <p className="text-2xl font-black">{events.filter((event) => event.status === status).length}</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function TasksView({ tasks }: { tasks: Array<EventTask & { eventName: string }> }) {
  return (
    <Panel title="Tasks">
      <div className="grid gap-2">
        {tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((task) => (
          <div key={`${task.eventName}-${task.id}`} className="grid gap-2 rounded-lg border border-[#d9dedb] p-3 md:grid-cols-[140px_1fr_130px_110px]">
            <p className="font-bold">{format(parseISO(task.dueDate), "MMM d, yyyy")}</p>
            <p>{task.title}<br /><span className="text-xs text-muted">{task.eventName}</span></p>
            <p>{task.owner}</p>
            <StatusBadge status={task.status} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function BudgetView({ events }: { events: RoadmapEvent[] }) {
  return (
    <Panel title="Budget Overview">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#d9dedb] text-left">
              <th className="p-2">Event</th>
              <th className="p-2">Scenario</th>
              <th className="p-2">Attendance</th>
              <th className="p-2">Expenses</th>
              <th className="p-2">Revenue</th>
              <th className="p-2">Estimated Profit</th>
            </tr>
          </thead>
          <tbody>
            {events.flatMap((event) => event.budget.map((scenario) => {
              const revenue = scenario.ticketRevenue + scenario.foodRevenue + scenario.beverageRevenue + scenario.entertainmentRevenue;
              return (
                <tr key={`${event.id}-${scenario.label}`} className="border-b border-[#eef1ef]">
                  <td className="p-2 font-bold">{event.name}</td>
                  <td className="p-2">{scenario.label}</td>
                  <td className="p-2">{scenario.attendance}</td>
                  <td className="p-2">${scenario.expenses.toLocaleString()}</td>
                  <td className="p-2">${revenue.toLocaleString()}</td>
                  <td className="p-2">${(revenue - scenario.expenses).toLocaleString()}</td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function PastPerformanceView({ events }: { events: RoadmapEvent[] }) {
  const completed = events.filter((event) => ["Completed", "Post-Event Review"].includes(event.status));
  return (
    <Panel title="Past Event Performance">
      {completed.length === 0 ? (
        <EmptyState title="No completed events yet" detail="Completed events will appear here with post-event review fields and projected-vs-actual comparisons." />
      ) : (
        <div className="grid gap-3">{completed.map((event) => <p key={event.id}>{event.name}</p>)}</div>
      )}
    </Panel>
  );
}

function ImportView({ events, onImport }: { events: RoadmapEvent[]; onImport: (file: File) => void }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
      <Panel title="Import Existing Events">
        <p className="text-sm text-muted">Upload a CSV with columns: date,name,category,ticketPrice. Imported events are marked Imported Existing Event and require duplicate review.</p>
        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-moss bg-[#edf8ed] p-6 text-sm font-bold text-moss">
          <Upload className="h-4 w-4" />
          Upload CSV
          <input className="hidden" type="file" accept=".csv,text/csv" onChange={(event) => event.target.files?.[0] && onImport(event.target.files[0])} />
        </label>
      </Panel>
      <Panel title="Imported Events">
        <div className="grid gap-2">
          {events.filter((event) => event.isImported).length === 0 ? (
            <EmptyState title="No imports yet" detail="Manual, CSV, Eventbrite URL, website URL, API, and calendar feed imports are represented in the schema. CSV import is active in Phase 1." />
          ) : (
            events.filter((event) => event.isImported).map((event) => <p key={event.id}>{event.name} | {event.date}</p>)
          )}
        </div>
      </Panel>
    </section>
  );
}

function SourcesView({ recommendations }: { recommendations: EventRecommendation[] }) {
  const sources = recommendations.flatMap((recommendation) => recommendation.researchSources.map((source) => ({ ...source, recommendation: recommendation.title })));
  return (
    <Panel title="Research Sources">
      <div className="grid gap-3">
        {sources.map((source, index) => (
          <div key={`${source.url}-${index}`} className="rounded-lg border border-[#d9dedb] p-3 text-sm">
            <p className="font-bold">{source.title}</p>
            <p className="text-muted">{source.publisher} | {source.reliability} | For: {source.recommendation}</p>
            <a className="text-moss underline" href={source.url}>{source.url}</a>
            <p className="mt-1">{source.summary}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SettingsView({ templates, onReset }: { templates: DashboardState["templates"]; onReset: () => void }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Panel title="Environment Readiness">
        <div className="grid gap-2 text-sm">
          <Info label="Database" value="PostgreSQL schema is present. Set DATABASE_URL in Vercel before enabling persistent writes." />
          <Info label="Authentication" value="NextAuth dependency is installed. Set AUTH_SECRET/NEXTAUTH_SECRET and provider credentials before restricting access." />
          <Info label="AI research" value="Vercel AI SDK is installed. Set AI_GATEWAY_API_KEY or provider key plus WEB_SEARCH_API_KEY for live cited research." />
          <Info label="Cron" value="Monthly Vercel Cron is configured for /api/cron/recommendations and runs in safe dry-run mode until keys/database are configured." />
        </div>
        <div className="no-print mt-4">
          <Button onClick={onReset} icon={RefreshCw}>Reset Local Draft</Button>
        </div>
      </Panel>
      <Panel title="Editable Event Templates">
        <div className="grid gap-2">
          {templates.map((template) => (
            <div key={template.name} className="rounded-lg border border-[#d9dedb] p-3 text-sm">
              <p className="font-bold">{template.name}</p>
              <p className="text-muted">{template.category} | ${template.estimatedTicketPrice} estimated | {template.audience}</p>
              <p>{template.starterConcept}</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Metric({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-[#d9dedb] bg-white p-4 shadow-panel">
      <p className="text-sm font-bold text-muted">{title}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[#d9dedb] bg-white p-4 shadow-panel">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-xl font-black tracking-normal">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Button({ children, icon: Icon, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ElementType }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[#cbd3cf] bg-white px-3 py-2 text-sm font-black text-ink transition hover:border-moss hover:text-moss ${props.className ?? ""}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full px-2 py-1 text-xs font-black text-white" style={{ background: statusColors[status] ?? "#65716d" }}>
      {status}
    </span>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-sand p-2">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function ScoreGrid({ factors }: { factors: ScoreFactors }) {
  return (
    <div className="mt-3 grid gap-2 md:grid-cols-3">
      {Object.entries(factors).slice(0, 9).map(([label, value]) => (
        <div key={label}>
          <div className="flex justify-between text-xs font-bold text-muted">
            <span>{label.replace(/([A-Z])/g, " $1")}</span>
            <span>{value}</span>
          </div>
          <div className="h-2 rounded bg-[#e7ece9]">
            <div className="h-2 rounded bg-moss" style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FormInput(props: {
  name?: string;
  label: string;
  type?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm font-bold">
      {props.label}
      <input
        name={props.name}
        type={props.type ?? "text"}
        defaultValue={props.defaultValue}
        value={props.value}
        onChange={(event) => props.onChange?.(event.target.value)}
        className="rounded-lg border border-[#cbd3cf] px-3 py-2 font-normal"
      />
    </label>
  );
}

function FormText({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  return (
    <label className="grid gap-1 text-sm font-bold">
      {label}
      <textarea name={name} defaultValue={defaultValue} className="min-h-24 rounded-lg border border-[#cbd3cf] px-3 py-2 font-normal" />
    </label>
  );
}

function ReportSection({ title, items }: { title: string; items: string[] }) {
  return (
    <Panel title={title}>
      <ul className="grid gap-2 pl-5 text-sm">
        {items.map((item) => <li key={item} className="list-disc">{item}</li>)}
      </ul>
    </Panel>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#cbd3cf] p-6 text-center">
      <p className="font-black">{title}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  );
}

function loadState(initialState: DashboardState) {
  if (typeof window === "undefined") return initialState;
  const saved = localStorage.getItem(storageKey);
  if (!saved) return initialState;
  try {
    return JSON.parse(saved) as DashboardState;
  } catch {
    return initialState;
  }
}

function defaultScoreFactors(): ScoreFactors {
  return {
    brandFit: 75,
    audienceFit: 70,
    seasonalRelevance: 68,
    revenuePotential: 70,
    foodBeveragePotential: 72,
    entertainmentPotential: 82,
    repeatVisitPotential: 70,
    marketingPotential: 72,
    operationalDifficulty: 65,
    staffingDifficulty: 65,
    licensingRisk: 68,
    localCompetition: 60,
    planningLeadTime: 70,
    pastPerformance: 60,
    customerInterest: 70
  };
}

function groupBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = getKey(item);
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {});
}
