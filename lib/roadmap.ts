import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  parseISO,
  startOfMonth
} from "date-fns";
import type {
  BudgetScenario,
  ConflictWarning,
  DashboardState,
  EventCategory,
  EventRecommendation,
  EventReport,
  EventTask,
  EventTemplate,
  RoadmapEvent,
  ScoreFactors
} from "./types";
import { buildEventIdeas } from "./event-ideas";
import { yearlyMarketingPlan } from "./yearly-marketing-plan";

const today = new Date();
const seedActor = "System seed";

export const eventStatuses = [
  "Idea",
  "Researching",
  "Recommendation Ready",
  "Needs Review",
  "Tentatively Approved",
  "Budget Review",
  "Approved",
  "Planning",
  "Marketing",
  "Registration Open",
  "Sold Out",
  "Completed",
  "Post-Event Review",
  "Denied",
  "Postponed",
  "Cancelled",
  "Archived"
] as const;

export const denialReasons = [
  "Too expensive",
  "Too difficult to staff",
  "Licensing concern",
  "Not appropriate for On Par",
  "Too similar to another event",
  "Poor timing",
  "Weak demand",
  "Already attempted",
  "Save for another season",
  "Other"
];

export function getFirstWeekday(year: number, monthIndex: number, weekday: number) {
  const first = startOfMonth(new Date(year, monthIndex, 1));
  const offset = (weekday - getDay(first) + 7) % 7;
  return addDays(first, offset);
}

export function getAnniversaryNumber(year: number) {
  return Math.max(1, year - 2023);
}

export function buildDashboardState(baseDate = today): DashboardState {
  const events = buildRollingEvents(baseDate);
  const recommendations = buildSeedRecommendations(events, baseDate);
  return {
    events,
    recommendations,
    templates: eventTemplates,
    yearlyPlan: yearlyMarketingPlan,
    ideas: buildEventIdeas(baseDate),
    researchRuns: [
      {
        id: "run-seed-001",
        runAt: new Date().toISOString(),
        rangeLabel: "Seed example research log",
        queriesUsed: [
          "Dayton paid event ideas fall entertainment",
          "guest appreciation anniversary event bar entertainment",
          "singles mixer event pricing Ohio"
        ],
        sourcesReviewed: 0,
        recommendationsCreated: recommendations.length,
        duplicatesSkipped: 0,
        errors: ["Live web-search keys are not configured in this demo seed."],
        tokenUsage: "Not run through an LLM yet",
        searchCosts: "$0.00"
      }
    ]
  };
}

export function buildRollingEvents(baseDate: Date) {
  const months = Array.from({ length: 12 }, (_, index) => addMonths(startOfMonth(baseDate), index));
  const events: RoadmapEvent[] = [];

  months.forEach((month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const triviaDate = getFirstWeekday(year, monthIndex, 3);
    const bingoDate = getFirstWeekday(year, monthIndex, 4);

    events.push(createRecurringEvent("Trivia", triviaDate, "first-wednesday-trivia"));
    events.push(createRecurringEvent("Bingo", bingoDate, "first-thursday-bingo"));

    getPaidEventWeeks(month).forEach((date, index) => {
      const idea = paidEventIdeas[(monthIndex + index) % paidEventIdeas.length];
      events.push(createPaidPlaceholder(date, idea, index));
    });

    if (monthIndex === 10) {
      const anniversaryDate = new Date(year, 10, 16);
      if (isSameMonth(anniversaryDate, month)) {
        events.push(createAnniversaryEvent(anniversaryDate));
      }
    }
  });

  return events.map((event) => ({
    ...event,
    warnings: checkConflicts(event, events)
  }));
}

