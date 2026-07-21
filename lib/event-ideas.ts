import { addDays, format } from "date-fns";
import type { EventIdea, MarketingPlanSource } from "./types";

const sourceLinks: Record<string, MarketingPlanSource> = {
  eventbriteSocial: {
    label: "Eventbrite Social Study",
    url: "https://www.eventbrite.com/blog/press/newsroom/eventbrites-inaugural-social-study-report-reveals-the-reset-to-real/"
  },
  softPartying: {
    label: "Soft partying trend",
    url: "https://www.linkedin.com/news/story/soft-partying-craze-reflects-shifting-nightlife-trends-6866636/"
  },
  genZAlcohol: {
    label: "Intentional Gen Z drinking trend",
    url: "https://www.businessinsider.com/gen-z-drinking-alcohol-moderation-sobriety-new-data-2026-7"
  },
  friendfluence: {
    label: "Friendfluence dating trend",
    url: "https://www.cosmopolitan.com/relationships/a72075731/friendfluence-dating-trend/"
  },
  foodBeverage: {
    label: "Datassential 2026 F&B trends",
    url: "https://datassential.com/resource/national-restaurant-association-show-2026-food-beverage-trends/"
  },
  jamesBeard: {
    label: "James Beard 2026 food trends",
    url: "https://www.jamesbeard.org/stories/top-restaurant-food-trends-2026"
  },
  barTrends: {
    label: "Bar trends 2026",
    url: "https://www.webstaurantstore.com/blog/2370/bar-trends.html"
  },
  genZEvents: {
    label: "Gen Z event ideas 2026",
    url: "https://hotway.app/en/blog/384/best-event-ideas-for-gen-z-in-2026"
  },
  cvent: {
    label: "Restaurant event ideas",
    url: "https://www.cvent.com/en/blog/events/restaurant-event-ideas"
  },
  liveNation: {
    label: "2026 sensory event trends",
    url: "https://specialevents.livenation.com/blog/2026-event-trends-every-planner-should-know"
  },
  dirtySoda: {
    label: "Dirty soda summer trend",
    url: "https://www.realsimple.com/mocktail-drink-of-the-summer-2026-12017050"
  },
  vinegar: {
    label: "Vinegar beverage trend",
    url: "https://www.bhg.com/summer-of-vinegar-whole-foods-12009625"
  }
};

export function buildEventIdeas(baseDate = new Date()): EventIdea[] {
  return [...curatedIdeas, ...buildDailyIdeaDrops(baseDate)];
}

