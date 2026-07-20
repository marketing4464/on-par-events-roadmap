import type { YearlyMarketingMonth } from "./types";

const sources = {
  opm: {
    label: "OPM Federal Holidays",
    url: "https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/"
  },
  onPar: {
    label: "On Par website/events",
    url: "https://onparbar.com/"
  },
  eventbrite: {
    label: "On Par Eventbrite organizer",
    url: "https://www.eventbrite.com/o/on-par-entertainment-76064952393"
  },
  downtownDayton: {
    label: "Downtown Dayton signature events",
    url: "https://downtowndayton.org/things-to-do/signature-events/"
  },
  daytonLocal: {
    label: "DaytonLocal festival calendar",
    url: "https://www.daytonlocal.com/july-festivals/"
  },
  cultureWorks: {
    label: "Culture Works festival listing",
    url: "https://cultureworks.org/engage/festivals/"
  },
  roadtrips: {
    label: "Major sporting events calendar",
    url: "https://www.roadtrips.com/calendar-of-events/"
  },
  onLocation: {
    label: "On Location sports schedule",
    url: "https://onlocationexp.com/sports-schedule"
  },
  food: {
    label: "US Foods restaurant food holidays",
    url: "https://www.usfoods.com/tools-tips-and-ideas/articles-and-publications/articles/let-food-holidays-work-for-you"
  },
  social: {
    label: "Brandwatch social media holiday calendar",
    url: "https://www.brandwatch.com/blog/social-media-holiday-calendar/"
  },
  movies: {
    label: "Fathom upcoming releases",
    url: "https://www.fathomentertainment.com/releases/"
  }
};