function createRecurringEvent(category: "Trivia" | "Bingo", date: Date, ruleId: string): RoadmapEvent {
  const name = category === "Trivia" ? "Monthly Trivia: Needs Theme" : "Monthly Bingo: Needs Theme";
  return {
    id: `${ruleId}-${format(date, "yyyy-MM-dd")}`,
    name,
    concept: `${category} is automatically scheduled for the first ${category === "Trivia" ? "Wednesday" : "Thursday"} of the month. Theme must be approved from the recommendation inbox before publishing.`,
    date: format(date, "yyyy-MM-dd"),
    startTime: "7:00 PM",
    endTime: "9:00 PM",
    category,
    admissionType: "Free",
    status: "Needs Review",
    audience: "On Par regulars and pop-culture fans",
    ageRestriction: "All ages unless management changes the theme",
    expectedAttendance: 45,
    owner: "Marketing",
    planningProgress: 20,
    marketingProgress: 0,
    marketingStage: "Concept",
    profitability: "Moderate",
    internalOrPartner: "Internal",
    source: "Recurring Rule",
    warnings: [],
    report: createEventReport(name, category, date, 0),
    tasks: createMarketingTasks(date, "Small"),
    budget: createBudget(45, 0),
    auditHistory: [audit("Created from recurring calendar rule")]
  };
}

function createPaidPlaceholder(date: Date, idea: PaidIdea, index: number): RoadmapEvent {
  return {
    id: `paid-${format(date, "yyyy-MM-dd")}-${index}`,
    name: idea.name,
    tagline: idea.tagline,
    concept: idea.concept,
    date: format(date, "yyyy-MM-dd"),
    startTime: idea.startTime,
    endTime: idea.endTime,
    category: idea.category,
    admissionType: "Paid",
    ticketPrice: idea.price,
    status: "Idea",
    audience: idea.audience,
    ageRestriction: idea.ageRestriction,
    expectedAttendance: idea.attendance,
    owner: "Marketing",
    planningProgress: 10,
    marketingProgress: 0,
    marketingStage: "Concept",
    profitability: "Unknown",
    internalOrPartner: "Internal",
    source: "Seed Example",
    warnings: [],
    report: createEventReport(idea.name, idea.category, date, idea.price),
    tasks: createMarketingTasks(date, "Standard"),
    budget: createBudget(idea.attendance, idea.price),
    auditHistory: [audit("Created as editable seed paid-event placeholder")]
  };
}

function createAnniversaryEvent(date: Date): RoadmapEvent {
  const anniversaryNumber = getAnniversaryNumber(date.getFullYear());
  const name = `On Par Guest Appreciation and ${anniversaryNumber}-Year Anniversary Celebration`;
  return {
    id: `anniversary-${date.getFullYear()}`,
    name,
    tagline: `${anniversaryNumber} years of fun, guests, games, and memories`,
    concept:
      "A guest appreciation celebration with loyalty incentives, anniversary food and drink features, giveaways, entertainment, mini-tournaments, and a return-visit campaign. Requires management approval before publishing.",
    date: format(date, "yyyy-MM-dd"),
    startTime: "5:00 PM",
    endTime: "10:00 PM",
    category: "Customer Appreciation",
    admissionType: "Paid",
    ticketPrice: 15,
    status: "Needs Review",
    audience: "Past guests, regulars, private-event leads, families, and local partners",
    ageRestriction: "All ages with 21+ ID checks for alcohol",
    expectedAttendance: 220,
    owner: "Marketing Director",
    planningProgress: 25,
    marketingProgress: 0,
    marketingStage: "Research",
    profitability: "High",
    internalOrPartner: "Internal",
    source: "Recurring Rule",
    warnings: [
      {
        id: "anniversary-lead-time",
        severity: "High",
        type: "Planning lead time",
        message: "Anniversary planning and marketing must begin at least 12 weeks ahead.",
        canOverride: false
      }
    ],
    isMajor: true,
    isAnniversary: true,
    report: createAnniversaryReport(name, date, anniversaryNumber),
    tasks: createMarketingTasks(date, "Anniversary"),
    budget: createBudget(220, 15),
    auditHistory: [audit("Created from permanent November 16 anniversary rule")]
  };
}

function getPaidEventWeeks(month: Date) {
  const dates: Date[] = [];
  let cursor = startOfMonth(month);
  const last = endOfMonth(month);

  while (cursor <= last) {
    const day = getDay(cursor);
    const weekOfMonth = Math.floor((cursor.getDate() - 1) / 7) + 1;
    if (weekOfMonth > 1 && [4, 5, 6, 0].includes(day)) {
      dates.push(cursor);
      cursor = addDays(cursor, 7);
    } else {
      cursor = addDays(cursor, 1);
    }
  }

  return dates.slice(0, 3);
}