const curatedIdeas: EventIdea[] = [
  {
    id: "friendfluence-double-date-games",
    title: "Double-Date Game Circuit",
    category: "Dating",
    concept: "A safer, lower-pressure dating night where pairs of friends rotate through mini golf, darts, karaoke prompts, and conversation cards together.",
    whyItFits: "On Par already has multiple activity zones, which makes group dating feel less awkward than a seated singles mixer.",
    bestMonths: ["February", "April", "August"],
    bestDays: ["Thursday", "Friday"],
    suggestedTime: "7:00 PM",
    estimatedTicketPrice: 18,
    estimatedAttendance: 72,
    intendedAudience: "Singles 23-38 who prefer friend-supported social dating",
    foodDrinkAngle: "Shareable appetizer boards, mocktail/cocktail pairing, and a two-drink maximum package option.",
    marketingHook: "Bring your wingperson. Meet their wingperson.",
    trendBasis: "Friend-led dating and double-date formats are gaining attention as a less intimidating way to meet people.",
    sourceLinks: [sourceLinks.friendfluence, sourceLinks.eventbriteSocial]
  },
  {
    id: "soft-party-sunday",
    title: "Soft Party Sunday",
    category: "Mixer",
    concept: "A daytime social event with DJ-lite music, iced coffee/mocktails, casual games, journaling/prompt cards, and mini golf.",
    whyItFits: "It creates a weekend revenue moment without relying on late-night drinking.",
    bestMonths: ["January", "March", "June"],
    bestDays: ["Sunday"],
    suggestedTime: "2:00 PM",
    estimatedTicketPrice: 12,
    estimatedAttendance: 65,
    intendedAudience: "Gen Z, millennials, sober-curious guests, friend groups",
    foodDrinkAngle: "Cold brew flights, refresher mocktails, brunch snacks, and light shareables.",
    marketingHook: "Log off, link up, and still be home before dinner.",
    trendBasis: "Soft partying emphasizes daytime connection, wellbeing, and lower-alcohol socializing.",
    sourceLinks: [sourceLinks.softPartying, sourceLinks.barTrends]
  },
  {
    id: "refresher-lab",
    title: "Refresher Lab: Build Your Own Mocktail",
    category: "Food",
    concept: "Guests build alcohol-free refreshers with fruit, tea, botanicals, citrus, vinegar shrubs, and garnish stations, then vote on a house feature.",
    whyItFits: "It lets On Par test beverage ideas while offering a strong non-alcoholic event option.",
    bestMonths: ["January", "June", "July", "August"],
    bestDays: ["Thursday", "Sunday"],
    suggestedTime: "6:30 PM",
    estimatedTicketPrice: 16,
    estimatedAttendance: 55,
    intendedAudience: "Sober-curious guests, wellness-minded guests, food/drink explorers",
    foodDrinkAngle: "Mocktail/refresher stations with optional spirit add-on only after ID check.",
    marketingHook: "Build the next On Par signature refresher.",
    trendBasis: "Restaurant and bar trend coverage highlights refreshers, mocktails, and intentional beverage experiences.",
    sourceLinks: [sourceLinks.foodBeverage, sourceLinks.barTrends]
  },
  {
    id: "hot-honey-showdown",
    title: "Hot Honey Showdown",
    category: "Food",
    concept: "A spicy-sweet tasting night with hot honey wings, flatbreads, fries, and mini challenges where guests vote for the permanent menu feature.",
    whyItFits: "Food becomes interactive and gives the kitchen a market-test event that can drive repeat visits.",
    bestMonths: ["September", "October", "January"],
    bestDays: ["Thursday", "Saturday"],
    suggestedTime: "7:00 PM",
    estimatedTicketPrice: 20,
    estimatedAttendance: 80,
    intendedAudience: "Foodies, groups, date-night guests, spicy-food fans",
    foodDrinkAngle: "Hot honey and global spice flights with beer/mocktail pairings.",
    marketingHook: "Sweet heat. Big votes. One winning menu item.",
    trendBasis: "Hot honey, gochujang, and global flavor profiles are prominent 2026 restaurant trend themes.",
    sourceLinks: [sourceLinks.foodBeverage, sourceLinks.jamesBeard]
  },
  {
    id: "bougie-bathroom-self-care-night",
    title: "Glow-Up Game Night",
    category: "Mixer",
    concept: "A premium but affordable self-care social with photo stations, mini makeovers from local partners, mocktails, karaoke, and games.",
    whyItFits: "It turns On Par into an experience-first night out and opens vendor partnership revenue.",
    bestMonths: ["March", "May", "August"],
    bestDays: ["Friday", "Sunday"],
    suggestedTime: "6:00 PM",
    estimatedTicketPrice: 22,
    estimatedAttendance: 75,
    intendedAudience: "Women, friend groups, birthday groups, content creators",
    foodDrinkAngle: "Pretty mocktails/cocktails, dessert boards, and premium photo-ready garnishes.",
    marketingHook: "Games, glam, and group photos.",
    trendBasis: "Experience-first events and premium festival-style upgrades show demand for memorable, photo-friendly add-ons.",
    sourceLinks: [sourceLinks.liveNation, sourceLinks.eventbriteSocial]
  },
  {
    id: "micro-market-meet-your-neighbor",
    title: "Meet Your Neighbor Micro Market",
    category: "Partner",
    concept: "A community-market night with 6-10 small local vendors, mini games, food features, and a social passport card.",
    whyItFits: "It matches demand for community connection while giving On Par partner-hosted content and new audiences.",
    bestMonths: ["September", "November", "April", "June"],
    bestDays: ["Sunday", "Thursday"],
    suggestedTime: "4:00 PM",
    estimatedTicketPrice: 8,
    estimatedAttendance: 120,
    intendedAudience: "Local residents, makers-market shoppers, families, young professionals",
    foodDrinkAngle: "Vendor snack pairings, seasonal mocktails, and passport rewards.",
    marketingHook: "Meet your neighbors without awkward small talk.",
    trendBasis: "Eventbrite reports demand for community-oriented events like markets, block parties, and meet-your-neighbor gatherings.",
    sourceLinks: [sourceLinks.eventbriteSocial]
  },
  {
    id: "puzzle-race-night",
    title: "Puzzle Race Night",
    category: "Competition",
    concept: "Teams race to finish the same puzzle while completing quick On Par mini-challenges between puzzle rounds.",
    whyItFits: "It is operationally simple, repeatable, and works on slower nights.",
    bestMonths: ["January", "March", "July"],
    bestDays: ["Tuesday", "Thursday", "Sunday"],
    suggestedTime: "6:30 PM",
    estimatedTicketPrice: 14,
    estimatedAttendance: 64,
    intendedAudience: "Puzzle fans, friend groups, families, low-key competition guests",
    foodDrinkAngle: "Snack baskets, coffee/mocktail specials, and shareable desserts.",
    marketingHook: "Fastest table wins. Smartest table brags forever.",
    trendBasis: "IRL hobby meetups and puzzle competitions are rising as alternatives to passive nightlife.",
    sourceLinks: [sourceLinks.genZEvents, sourceLinks.eventbriteSocial]
  },
  {
    id: "silent-book-club-karaoke-after",
    title: "Silent Book Club + Karaoke After",
    category: "Mixer",
    concept: "A relaxed reading/social hour followed by optional karaoke, mocktails, and bookish bingo prompts.",
    whyItFits: "It creates a new quieter early-evening use case, then naturally transitions into On Par's entertainment strengths.",
    bestMonths: ["January", "February", "September", "November"],
    bestDays: ["Sunday", "Tuesday"],
    suggestedTime: "5:00 PM",
    estimatedTicketPrice: 10,
    estimatedAttendance: 50,
    intendedAudience: "BookTok fans, introverts, friend groups, solo guests",
    foodDrinkAngle: "Tea refreshers, dessert bites, cozy mocktails, and optional wine after ID check.",
    marketingHook: "Read quietly. Sing loudly.",
    trendBasis: "Niche hobby meetups and social events built around identity/interests are strong for younger audiences.",
    sourceLinks: [sourceLinks.genZEvents, sourceLinks.eventbriteSocial]
  },
  {
    id: "global-snack-passport",
    title: "Global Snack Passport",
    category: "Food",
    concept: "A ticketed tasting passport with small bites inspired by global flavors, trivia questions at each station, and a guest-vote winner.",
    whyItFits: "It combines food discovery, trivia, and movement through the venue.",
    bestMonths: ["April", "June", "September"],
    bestDays: ["Thursday", "Saturday"],
    suggestedTime: "7:00 PM",
    estimatedTicketPrice: 28,
    estimatedAttendance: 90,
    intendedAudience: "Food explorers, couples, friend groups, trivia fans",
    foodDrinkAngle: "Global flavor stations with mocktail/cocktail pairing options.",
    marketingHook: "Eat around the world without leaving Beavercreek.",
    trendBasis: "Global flavors and interactive dining are major restaurant/event trends.",
    sourceLinks: [sourceLinks.foodBeverage, sourceLinks.jamesBeard]
  },
  {
    id: "creator-night",
    title: "Content Creator Game Night",
    category: "Mixer",
    concept: "A creator-friendly evening with photo zones, quick challenges, a reel contest, and a prize for best On Par content.",
    whyItFits: "It can generate user content while showcasing attractions in a natural way.",
    bestMonths: ["August", "October", "December", "June"],
    bestDays: ["Thursday", "Friday"],
    suggestedTime: "7:00 PM",
    estimatedTicketPrice: 12,
    estimatedAttendance: 70,
    intendedAudience: "Local creators, students, young professionals, friend groups",
    foodDrinkAngle: "Photogenic drinks, dessert flights, and shareable table snacks.",
    marketingHook: "Make the reel. Win the night.",
    trendBasis: "Experiential events increasingly need visual, shareable moments and participation-first formats.",
    sourceLinks: [sourceLinks.liveNation, sourceLinks.genZEvents]
  },
  {
    id: "mini-golf-supper-club",
    title: "Mini Golf Supper Club",
    category: "Food",
    concept: "A casual supper-club format with one shared plate course, one activity round, and table-switching between courses.",
    whyItFits: "It combines eating-with-strangers, social discovery, and On Par activities without feeling like speed dating.",
    bestMonths: ["February", "May", "November"],
    bestDays: ["Sunday", "Thursday"],
    suggestedTime: "6:30 PM",
    estimatedTicketPrice: 36,
    estimatedAttendance: 48,
    intendedAudience: "Experience seekers, singles, new residents, food-first guests",
    foodDrinkAngle: "Comfort-food shareables and optional beverage pairing.",
    marketingHook: "Dinner party energy, On Par rules.",
    trendBasis: "Soft partying and experiential dining trends favor structured social meals and lower-pressure connection.",
    sourceLinks: [sourceLinks.softPartying, sourceLinks.jamesBeard]
  },
  {
    id: "bar-olympics-league",
    title: "On Par Bar Olympics League",
    category: "Competition",
    concept: "A four-week league rotating through darts, mini golf, karaoke, duckpin, and trivia-style bonus rounds.",
    whyItFits: "It uses multiple On Par attractions and creates repeat weekly attendance.",
    bestMonths: ["January", "April", "July"],
    bestDays: ["Tuesday", "Wednesday", "Thursday"],
    suggestedTime: "7:00 PM",
    estimatedTicketPrice: 40,
    estimatedAttendance: 96,
    intendedAudience: "Friend groups, coworkers, competitive socializing fans",
    foodDrinkAngle: "Team snack platters and weekly featured drink/mocktail.",
    marketingHook: "Five games. Four weeks. One champion.",
    trendBasis: "Competitive socializing remains a strong experiential event format for restaurants and bars.",
    sourceLinks: [sourceLinks.cvent, sourceLinks.genZEvents]
  }
];

