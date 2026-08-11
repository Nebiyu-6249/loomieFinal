/**
 * Everything the founder supplied, in one place.
 *
 * The service and process copy is reproduced word for word and should not be
 * rewritten to sound more polished — it is deliberately plain, and the plain
 * register is the point.
 */

export const SITE = {
  name: "Loomie",
  /** Stays until the founder replaces it. */
  email: "hello@loomiestudio.com",
  specLine: "Clear. Connected. Complete.",
  origin: "Born in India. Raised in Saudi Arabia. Developed in the UAE.",
  timezone: { label: "GST", offsetHours: 4, city: "Dubai" },
} as const;

export const TAGLINE =
  "We hear what you demand, and sense what you desire. Curiosity leads us beyond the obvious. Clarity is how we answer.";

export const STORY =
  "Loomie began the way snow does: quietly, without competing for attention. It doesn't chase the nightlights, the loud trend-lit brilliance that's gone by morning. Snow becomes a river under the warmth of the sun, and a river reaches everywhere.";

export const MISSION =
  "To craft meaningful and visually compelling brand experiences that communicate with clarity and purpose, combining creativity and strategy across digital and physical touchpoints.";

export const VISION =
  "To become a trusted creative partner for brands seeking clarity, consistency and impact.";

export interface Meaning {
  word: string;
  language: string;
}

export const MEANINGS: readonly Meaning[] = [
  { word: "snow", language: "Finnish" },
  { word: "river", language: "Albanian" },
  { word: "lights", language: "Italian" },
];

export interface NamedIdea {
  name: string;
  detail: string;
}

export const VALUES: readonly NamedIdea[] = [
  { name: "Clarity", detail: "Simplicity and integrity." },
  {
    name: "Connectivity",
    detail:
      "From logo to UI, avatar to packaging, one system carrying a single idea all the way through.",
  },
  {
    name: "Completeness",
    detail:
      "Nothing left unfinished, every touchpoint considered, every detail resolved.",
  },
];

export const PILLARS: readonly NamedIdea[] = [
  { name: "Elegance", detail: "Design that speaks without noise." },
  { name: "Reliability", detail: "Systems that hold, no matter the season." },
  { name: "Advancement", detail: "Moving like a river, always finding the way." },
];

export interface Service {
  slug: string;
  title: string;
  /** Founder's copy. Word for word. */
  body: string;
}

export const SERVICES: readonly Service[] = [
  {
    slug: "logo-design",
    title: "Logo design",
    body: "A mark that still reads at 24 pixels, on a business card, and stitched onto a shirt. You get the full file set, not a single PNG.",
  },
  {
    slug: "web-brand-identity",
    title: "Web brand identity",
    body: "Your colours, type and spacing written down as actual rules, so the website, the deck and the Instagram grid stop looking like three different companies.",
  },
  {
    slug: "marketing-design",
    title: "Marketing design",
    body: "Campaign and social assets built from your own system, so the fortieth post still looks like it came from the same place as the first.",
  },
  {
    slug: "website-design",
    title: "Website design",
    body: "Sites that load fast, read properly on a phone, and do not fall apart the first time you add a page.",
  },
];

export interface ProcessStep {
  title: string;
  detail: string;
}

/** A real sequence, which is the only reason these carry numbers. */
export const PROCESS: readonly ProcessStep[] = [
  {
    title: "Discovery",
    detail: "Define brand goals, audience, offer, tone and visual needs.",
  },
  {
    title: "Research",
    detail: "Review the market, category cues and audience expectations.",
  },
  {
    title: "Concept direction",
    detail: "Build two focused identity directions with clear reasoning.",
  },
  {
    title: "Refinement",
    detail: "Adjust the selected direction based on feedback.",
  },
  {
    title: "Final delivery",
    detail: "Editable files, export formats and usage guidance.",
  },
];

export interface TimelineWeek {
  week: string;
  detail: string;
}

export const TIMELINE: readonly TimelineWeek[] = [
  { week: "Week one", detail: "Discovery and direction." },
  { week: "Week two", detail: "Concepts." },
  { week: "Week three", detail: "Refinement and applications." },
  { week: "Week four", detail: "Final files and handover." },
];

export interface Package {
  slug: string;
  name: string;
  /** The founder's wording, from the proposal deck. */
  includes: readonly string[];
  /** What it builds on, where the deck says "everything in". */
  builtOn?: string;
}

/**
 * The three packages, verbatim from the founder's proposal deck.
 *
 * There is no pricing here and none is invented: it is not in any founder
 * material. Every package sends the reader to /contact to ask.
 */
export const PACKAGES_INTRO =
  "Choose the option that matches the current stage of the business.";