export const yearlyMarketingPlan: YearlyMarketingMonth[] = [
  {
    month: "August 2026",
    strategy: "Late-summer social reset: lean into back-to-school, movie/game nostalgia, and low-pressure social events before fall schedules get busy.",
    calendarAnchors: [
      "Downtown Dayton Art in the City runs August 1 and throughout the month.",
      "Dayton African American Cultural Festival is listed for August 15-16.",
      "Food hooks include National Fajita Day on August 18 and National Hot and Spicy Day on August 19.",
      "Major cinema nostalgia releases include Ghibli and classic screenings in August."
    ],
    onParTieIns: [
      "Use existing August trivia themes: Ted Lasso, Marvel Cinematic Universe, Pokemon, and Shrek.",
      "Pair Thursday bingo with Sports Comedy Bingo, Marvel Bingo, Pokemon Bingo, and Meme Bingo.",
      "Push On Par as the post-festival hangout and back-to-school friend-group reset."
    ],
    recommendedEvents: [
      "Paid: On Par Mini Golf Masters tournament with team pricing and prize ladder.",
      "Paid: Friendship Mixer: Meet Your New Crew for new residents, teachers, college students, and young professionals.",
      "Free/lead-gen: Hot & Spicy menu feature week with a QR vote for September events."
    ],
    contentAngles: [
      "Short reels: 'Pick your team name' and 'which Marvel hero wins mini golf?'",
      "Polls: best Shrek quote, favorite Pokemon starter, best Ted Lasso one-liner.",
      "Email subject: 'Your late-summer excuse to get the group together.'"
    ],
    timingNotes: [
      "Publish paid-event listing by late July or first week of August.",
      "Use every Wednesday trivia host script to mention the Saturday paid event.",
      "Avoid direct conflict with large Dayton weekend festivals unless positioning as an after-party."
    ],
    sources: [sources.onPar, sources.eventbrite, sources.downtownDayton, sources.food, sources.movies]
  },
  {
    month: "September 2026",
    strategy: "Fall kickoff: build cozy, spooky, fandom, football, and food/drink energy while people return to routines.",
    calendarAnchors: [
      "Labor Day is September 7, 2026.",
      "Downtown Dayton lists First Friday on September 4 and Dayton Greek Festival September 11-13.",
      "Food hooks include National Guacamole Day on September 16 and National Coffee Day on September 29.",
      "Football season begins in September; verify exact local/team dates before publishing watch-party claims."
    ],
    onParTieIns: [
      "Use existing September trivia themes: Disney & Pixar, Practical Magic, Horror Movie, One Piece, Twilight.",
      "Bingo tie-ins: Disney Bingo, Practical Magic Bingo, Horror Movie Bingo, Anime Bingo, Vampire Bingo.",
      "This is the ramp into Halloween, so start teasing October events by mid-month."
    ],
    recommendedEvents: [
      "Paid: Practical Magic Night Market + Mini Golf with themed drinks, vendors, photo area, and costume perk.",
      "Paid: Anime & Arcade Night around One Piece week.",
      "Free/lead-gen: National Coffee Day morning-to-night cafe/mocktail feature."
    ],
    contentAngles: [
      "Build a 'fall at On Par' content series with drinks, lights, and friend-group activities.",
      "Use Twilight/Horror polls to collect Halloween party theme votes.",
      "Vendor spotlight posts for Practical Magic Night Market."
    ],
    timingNotes: [
      "Launch Halloween event save-the-dates by mid-September.",
      "Run paid-event ads 10-14 days before Practical Magic Night Market.",
      "Use Labor Day week for softer family/friend content rather than heavy ticket pushes."
    ],
    sources: [sources.opm, sources.downtownDayton, sources.food, sources.onPar]
  },
  {
    month: "October 2026",
    strategy: "Halloween owns the month: costume, horror, magic, villains, and party content should drive both free recurring events and ticketed nights.",
    calendarAnchors: [
      "Columbus Day/Indigenous Peoples' Day federal holiday falls October 12, 2026.",
      "Halloween is October 31.",
      "Food hooks include National Vegetarian Day October 1, National Dessert Day October 14, and National Taco Day October 16.",
      "Fathom lists October classic/spooky cinema moments including Pan's Labyrinth and Spirited Away screenings."
    ],
    onParTieIns: [
      "Use existing October trivia themes: Hocus Pocus, WandaVision/VisionQuest, Scream & Slasher Horror, Halloween Movie Marathon.",
      "Run costume-friendly bingo: witches, vampires, slashers, villains, and Halloween movies.",
      "Promote On Par's karaoke, mini golf, darts, bowling, and self-pour beverage wall as party activities."
    ],
    recommendedEvents: [
      "Paid: Glow Golf + Karaoke Costume Kickoff early in the month.",
      "Paid: Halloween Costume Contest + Dance/Karaoke Party the weekend before Halloween or Halloween night.",
      "Paid: Horror Movie Bingo After Dark with 21+ beverage package."
    ],
    contentAngles: [
      "Countdown: 13 nights of On Par Halloween.",
      "UGC: costume reveal wall, best group costume, staff picks.",
      "Email subject: 'Your Halloween plans are officially handled.'"
    ],
    timingNotes: [
      "Launch major Halloween tickets 6-8 weeks ahead, with final push starting October 19.",
      "Flag copyright/licensing review for franchise-specific graphics, logos, characters, and music.",
      "Have sober-driver and responsible-service messaging ready for late-night events."
    ],
    sources: [sources.opm, sources.food, sources.movies, sources.onPar]
  },
  {
    month: "November 2026",
    strategy: "Gratitude, Friendsgiving, fandom, and the On Par anniversary should lead the month; Thanksgiving week should focus on group gatherings and return visits.",
    calendarAnchors: [
      "Veterans Day is November 11, 2026.",
      "On Par's permanent anniversary date is November 16.",
      "Thanksgiving is November 26, 2026.",
      "Black Friday weekend follows immediately after Thanksgiving."
    ],
    onParTieIns: [
      "Use existing November trivia themes: The Office, Scooby-Doo, The Hunger Games, Friends Thanksgiving.",
      "Turn recurring trivia and bingo into anniversary lead-up channels.",
      "Use guest appreciation, loyalty cards, bounce-back offers, and memory-wall content."
    ],
    recommendedEvents: [
      "Signature Paid: On Par Guest Appreciation and Three-Year Anniversary Celebration on/near November 16.",
      "Paid: Friendsgiving Game Night with shareable food packages.",
      "Free/lead-gen: Customer Awards Week with nominations and social voting."
    ],
    contentAngles: [
      "Three Years of Fun photo timeline.",
      "Guest memory wall: ask followers for favorite On Par memories.",
      "Bounce-back campaign: visit anniversary week, return in January."
    ],
    timingNotes: [
      "Anniversary marketing must start 10-12 weeks ahead.",
      "Press/vendor/sponsor outreach should start by late August.",
      "Thanksgiving week content should emphasize group reservations and private-event leads."
    ],
    sources: [sources.opm, sources.onPar]
  },
  {
    month: "December 2026",
    strategy: "Holiday party season: prioritize corporate groups, family/friend reunions, ugly sweater content, and low-friction ticketed holiday nights.",
    calendarAnchors: [
      "Christmas Day is December 25, 2026.",
      "New Year's Eve is December 31, 2026.",
      "December social calendars include Advent/holiday campaign opportunities.",
      "Fathom lists It's a Wonderful Life 80th anniversary screenings December 18-25."
    ],
    onParTieIns: [
      "Use existing December trivia themes: Christmas Movie, Dune, Disney Holiday, 2026 Pop Culture.",
      "Bingo tie-ins: Ugly Sweater Bingo, Holiday Movie Bingo, Disney Holiday Bingo, Year-in-Review Bingo.",
      "Promote On Par for company outings and private holiday parties."
    ],
    recommendedEvents: [
      "Paid: Ugly Sweater Karaoke + Holiday Bingo Party.",
      "Paid: New Year's Eve Eve Game Night for people who avoid NYE crowds.",
      "Private-event push: office party packages with bowling, golf, karaoke, food, and drink options."
    ],
    contentAngles: [
      "Gift-card and experience-gift posts.",
      "Holiday party availability countdown.",
      "Year-in-review reel using On Par memories and guest photos."
    ],
    timingNotes: [
      "Holiday party marketing should launch by early October.",
      "NYE-related paid events should go live by mid-November.",
      "Avoid implying copyrighted holiday film/character partnerships without licensing review."
    ],
    sources: [sources.opm, sources.movies, sources.onPar]
  },
  {
    month: "January 2027",
    strategy: "New year, new routine: use low-cost social events, puzzle/game hooks, mocktails, and winter cabin-fever positioning.",
    calendarAnchors: [
      "New Year's Day is January 1, 2027.",
      "Martin Luther King Jr. Day is January 18, 2027.",
      "National Puzzle Day appears on January social media calendars.",
      "The Australian Open is listed January 17-31, 2027."
    ],
    onParTieIns: [
      "Start 2027 trivia with broad themes: 2026 Pop Culture rewind, The Office, Disney/Pixar, and music rounds.",
      "Bingo themes: New Year Bingo, Resolution Bingo, Puzzle Bingo, Winter Comfort Bingo.",
      "Use anniversary bounce-back offers from November to drive January repeat visits."
    ],
    recommendedEvents: [
      "Paid: New Year New Friends Mixer.",
      "Paid: Dry January Mocktail Mini Golf Night.",
      "Free/lead-gen: National Puzzle Day team challenge with QR capture."
    ],
    contentAngles: [
      "Position On Par as the anti-hibernation spot.",
      "Mocktail wall / self-pour alternatives content.",
      "Email subject: 'Cabin fever has a cure.'"
    ],
    timingNotes: [
      "Launch January events before Christmas while people are planning winter activities.",
      "Keep ticket prices accessible after holiday spending.",
      "Avoid alcohol-heavy concepts during Dry January unless offering strong mocktail options."
    ],
    sources: [sources.opm, sources.social, sources.roadtrips]
  },
  {
    month: "February 2027",
    strategy: "Own the social/dating lane: Valentine's, Galentine's, football, and winter date-night energy are all strong fits for On Par.",
    calendarAnchors: [
      "Super Bowl LXI is listed for February 14, 2027 in Los Angeles.",
      "Valentine's Day is February 14.",
      "Washington's Birthday/Presidents Day is February 15, 2027.",
      "Daytona 500 race week is listed February 17-22, 2027."
    ],
    onParTieIns: [
      "Trivia themes: rom-coms, music love songs, sports, sitcom couples.",
      "Bingo themes: Galentine's Bingo, Red Flag Bingo, Big Game Commercial Bingo.",
      "Use On Par's games to make date nights less awkward than dinner-only plans."
    ],
    recommendedEvents: [
      "Paid: Speed Dating at On Par.",
      "Paid: Galentine's Karaoke + Bingo Night.",
      "Paid/Free hybrid: Big Game Commercial Bingo if licensing/broadcast rules are verified."
    ],
    contentAngles: [
      "Red flag / green flag reels.",
      "Date-night activity carousel.",
      "Singles waitlist and age-bracket polls."
    ],
    timingNotes: [
      "Publish Valentine's and Super Bowl-adjacent events by early January.",
      "Do not use NFL/Super Bowl marks in paid promotion without proper wording/licensing review.",
      "Separate singles, couples, and friend-group messaging."
    ],
    sources: [sources.roadtrips, sources.onLocation, sources.opm]
  },
  {
    month: "March 2027",
    strategy: "Spring energy starts with basketball brackets, St. Patrick's Day, women's history themes, and early patio/social-season planning.",
    calendarAnchors: [
      "March is strong for college basketball bracket culture; verify NCAA local dates before publishing.",
      "St. Patrick's Day is March 17.",
      "Women's History Month creates partner and community content opportunities.",
      "Fathom lists select March entertainment releases and live cinema events."
    ],
    onParTieIns: [
      "Trivia themes: sports movies, sitcoms, music, Irish pop culture, women in entertainment.",
      "Bingo themes: Bracket Bingo, Lucky Bingo, Green Food/Drink Bingo.",
      "Use game attractions for bracket-style tournaments."
    ],
    recommendedEvents: [
      "Paid: Bracket Battle Game Tournament.",
      "Paid: St. Patrick's Karaoke + Green Game Night.",
      "Partner: Women-Owned Vendor Mini Market, if management approves vendor ops."
    ],
    contentAngles: [
      "Bracket templates on Instagram stories.",
      "Lucky shot / lucky roll reels.",
      "Team sign-up countdowns."
    ],
    timingNotes: [
      "Launch bracket tournament signups in late February.",
      "Confirm responsible-service plans for St. Patrick's concepts.",
      "Use Sunday events for family/team-friendly tournament formats."
    ],
    sources: [sources.movies, sources.social]
  },
  {
    month: "April 2027",
    strategy: "Spring competition month: April Fools, Masters, Final Four, Earth Day, and patio/weather optimism support tournaments and playful campaigns.",
    calendarAnchors: [
      "The 2027 Final Four is listed April 2-6 in Detroit.",
      "The 2027 Masters is listed April 5-11.",
      "Earth Day is April 22.",
      "Fathom lists April cinema/live-event releases."
    ],
    onParTieIns: [
      "Trivia themes: sports, golf movies, April Fools, Disney/Pixar spring, classic movies.",
      "Bingo themes: Golf Bingo, Prank Bingo, Earth Day Bingo.",
      "Mini golf gives On Par an obvious Masters-week hook."
    ],
    recommendedEvents: [
      "Paid: Green Jacket Mini Golf Classic.",
      "Paid: April Fools Comedy/Karaoke Contest.",
      "Community: Earth Day reusable cup/mocktail or sustainability-themed giveback night."
    ],
    contentAngles: [
      "Mini golf trick-shot reels.",
      "Best team outfit contest.",
      "Earth Day low-waste event pledge content."
    ],
    timingNotes: [
      "Open Green Jacket Mini Golf Classic registration in early March.",
      "Use Masters language carefully; avoid implying affiliation.",
      "Have rain-plan messaging ready for spring weather."
    ],
    sources: [sources.roadtrips, sources.movies]
  },
  {
    month: "May 2027",
    strategy: "Celebration month: Derby, Cinco de Mayo, Mother's Day, graduation, Memorial Day, and Indy 500 all support groups and occasion-based bookings.",
    calendarAnchors: [
      "Kentucky Derby is listed May 1, 2027.",
      "Cinco de Mayo is May 5.",
      "Memorial Day is May 31, 2027.",
      "Indianapolis 500 weekend is listed May 28-30, 2027."
    ],
    onParTieIns: [
      "Trivia themes: party music, racing, moms in movies/TV, graduation pop culture.",
      "Bingo themes: Derby Bingo, Margarita Bingo, Graduation Bingo.",
      "Use On Par as the after-graduation family entertainment option."
    ],
    recommendedEvents: [
      "Paid: Derby Day Best Hat Mini Golf Social.",
      "Paid: Cinco de Mayo Taco/Margarita Game Night with compliance review.",
      "Private-event push: graduation and end-of-school-year party packages."
    ],
    contentAngles: [
      "Best hat contest, mocktail/margarita feature, graduation photo spots.",
      "Mother's Day experience gift content.",
      "Memorial Day weekend group reservation posts."
    ],
    timingNotes: [
      "Derby and Cinco listings should go live in late March.",
      "Alcohol-forward events require ID/service verification.",
      "Graduation party marketing should start by February/March."
    ],
    sources: [sources.roadtrips, sources.opm, sources.food]
  },
  {
    month: "June 2027",
    strategy: "Summer launch: Pride Month, Father's Day, Juneteenth, summer break, and warm-weather group outings support friend/family campaigns.",
    calendarAnchors: [
      "Juneteenth is June 19, 2027, observed Friday June 18 for many federal employees.",
      "Father's Day falls in June.",
      "Summer solstice is June 21.",
      "The French Open is listed May 23-June 6, 2027."
    ],
    onParTieIns: [
      "Trivia themes: dads in pop culture, summer movies, music, sports, Disney/Pixar.",
      "Bingo themes: Dad Joke Bingo, Pride Bingo, Summer Songs Bingo.",
      "Use family and group activities for summer-break daytime offers."
    ],
    recommendedEvents: [
      "Paid: Dad Joke Karaoke + Mini Golf Tournament.",
      "Paid: Summer Kickoff Silent Disco.",
      "Community/partner: Pride-friendly friendship mixer with clear inclusion standards."
    ],
    contentAngles: [
      "Dad joke submission reels.",
      "Summer bucket-list carousel.",
      "Group package posts for families, camps, and workplaces."
    ],
    timingNotes: [
      "Launch summer event calendar by mid-May.",
      "Plan daytime weekday promotions for families once school is out.",
      "For Juneteenth/Pride content, keep tone community-minded rather than opportunistic."
    ],
    sources: [sources.opm, sources.roadtrips, sources.social]
  },
  {
    month: "July 2027",
    strategy: "Peak summer: Independence Day weekend, friendship/social content, fair/festival season, and summer food hooks create strong reasons to gather indoors.",
    calendarAnchors: [
      "Independence Day 2027 falls on Sunday July 4 and is observed Monday July 5 for many federal employees.",
      "Dayton-area July festival calendars typically include county fairs and summer festivals; verify current-year listings before publishing.",
      "Food/social calendars include mid-July giveaway/friendship-style hooks.",
      "Hot-weather messaging supports indoor entertainment."
    ],
    onParTieIns: [
      "Trivia themes: summer blockbusters, patriotic pop culture, Disney/Pixar, music, Marvel.",
      "Bingo themes: Summer Songs Bingo, Backyard BBQ Bingo, Friendship Bingo.",
      "Promote On Par as the air-conditioned summer hangout."
    ],
    recommendedEvents: [
      "Paid: Red, White & Brew Game Night with responsible-service review.",
      "Paid: Summer Singles Luau/Mixer.",
      "Free/lead-gen: National Give Something Away-style prize week with bounce-back cards."
    ],
    contentAngles: [
      "Beat the heat at On Par.",
      "Summer group challenge: mini golf + karaoke + bingo passport.",
      "Giveaway week: tag your summer game-night crew."
    ],
    timingNotes: [
      "Launch July 4 weekend messaging by early June.",
      "Avoid competing directly with fireworks times; position as pre/post-fireworks or long-weekend activity.",
      "Use prize/giveaway hooks to capture emails for August planning."
    ],
    sources: [sources.opm, sources.daytonLocal, sources.social]
  }
];