type DailyTrend = {
  title: string;
  category: EventIdea["category"];
  concept: string;
  foodDrinkAngle: string;
  marketingHook: string;
  trendBasis: string;
  sourceLinks: MarketingPlanSource[];
  price: number;
  attendance: number;
  audience: string;
  days: string[];
  time: string;
};

const dailyTrends: DailyTrend[] = [
  {
    title: "Dirty Soda Flight Night",
    category: "Food",
    concept: "A customizable dirty soda and refresher bar where guests build flights, name their favorite, and vote on a limited-time On Par drink.",
    foodDrinkAngle: "Creamy soda, lemonade, tea, fruit syrup, citrus, and non-dairy creamer flights with optional 21+ add-on.",
    marketingHook: "Build your own little-treat flight.",
    trendBasis: "Dirty soda and customizable alcohol-free drinks are having a major 2026 moment on social platforms.",
    sourceLinks: [sourceLinks.dirtySoda, sourceLinks.barTrends],
    price: 14,
    attendance: 65,
    audience: "Gen Z, sober-curious guests, friend groups",
    days: ["Thursday", "Sunday"],
    time: "6:30 PM"
  },
  {
    title: "Wingperson Mini Golf Mixer",
    category: "Dating",
    concept: "A friend-supported dating night where guests register in pairs, rotate through casual On Par challenges, and meet other pairs without one-on-one pressure.",
    foodDrinkAngle: "Shareable apps, mocktail/cocktail pairings, and table cards for easy conversation.",
    marketingHook: "Bring your wingperson. Meet theirs.",
    trendBasis: "Friendfluence dating and group-first social formats are rising because guests want safer, less awkward ways to meet people.",
    sourceLinks: [sourceLinks.friendfluence, sourceLinks.eventbriteSocial],
    price: 18,
    attendance: 72,
    audience: "Singles 23-38 and their wingpeople",
    days: ["Thursday", "Friday"],
    time: "7:00 PM"
  },
  {
    title: "Early Bird Dance & Games",
    category: "Dance Party",
    concept: "A happy-hour dance party with DJ-lite music, quick games, and no-pressure mingling that wraps before late-night plans.",
    foodDrinkAngle: "Cold brew, refreshers, spritzes, and light snack specials.",
    marketingHook: "Dance early. Sleep normally.",
    trendBasis: "Soft partying and soft clubbing favor daytime or early-evening connection over late alcohol-centered nightlife.",
    sourceLinks: [sourceLinks.softPartying, sourceLinks.barTrends],
    price: 12,
    attendance: 80,
    audience: "Young professionals, friend groups, sober-curious guests",
    days: ["Friday", "Sunday"],
    time: "5:30 PM"
  },
  {
    title: "Vinegar Spritz Lab",
    category: "Food",
    concept: "Guests taste fruit-vinegar spritzes, shrubs, and bright mocktails, then vote on a seasonal house refresher.",
    foodDrinkAngle: "Strawberry, peach, balsamic, and citrus vinegar spritz stations with optional spirit add-on after ID check.",
    marketingHook: "Sweet, tart, fizzy, and very summer.",
    trendBasis: "Fruit vinegars and acidic ingredients are trending in drinks, fruit dishes, and desserts.",
    sourceLinks: [sourceLinks.vinegar, sourceLinks.foodBeverage],
    price: 16,
    attendance: 55,
    audience: "Food/drink explorers, mocktail fans, date-night guests",
    days: ["Thursday", "Sunday"],
    time: "6:30 PM"
  },
  {
    title: "Global Sauce Passport",
    category: "Food",
    concept: "A tasting passport built around sauces, dips, and snacks from global flavor trends, with quick trivia at each station.",
    foodDrinkAngle: "Gochujang, chili crisp, citrus-herb, hot honey, curry, and pickle-bright dipping flights.",
    marketingHook: "Six sauces. One winning flavor.",
    trendBasis: "Global flavors, chiles, citrus, and interactive tasting are recurring 2026 food and beverage trends.",
    sourceLinks: [sourceLinks.foodBeverage, sourceLinks.jamesBeard],
    price: 24,
    attendance: 90,
    audience: "Foodies, couples, trivia guests, friend groups",
    days: ["Thursday", "Saturday"],
    time: "7:00 PM"
  },
  {
    title: "Camera Roll Scavenger Hunt",
    category: "Competition",
    concept: "Teams complete photo and video prompts throughout On Par, creating safe UGC moments and a final social vote.",
    foodDrinkAngle: "Photo-ready mocktails, dessert flight, and shareable appetizer specials.",
    marketingHook: "Your camera roll is the scoreboard.",
    trendBasis: "Shareable, interactive, creator-friendly event formats are increasingly important for experiential marketing.",
    sourceLinks: [sourceLinks.liveNation, sourceLinks.genZEvents],
    price: 10,
    attendance: 85,
    audience: "Creators, students, friend groups, young professionals",
    days: ["Thursday", "Friday"],
    time: "7:00 PM"
  },
  {
    title: "Third Place Social Club",
    category: "Mixer",
    concept: "A low-stakes meetup for solo guests and new residents with table prompts, casual team games, and rotating activity stations.",
    foodDrinkAngle: "Coffee refreshers, mocktails, snack baskets, and shared dessert boards.",
    marketingHook: "Come solo. Leave with plans.",
    trendBasis: "Community-focused events and meet-your-neighbor formats answer demand for real-world connection.",
    sourceLinks: [sourceLinks.eventbriteSocial, sourceLinks.softPartying],
    price: 12,
    attendance: 70,
    audience: "New residents, solo guests, young professionals, friend seekers",
    days: ["Tuesday", "Sunday"],
    time: "6:00 PM"
  },
  {
    title: "Micro-Tournament Night",
    category: "Competition",
    concept: "A quick-hit tournament night where teams rotate through short rounds of mini golf, darts, karaoke, and trivia bonus questions.",
    foodDrinkAngle: "Team platters, featured draft/mocktail, and winner dessert comp.",
    marketingHook: "Four games. Ninety minutes. Bragging rights.",
    trendBasis: "Competitive socializing keeps restaurant/bar events active and repeatable.",
    sourceLinks: [sourceLinks.cvent, sourceLinks.genZEvents],
    price: 15,
    attendance: 96,
    audience: "Coworkers, friend groups, competitive socializing fans",
    days: ["Tuesday", "Wednesday", "Thursday"],
    time: "7:00 PM"
  },
  {
    title: "Tiny Luxury Tasting",
    category: "Tasting",
    concept: "A small-plate affordable-luxury tasting with premium-feeling bites, drink pairings, and social game breaks.",
    foodDrinkAngle: "Mini upscale bites, savory cocktails/mocktails, and one premium featured pairing.",
    marketingHook: "A fancy night out without the fancy-night price.",
    trendBasis: "Affordable luxury, intentional hospitality, and premium add-ons are strong 2026 experience trends.",
    sourceLinks: [sourceLinks.jamesBeard, sourceLinks.liveNation],
    price: 32,
    attendance: 48,
    audience: "Couples, friend groups, food-first guests",
    days: ["Thursday", "Sunday"],
    time: "6:30 PM"
  },
  {
    title: "Craft & Karaoke Club",
    category: "Mixer",
    concept: "A hands-on craft or DIY station followed by optional karaoke, letting guests socialize around making before performing.",
    foodDrinkAngle: "Theme-colored mocktails/cocktails, snack boards, and dessert bites.",
    marketingHook: "Make something first. Sing something later.",
    trendBasis: "Hands-on creative activations are a growing event format for participation and connection.",
    sourceLinks: [sourceLinks.liveNation, sourceLinks.genZEvents],
    price: 20,
    attendance: 60,
    audience: "Friend groups, hobby guests, birthday groups",
    days: ["Sunday", "Thursday"],
    time: "5:30 PM"
  },
  {
    title: "Mood Menu Game Night",
    category: "Food",
    concept: "Guests choose a food/drink flight based on their mood, then join matching activity zones like chill, chaos, cozy, or competitive.",
    foodDrinkAngle: "Mood-based mocktail/cocktail and snack flight pairings.",
    marketingHook: "Pick your mood. We will pick your game.",
    trendBasis: "Personalized, interactive, sensory experiences are central to modern event design.",
    sourceLinks: [sourceLinks.liveNation, sourceLinks.foodBeverage],
    price: 22,
    attendance: 78,
    audience: "Friend groups, date-night guests, content-driven guests",
    days: ["Friday", "Saturday"],
    time: "7:00 PM"
  },
  {
    title: "Low-Stakes Singles Brunch",
    category: "Dating",
    concept: "A Sunday social with brunch snacks, conversation cards, and optional activity matching instead of high-pressure speed dating.",
    foodDrinkAngle: "Brunch bites, coffee drinks, refreshers, and optional mimosa-style package after ID check.",
    marketingHook: "Dating, but make it daylight.",
    trendBasis: "Dating burnout is pushing people toward safer, social, friend-supported, lower-pressure formats.",
    sourceLinks: [sourceLinks.friendfluence, sourceLinks.softPartying],
    price: 18,
    attendance: 64,
    audience: "Singles, friend groups, brunch crowd",
    days: ["Sunday"],
    time: "12:00 PM"
  }
];