export function checkConflicts(event: RoadmapEvent, allEvents: RoadmapEvent[]): ConflictWarning[] {
  const warnings: ConflictWarning[] = [];
  const eventDate = parseISO(event.date);
  const daysUntil = differenceInCalendarDays(eventDate, new Date());
  const sameWeekPaid = allEvents.filter((other) => {
    if (other.id === event.id || other.admissionType !== "Paid") return false;
    return Math.abs(differenceInCalendarDays(parseISO(other.date), eventDate)) <= 3;
  });

  if (event.admissionType === "Paid" && sameWeekPaid.length > 0) {
    warnings.push({
      id: `${event.id}-paid-proximity`,
      severity: "Warning",
      type: "Paid event proximity",
      message: "Another paid event is within three days. Review audience overlap and staffing.",
      canOverride: true
    });
  }

  if (event.status !== "Completed" && daysUntil < 28) {
    warnings.push({
      id: `${event.id}-lead-time`,
      severity: event.admissionType === "Paid" ? "High" : "Warning",
      type: "Planning lead time",
      message: "This event has less than four weeks of planning lead time.",
      canOverride: true
    });
  }

  if (event.ageRestriction.includes("21+") || event.category === "Tasting") {
    warnings.push({
      id: `${event.id}-alcohol`,
      severity: "Info",
      type: "Alcohol compliance",
      message: "Management or legal verification required for ID checks, responsible service, licensing, and supplier requirements.",
      canOverride: false
    });
  }

  return warnings;
}