export const PACKAGES: readonly Package[] = [
  {
    slug: "starter-identity",
    name: "Starter Identity",
    includes: [
      "Logo suite — primary logo, secondary logo, icon mark, spacing rules",
      "Colour palette — primary, secondary and neutral, with usage guidance",
      "Typography system — font pairing, hierarchy, sample text styles",
      "Mini brand guide",
    ],
  },
  {
    slug: "standard-identity",
    name: "Standard Identity",
    builtOn: "Starter Identity",
    includes: ["Social media samples", "Stationery"],
  },
  {
    slug: "full-identity-kit",
    name: "Full Identity Kit",
    builtOn: "Standard Identity",
    includes: [
      "Presentation cover",
      "Brand pattern",
      "Extended usage examples",
    ],
  },
];

export const AUDIENCE: readonly string[] = [
  "Startups, small and medium businesses, and growing brands that want a strong, consistent visual identity.",
  "Entrepreneurs, product-based businesses, and digital-first companies.",
];

/* ------------------------------------------------------------------------ */

/**
 * The four capability pieces.
 *
 * These are sector pieces, not claimed clients — and that is the accurate
 * thing to publish rather than a compromise. Each one describes the brand
 * problem a sector usually arrives with, how the studio's five steps meet it,
 * and what is handed over at the end. No client names, no testimonials, no
 * metrics, no awards, and nothing written as though a particular project
 * happened.
 *
 * A reader should finish one knowing what working with Loomie is like. That
 * is a higher bar than a case study of invented work, and it is the only one
 * that can be cleared honestly right now.
 */
export interface CapabilityPiece {
  slug: string;
  discipline: string;
  sector: string;
  services: readonly string[];
  /** One line, for the index and the corridor. */
  summary: string;
  /** What this sector usually arrives with. */
  problem: string;
  /** How the five steps meet it. Ordered, and matched to PROCESS. */
  approach: readonly string[];
  /** What is handed over. */
  delivered: readonly string[];
  /** Swap to a real path and the plate composition steps aside. */
  image?: string;
}

export const WORK: readonly CapabilityPiece[] = [
  {
    slug: "brand-identity-hospitality",
    discipline: "Brand identity",
    sector: "Hospitality",
    services: ["Logo suite", "Colour", "Typography", "Brand guide"],
    summary:
      "A full identity for a place people walk into, built to survive a menu, a shopfront and a phone screen.",
    problem:
      "Hospitality brands are used in more physical places than almost anything else — a sign at night, a menu in low light, a coffee cup, a delivery sticker, a phone held at arm's length across a table. Most arrive with a logo that was drawn once at one size for one use, and everything since has been an improvisation: a stretched version for the awning, a cropped one for the app, a different typeface on the menu because the original would not fit. Nothing is wrong on its own, and the whole thing does not add up.",
    approach: [
      "Discovery starts with where the brand is physically used, not with what it should feel like. A list of every surface — signage, menus, packaging, uniforms, the delivery platforms you do not control — sets the constraints everything else answers to.",
      "Research looks at the sector's visual conventions to find which ones are load-bearing and which are only habit. A restaurant does not have to look like a restaurant, but it does have to be legible at four metres.",
      "Two concept directions, both drawn at the smallest and largest sizes they will ever be used at before either is shown. A mark that only works on a presentation slide is not a mark.",
      "Refinement is where the suite is built out: the primary logo, the secondary lockup for tight spaces, the icon for a profile picture, and the spacing rules that stop the next person crowding it.",
      "Delivery is the full file set plus the guide, so the sign-writer, the printer and whoever runs the social account are all working from the same document.",
    ],
    delivered: [
      "Primary logo, secondary lockup and icon mark, with spacing rules",
      "Colour palette — primary, secondary and neutral — with usage guidance",
      "Typography system: pairing, hierarchy and sample text styles",
      "Brand guide covering the above, written to be handed to someone else",
      "Editable source files and export formats, not a single flattened image",
    ],
  },
  {
    slug: "identity-and-website-professional-services",
    discipline: "Identity and website",
    sector: "Professional services",
    services: ["Identity system", "Web design", "Build"],
    summary:
      "Identity and site designed as one system, so the website is not a translation of the brand into a second language.",
    problem:
      "A professional services firm is usually judged on its website before anyone speaks to it, and the website is usually the last thing the identity was designed for. The result is a brand that works on a document and falls apart on a screen: a mark with no small size, a palette with no interface states, type chosen for print with nothing to say about a form field or an error message. The site then gets designed around those gaps, and the two drift apart permanently.",
    approach: [
      "Discovery covers both at once — what the firm does, who decides, and what the site actually has to do. A brochure site and a site that has to generate enquiries are different problems wearing the same clothes.",
      "Research maps the sector's conventions and the firm's real competitors, which are rarely the same list.",
      "Two directions, each shown as a mark and as a page. Judging an identity in the abstract and then discovering how it behaves in a navigation bar is how the drift starts.",
      "Refinement builds the system: not only logo and palette but the interface parts an identity normally forgets — link states, focus rings, form fields, the small type that carries most of the words.",
      "Delivery is a built site and the identity system it came from, handed over together.",
    ],
    delivered: [
      "Identity system: logo suite, colour, typography, and the interface states",
      "Web design across the templates the site actually needs",
      "A built, responsive site",
      "Brand guide covering both the identity and its use on screen",
      "Editable files and a handover walkthrough",
    ],
  },
  {
    slug: "marketing-design-retail",
    discipline: "Marketing design",
    sector: "Retail",
    services: ["Campaign system", "Social", "Print"],
    summary:
      "A campaign system rather than a set of posts, so the twentieth asset is as considered as the first.",
    problem:
      "Retail marketing is made under time pressure and in volume. A campaign is designed properly for its first three assets and then improvised for the next forty, because nobody wrote down how it works. Six weeks in, the sale graphics and the brand look like two companies. The problem is almost never taste — it is that no one was given a system, only examples.",
    approach: [
      "Discovery is about cadence and volume before it is about look: how often you post, who makes the assets, what they use, and how much time they have.",
      "Research looks at what the existing brand already provides and what a campaign has to add. Most campaign systems fail by contradicting the brand rather than extending it.",
      "Two directions, each presented as a rule set with examples rather than as examples alone — a grid, a type scale, a colour role, an image treatment.",
      "Refinement tests the system on the hardest cases: the long product name, the awkward crop, the asset with too much text. A system that only works on the good cases is a mood board.",
      "Delivery is templates the team can actually operate, plus the rules that say when to break them.",
    ],
    delivered: [
      "Campaign system: grid, type scale, colour roles and image treatment",
      "Social templates for the formats you actually publish",
      "Print artwork set up for production",
      "Usage guidance covering the awkward cases, not only the tidy ones",
      "Editable source files in the tools your team uses",
    ],
  },
  {
    slug: "website-design-product",
    discipline: "Website design",
    sector: "Product",
    services: ["Web design", "Build", "Handover"],
    summary:
      "A site for a brand whose rules are already written, designed to extend them rather than reinterpret them.",
    problem:
      "A product company with a working identity usually does not need a rebrand — it needs a site that respects what already exists. The common failure is the opposite: a site that quietly invents a second brand, with its own type scale, its own blues, and its own idea of a button, because the existing rules said nothing about the web. Six months later there are two brands and no one can say which is correct.",
    approach: [
      "Discovery starts with the rules that already exist and finds the gaps rather than the faults. What does the guide say about a disabled state, about a table, about a long headline in a narrow column?",
      "Research covers how the product is actually used and where the site sits in that — the page order most sites get wrong is the one that assumes everyone arrives at the homepage.",
      "Two directions, both built from the existing system. If a direction requires changing the brand, that is said plainly rather than smuggled in.",
      "Refinement resolves the gaps into additions to the system, documented as such, so the next person knows what was extended and why.",
      "Delivery is the built site, the additions written down, and a handover so the team can keep it consistent without asking.",
    ],
    delivered: [
      "Web design across the templates the site needs",
      "A built, responsive site",
      "Documented additions to the existing brand system",
      "Handover session and written notes",
      "Editable design files",
    ],
  },
];