const monthlySeasonalHooks: Record<number, string[]> = {
  0: ["new routines", "mocktails", "cozy competition", "puzzle season"],
  1: ["friendfluence dating", "Galentine's", "low-pressure date night", "big-game socializing"],
  2: ["spring reset", "brackets", "green food and drinks", "women-led vendor collabs"],
  3: ["golf season", "April Fools", "Earth Day", "spring social clubs"],
  4: ["Derby style", "graduations", "Mother's Day", "Cinco-inspired flavor"],
  5: ["Pride month", "summer kickoff", "dad jokes", "daytime socials"],
  6: ["beat-the-heat", "summer friend groups", "dirty soda", "giveaway season"],
  7: ["back-to-school", "new friends", "late summer socials", "fandom nights"],
  8: ["fall kickoff", "global flavors", "football", "witchy season"],
  9: ["Halloween", "costumes", "horror", "glow events"],
  10: ["gratitude", "Friendsgiving", "anniversary", "customer appreciation"],
  11: ["holiday parties", "giftable experiences", "ugly sweaters", "year-end recaps"]
};

function buildDailyIdeaDrops(baseDate: Date): EventIdea[] {
  return Array.from({ length: 365 }, (_, index) => {
    const dropDate = addDays(baseDate, index);
    const trend = dailyTrends[index % dailyTrends.length];
    const seasonalHooks = monthlySeasonalHooks[dropDate.getMonth()] ?? ["social connection"];
    const hook = seasonalHooks[index % seasonalHooks.length];
    const variant = index % 4 === 0 ? "Challenge" : index % 4 === 1 ? "Social" : index % 4 === 2 ? "Lab" : "Night";
    const title = `${hookTitle(hook)} ${trend.title.replace(/ Night$| Club$| Lab$/, "")} ${variant}`;

    return {
      id: `daily-${format(dropDate, "yyyy-MM-dd")}-${trend.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      dailyDropDate: format(dropDate, "yyyy-MM-dd"),
      isDailyDrop: true,
      title,
      category: trend.category,
      concept: `${trend.concept} Seasonal angle: build the promotion around ${hook}.`,
      whyItFits: `This gives On Par a fresh daily idea tied to ${hook} while still using the venue's games, food, drinks, karaoke, and social spaces.`,
      bestMonths: [format(dropDate, "MMMM")],
      bestDays: trend.days,
      suggestedTime: trend.time,
      estimatedTicketPrice: trend.price,
      estimatedAttendance: trend.attendance,
      intendedAudience: trend.audience,
      foodDrinkAngle: trend.foodDrinkAngle,
      marketingHook: `${trend.marketingHook} ${hookTitle(hook)} edition.`,
      trendBasis: trend.trendBasis,
      sourceLinks: trend.sourceLinks
    };
  });
}

function hookTitle(hook: string) {
  return hook
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
