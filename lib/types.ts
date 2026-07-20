export type EventStatus =
  | "Idea"
  | "Researching"
  | "Recommendation Ready"
  | "Needs Review"
  | "Tentatively Approved"
  | "Budget Review"
  | "Approved"
  | "Planning"
  | "Marketing"
  | "Registration Open"
  | "Sold Out"
  | "Completed"
  | "Post-Event Review"
  | "Denied"
  | "Postponed"
  | "Cancelled"
  | "Archived";

export type EventCategory =
  | "Trivia"
  | "Bingo"
  | "Dating"
  | "Mixer"
  | "Tasting"
  | "Holiday"
  | "Competition"
  | "Dance Party"
  | "Customer Appreciation"
  | "Imported"
  | "Partner"
  | "Food"
  | "Other";

export type AdmissionType = "Free" | "Paid" | "Donation" | "Private";

export type MarketingStage =
  | "Not Started"
  | "Concept"
  | "Research"
  | "Design"
  | "Listing"
  | "Promotion"
  | "Final Push"
  | "Post Event";

export type RoadmapEvent = {
  id: string;
  name: string;
  tagline?: string;
  concept: string;
  date: string;
  startTime: string;
  endTime: string;
  category: EventCategory;
  admissionType: AdmissionType;
  ticketPrice?: number;
  status: EventStatus;
  audience: string;
  ageRestriction: string;
  expectedAttendance: number;
  owner: string;
  planningProgress: number;
  marketingProgress: number;
  marketingStage: MarketingStage;
  profitability: "Unknown" | "Low" | "Moderate" | "High";
  internalOrPartner: "Internal" | "Partner-hosted";
  source: "Seed Example" | "Recurring Rule" | "Imported Existing Event" | "Manual" | "AI Recommendation";
  sourceUrl?: string;
  isImported?: boolean;
  warnings: ConflictWarning[];
  isMajor?: boolean;
  isAnniversary?: boolean;
  report: EventReport;
  tasks: EventTask[];
  budget: BudgetScenario[];
  auditHistory: AuditEntry[];
};

export type EventRecommendation = {
  id: string;
  title: string;
  concept: string;
  recommendedDate: string;
  recommendedDayOfWeek: string;
  recommendedStartTime: string;
  estimatedTicketPrice: number;
  estimatedAttendance: number;
  intendedAudience: string;
  category: EventCategory;
  reason: string;
  seasonalRelevance: string;
  researchSources: ResearchSource[];
  planningDifficulty: "Low" | "Medium" | "High";
  marketingDifficulty: "Low" | "Medium" | "High";
  revenuePotential: "Low" | "Moderate" | "High";
  riskLevel: "Low" | "Medium" | "High";
  confidenceScore: number;
  similarOnParEvents: string[];
  potentialConflicts: ConflictWarning[];
  status: EventStatus;
  source: "Manual Staff Submission" | "AI Generated" | "Seasonal Seed" | "Imported Event" | "Past Event";
  denialReason?: string;
  scoreFactors: ScoreFactors;
};

export type EventTask = {
  id: string;
  title: string;
  dueDate: string;
  stage: MarketingStage | "Operations" | "Approval" | "Post Event";
  owner: string;
  status: "Todo" | "In Progress" | "Blocked" | "Done" | "Overdue";
};

export type ConflictWarning = {
  id: string;
  severity: "Info" | "Warning" | "High";
  type: string;
  message: string;
  canOverride: boolean;
};

export type ResearchSource = {
  title: string;
  url: string;
  publisher: string;
  publicationDate?: string;
  searchDate: string;
  summary: string;
  excerpt: string;
  reliability: "Confirmed" | "Estimated" | "Recommended" | "Requires Verification";
};

export type ScoreFactors = {
  brandFit: number;
  audienceFit: number;
  seasonalRelevance: number;
  revenuePotential: number;
  foodBeveragePotential: number;
  entertainmentPotential: number;
  repeatVisitPotential: number;
  marketingPotential: number;
  operationalDifficulty: number;
  staffingDifficulty: number;
  licensingRisk: number;
  localCompetition: number;
  planningLeadTime: number;
  pastPerformance: number;
  customerInterest: number;
};

export type BudgetScenario = {
  label: "Low" | "Expected" | "High";
  attendance: number;
  expenses: number;
  ticketRevenue: number;
  foodRevenue: number;
  beverageRevenue: number;
  entertainmentRevenue: number;
};

export type AuditEntry = {
  id: string;
  date: string;
  actor: string;
  action: string;
  notes: string;
};

export type EventReport = {
  overview: Record<string, string | number | string[]>;
  brandFit: string[];
  runOfShow: TimelineItem[];
  floorPlan: string[];
  decor: string[];
  food: string[];
  beverage: string[];
  equipment: string[];
  staffing: string[];
  pricing: string[];
  budgetNotes: string[];
  marketing: EventTask[];
  content: string[];
  risks: string[];
  successMeasurements: string[];
  postEventReview: string[];
};

export type TimelineItem = {
  time: string;
  item: string;
};

export type EventTemplate = {
  name: string;
  category: EventCategory;
  starterConcept: string;
  estimatedTicketPrice: number;
  audience: string;
  notes: string[];
};

export type ResearchRun = {
  id: string;
  runAt: string;
  rangeLabel: string;
  queriesUsed: string[];
  sourcesReviewed: number;
  recommendationsCreated: number;
  duplicatesSkipped: number;
  errors: string[];
  tokenUsage: string;
  searchCosts: string;
};

export type DashboardState = {
  events: RoadmapEvent[];
  recommendations: EventRecommendation[];
  templates: EventTemplate[];
  researchRuns: ResearchRun[];
};