/*
  The invented wordmark wall is gone rather than relabelled.

  It was a grid of six made-up company names presented as a client list, and
  the only thing that made it honest was the caption underneath saying so.
  Every string on this site now has to read as final, which removes the
  caption — and a fake client list without its disclaimer is just a fake
  client list. There is no version of that section that is both finished and
  true, so the page keeps the part that was always true: who the studio works
  with, described rather than illustrated.
*/

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: readonly FaqItem[] = [
  {
    question: "How long does an identity take?",
    answer:
      "Four weeks is typical. Discovery and direction in week one, concepts in week two, refinement and applications in week three, final files and handover in week four.",
  },
  {
    question: "What do I actually receive at the end?",
    answer:
      "Editable files, export formats and usage guidance. For a logo that means the full file set rather than a single PNG.",
  },
  {
    question: "How many directions do I get to choose from?",
    answer:
      "Two. Both are focused, and both come with the reasoning behind them, so the choice is a decision rather than a preference.",
  },
  {
    question: "Do you work with businesses outside the UAE?",
    answer:
      "Yes. The studio works remotely, and the process is built around scheduled calls rather than being in the same room.",
  },
  {
    question: "Can you work with the brand rules we already have?",
    answer:
      "Yes. If the rules exist and hold up, the work extends them, and the additions are documented as additions so the next person knows what changed. If they contradict each other, that comes up in discovery rather than being quietly resolved in one direction.",
  },
  {
    question: "What happens if we do not like either direction?",
    answer:
      "That is a discovery problem rather than a concept problem, so the fix is to go back to it. It has a cost in time rather than in money, and it is better spent than a third direction drawn on the same brief.",
  },
  {
    question: "Do you write the words as well?",
    answer:
      "No. The studio designs the system the words live in — hierarchy, length, where a line breaks — and will tell you when a piece of copy will not fit the design it has been given. Writing it is someone else's job.",
  },
  {
    question: "Who owns the files at the end?",
    answer:
      "You do, including the editable sources. The studio keeps the right to show the work, and will ask before showing anything that has not been published yet.",
  },
];