export function createMarketingTasks(date: Date, size: "Small" | "Standard" | "Large" | "Anniversary"): EventTask[] {
  const launchWeeks = size === "Small" ? 5 : size === "Standard" ? 8 : size === "Large" ? 11 : 12;
  const due = (daysBefore: number) => format(addDays(date, -daysBefore), "yyyy-MM-dd");
  const task = (title: string, daysBefore: number, stage: EventTask["stage"], owner = "Marketing"): EventTask => ({
    id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${format(date, "yyyy-MM-dd")}`,
    title,
    dueDate: due(daysBefore),
    stage,
    owner,
    status: differenceInCalendarDays(parseISO(due(daysBefore)), new Date()) < 0 ? "Overdue" : "Todo"
  });

  return [
    task("Approve concept", launchWeeks * 7 + 14, "Approval"),
    task("Approve budget", launchWeeks * 7 + 7, "Approval"),
    task("Create Eventbrite listing", launchWeeks * 7, "Listing"),
    task("Create graphics", launchWeeks * 7 - 3, "Design"),
    task("Create Facebook event", launchWeeks * 7 - 5, "Listing"),
    task("Prepare social posts", launchWeeks * 7 - 7, "Promotion"),
    task("Launch paid advertising", Math.max(21, launchWeeks * 7 - 14), "Promotion"),
    task("Prepare staff instructions", 10, "Operations"),
    task("Final operations meeting", 3, "Operations"),
    task("Day-before reminder", 1, "Final Push"),
    task("Post-event report", -3, "Post Event")
  ];
}

export function createEventReport(name: string, category: EventCategory, date: Date, ticketPrice: number): EventReport {
  return {
    overview: {
      "Event name": name,
      "Recommended date": format(date, "MMMM d, yyyy"),
      "Event category": category,
      "Recommended lead time": ticketPrice > 0 ? "8 weeks for a standard paid event" : "4 to 6 weeks for a small recurring event",
      "Fact status": "Seed example. Management approval required before publishing."
    },
    brandFit: [
      "Uses On Par as an entertainment-first social venue.",
      "Can increase food, beverage, entertainment purchases, and return visits.",
      "All estimates are recommendations until management approves."
    ],
    runOfShow: [
      { time: "60 min before", item: "Staff setup, signage, QR codes, check-in station, and prize table." },
      { time: "Event start", item: "Guest check-in and opening announcement." },
      { time: "30 min", item: "Primary activity begins." },
      { time: "90 min", item: "Break, food/drink feature reminder, social content capture." },
      { time: "Final 15 min", item: "Winners, prizes, bounce-back offer, and closing announcement." }
    ],
    floorPlan: [
      "Use check-in near the entrance with visible signage.",
      "Keep prize and sponsor placement away from guest traffic bottlenecks.",
      "Preserve accessible pathways and verify capacity before approval."
    ],
    decor: [
      "Create low, standard, and premium decor options before budget approval.",
      "Avoid copyrighted logos, characters, names, artwork, and music without licensing review."
    ],
    food: [
      "Prioritize On Par's existing kitchen capabilities before suggesting outside catering.",
      "Estimate portions after management approves expected attendance."
    ],
    beverage: [
      "Alcohol is optional unless the concept requires tasting.",
      "Responsible-service and ID-check requirements need management verification."
    ],
    equipment: [
      "Host microphone",
      "Screens or projector",
      "QR codes",
      "Ticket scanner or check-in list",
      "Prize table",
      "Backup printed materials"
    ],
    staffing: [
      "Event manager",
      "Host",
      "Check-in staff",
      "Floor staff",
      "Kitchen/bar support as needed",
      "Technical support for screens and audio"
    ],
    pricing: [
      ticketPrice > 0 ? `Estimated general admission: $${ticketPrice}` : "Free admission recommended.",
      "Door, VIP, food-inclusive, or drink-inclusive pricing must be approved by management.",
      "Comparable pricing requires live research before final approval."
    ],
    budgetNotes: [
      "Budget includes editable estimates for decor, food, beverage, entertainment, labor, printing, advertising, prizes, and contingency.",
      "All financial values are estimates until approved."
    ],
    marketing: createMarketingTasks(date, ticketPrice > 0 ? "Standard" : "Small"),
    content: [
      "Create editable Eventbrite, website, Facebook, Instagram, TikTok, email, and digital screen copy.",
      "Use staff talking points at trivia, bingo, and during regular service."
    ],
    risks: [
      "Management or legal verification required for alcohol, contests, raffles, copyright, trademark, music, age restrictions, and insurance.",
      "Do not publish or spend money automatically."
    ],
    successMeasurements: [
      "Tickets sold",
      "Attendance",
      "Food revenue",
      "Beverage revenue",
      "Entertainment revenue",
      "Profit",
      "Private-event leads",
      "Repeat-visit offers redeemed"
    ],
    postEventReview: [
      "Record actual attendance, revenue, expenses, food/beverage sales, staff feedback, guest feedback, photos, videos, and whether the event should return."
    ]
  };
}

function createAnniversaryReport(name: string, date: Date, anniversaryNumber: number): EventReport {
  const report = createEventReport(name, "Customer Appreciation", date, 15);
  report.overview["Event objective"] = `Celebrate ${anniversaryNumber} years of On Par Entertainment and convert guest appreciation into return visits.`;
  report.decor.unshift(`Three Years of Fun visual theme, photo timeline, memory wall, anniversary signage, and customer awards.`);
  report.food.unshift("Limited-edition anniversary menu items and shareable guest appreciation features.");
  report.beverage.unshift("Anniversary tasting wall concept with strict responsible-service review.");
  report.content.unshift("Social media memory campaign, VIP guest invitations, local media outreach, sponsor partnership pitch, and post-event thank-you campaign.");
  report.successMeasurements.push("Bounce-back offers distributed", "Loyalty cards redeemed", "Private-event inquiries captured");
  return report;
}

export function createBudget(attendance: number, ticketPrice: number): BudgetScenario[] {
  return (["Low", "Expected", "High"] as const).map((label, index) => {
    const factor = [0.75, 1, 1.25][index];
    const projectedAttendance = Math.round(attendance * factor);
    const expenses = Math.round((ticketPrice > 0 ? 700 : 150) * factor);
    return {
      label,
      attendance: projectedAttendance,
      expenses,
      ticketRevenue: Math.round(projectedAttendance * ticketPrice),
      foodRevenue: Math.round(projectedAttendance * 9),
      beverageRevenue: Math.round(projectedAttendance * 11),
      entertainmentRevenue: Math.round(projectedAttendance * 7)
    };
  });
}

export function recommendationToEvent(recommendation: EventRecommendation): RoadmapEvent {
  const date = parseISO(recommendation.recommendedDate);
  const event = createPaidPlaceholder(date, {
    name: recommendation.title,
    tagline: recommendation.seasonalRelevance,
    concept: recommendation.concept,
    category: recommendation.category,
    price: recommendation.estimatedTicketPrice,
    attendance: recommendation.estimatedAttendance,
    audience: recommendation.intendedAudience,
    ageRestriction: recommendation.category === "Tasting" ? "21+ with ID check" : "Management to confirm",
    startTime: recommendation.recommendedStartTime,
    endTime: "9:30 PM"
  }, 0);
  return {
    ...event,
    id: `event-${recommendation.id}`,
    status: "Tentatively Approved",
    source: recommendation.source === "Manual Staff Submission" ? "Manual" : "AI Recommendation",
    auditHistory: [
      audit("Recommendation added to calendar as tentative"),
      {
        id: `audit-${recommendation.id}`,
        date: new Date().toISOString(),
        actor: "Marketing user",
        action: "Human approval gate",
        notes: "This event is tentative only. It is not published or confirmed."
      }
    ]
  };
}

function buildSeedRecommendations(events: RoadmapEvent[], baseDate: Date): EventRecommendation[] {
  const dates = [addDays(baseDate, 19), addMonths(baseDate, 2), new Date(baseDate.getFullYear(), 10, 16)];
  return [
    createRecommendation("Late Summer Singles Mixer", "A guided social mixer with rotating conversation prompts, mini golf icebreakers, and optional food/drink specials.", dates[0], "Dating", 18, 80, "Singles ages 25-40", "Seasonal Seed", events),
    createRecommendation("Practical Magic Night Market + Mini Golf", "A fall night market concept with themed cocktails/mocktails, vendor pop-ups, costume details, and social golf.", dates[1], "Holiday", 18, 120, "Women, friend groups, fall pop-culture fans", "Seasonal Seed", events),
    createRecommendation("On Par Guest Appreciation and Three-Year Anniversary Celebration", "A guest appreciation event for On Par's upcoming three-year anniversary with giveaways, loyalty incentives, anniversary food and drinks, entertainment, and private-event lead capture.", dates[2], "Customer Appreciation", 15, 220, "Regulars, past guests, families, private-event leads", "Seasonal Seed", events)
  ];
}

function createRecommendation(
  title: string,
  concept: string,
  date: Date,
  category: EventCategory,
  price: number,
  attendance: number,
  audience: string,
  source: EventRecommendation["source"],
  events: RoadmapEvent[]
): EventRecommendation {
  const factors = scoreFactors(category, price);
  const confidenceScore = Math.round(Object.values(factors).reduce((sum, value) => sum + value, 0) / Object.values(factors).length);
  return {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title,
    concept,
    recommendedDate: format(date, "yyyy-MM-dd"),
    recommendedDayOfWeek: format(date, "EEEE"),
    recommendedStartTime: "7:00 PM",
    estimatedTicketPrice: price,
    estimatedAttendance: attendance,
    intendedAudience: audience,
    category,
    reason: "Fills an open paid-event window while matching On Par's social entertainment model. Live market research required before approval.",
    seasonalRelevance: "Recommended based on seasonality and On Par event cadence.",
    researchSources: [
      {
        title: "Source research not yet run",
        url: "https://onparbar.com/",
        publisher: "On Par Entertainment",
        searchDate: new Date().toISOString(),
        summary: "Seed source only. Replace with web-search results before final approval.",
        excerpt: "Requires Verification",
        reliability: "Requires Verification"
      }
    ],
    planningDifficulty: category === "Customer Appreciation" ? "High" : "Medium",
    marketingDifficulty: category === "Customer Appreciation" ? "High" : "Medium",
    revenuePotential: price >= 15 ? "High" : "Moderate",
    riskLevel: category === "Tasting" ? "High" : "Medium",
    confidenceScore,
    similarOnParEvents: ["Silent Disco: Latin Party", "Sizzlin' Summer Singles Mixer", "Christmas in July"],
    potentialConflicts: checkConflicts({
      ...createPaidPlaceholder(date, {
        name: title,
        concept,
        category,
        price,
        attendance,
        audience,
        ageRestriction: "Management to confirm",
        startTime: "7:00 PM",
        endTime: "9:30 PM"
      }, 0),
      id: `recommendation-check-${title}`
    }, events),
    status: "Needs Review",
    source,
    scoreFactors: factors
  };
}

function scoreFactors(category: EventCategory, price: number): ScoreFactors {
  return {
    brandFit: 86,
    audienceFit: 82,
    seasonalRelevance: 80,
    revenuePotential: price > 0 ? 84 : 62,
    foodBeveragePotential: 78,
    entertainmentPotential: 88,
    repeatVisitPotential: 76,
    marketingPotential: 83,
    operationalDifficulty: category === "Customer Appreciation" ? 58 : 74,
    staffingDifficulty: category === "Customer Appreciation" ? 55 : 72,
    licensingRisk: category === "Tasting" ? 45 : 76,
    localCompetition: 70,
    planningLeadTime: 75,
    pastPerformance: 72,
    customerInterest: 81
  };
}

function audit(notes: string) {
  return {
    id: `audit-${Math.random().toString(36).slice(2)}`,
    date: new Date().toISOString(),
    actor: seedActor,
    action: "Seeded",
    notes
  };
}

type PaidIdea = {
  name: string;
  tagline?: string;
  concept: string;
  category: EventCategory;
  price: number;
  attendance: number;
  audience: string;
  ageRestriction: string;
  startTime: string;
  endTime: string;
};

const paidEventIdeas: PaidIdea[] = [
  {
    name: "Speed Dating at On Par",
    concept: "Structured mini-dates with activity breaks, scorecards, and optional post-event mingling.",
    category: "Dating",
    price: 18,
    attendance: 70,
    audience: "Singles 25-45",
    ageRestriction: "21+ recommended",
    startTime: "7:00 PM",
    endTime: "9:30 PM"
  },
  {
    name: "Bourbon & Birdies Tasting",
    concept: "A bourbon tasting and mini golf pairing concept. Licensing, distributor, and responsible-service requirements need verification.",
    category: "Tasting",
    price: 35,
    attendance: 55,
    audience: "Adults 21+, bourbon fans, date-night guests",
    ageRestriction: "21+ with ID check",
    startTime: "6:30 PM",
    endTime: "8:30 PM"
  },
  {
    name: "Dining in the Dark: Social Table",
    concept: "A ticketed food-focused social dinner with conversation prompts and low-light sensory dining elements.",
    category: "Food",
    price: 42,
    attendance: 48,
    audience: "Couples, friend groups, experience seekers",
    ageRestriction: "Management to confirm",
    startTime: "7:00 PM",
    endTime: "9:00 PM"
  },
  {
    name: "Drunk Spelling Bee",
    concept: "A comedy competition with host, rounds, prizes, and responsible-service guardrails.",
    category: "Competition",
    price: 12,
    attendance: 90,
    audience: "Adults 21+, comedy and karaoke crowd",
    ageRestriction: "21+ with ID check",
    startTime: "8:00 PM",
    endTime: "10:00 PM"
  },
  {
    name: "Friendship Mixer: Meet Your New Crew",
    concept: "A low-pressure friendship mixer with team challenges, table prompts, and group activity rotations.",
    category: "Mixer",
    price: 15,
    attendance: 85,
    audience: "New residents, young professionals, friend groups",
    ageRestriction: "18+ recommended",
    startTime: "7:00 PM",
    endTime: "9:00 PM"
  }
];

export const eventTemplates: EventTemplate[] = [
  "Singles Mixer",
  "Speed Dating",
  "Eating With Strangers",
  "Friendship Mixer",
  "Bourbon Tasting",
  "Tequila Tasting",
  "Wine Tasting",
  "Dining in the Dark",
  "Drunk Spelling Bee",
  "Karaoke Contest",
  "Halloween Party",
  "Christmas Party",
  "Friendsgiving",
  "Guest Appreciation Event",
  "Anniversary Celebration",
  "Silent Disco",
  "Murder Mystery",
  "Game Tournament",
  "Themed Dance Party"
].map((name) => ({
  name,
  category: name.includes("Tasting") ? "Tasting" : name.includes("Party") || name.includes("Friendsgiving") ? "Holiday" : name.includes("Dating") || name.includes("Singles") ? "Dating" : "Other",
  starterConcept: `${name} starter template. Estimates are recommendations only until management approves.`,
  estimatedTicketPrice: name.includes("Tasting") ? 35 : name.includes("Party") ? 20 : 15,
  audience: "Management to refine",
  notes: [
    "Requires source-backed research before approval.",
    "Licensing/legal/compliance items must be verified by management where applicable.",
    "Use this template as a starting point, not a final plan."
  ]
}));
