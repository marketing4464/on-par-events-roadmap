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
  }
};

export const eventIdeas: EventIdea[] = [
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
