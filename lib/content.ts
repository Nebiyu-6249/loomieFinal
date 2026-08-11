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
 * PLACEHOLDER DATA — not real projects.
 *
 * No client names, no testimonials, no metrics, no awards. Each entry
 * describes the kind of work that will occupy the slot, and the UI labels
 * every one of them as reserved. Replace this array wholesale when the
 * founder supplies real projects.
 */
export interface WorkPlaceholder {
  slug: string;
  discipline: string;
  sector: string;
  /** What the slot is reserved for. Never written as if it happened. */
  reservedFor: string;
  scope: readonly string[];
  /** Swap to a real path and the plate composition steps aside. */
  image?: string;
}

export const WORK_PLACEHOLDERS: readonly WorkPlaceholder[] = [
  {
    slug: "identity-slot-01",
    discipline: "Brand identity",
    sector: "Hospitality",
    reservedFor:
      "A full identity build — mark, type, colour and the rules that hold them together.",
    scope: ["Logo design", "Web brand identity"],
  },
  {
    slug: "identity-slot-02",
    discipline: "Identity and website",
    sector: "Product",
    reservedFor:
      "An identity carried through to a working site, so the two are designed as one system.",
    scope: ["Logo design", "Web brand identity", "Website design"],
  },
  {
    slug: "campaign-slot-03",
    discipline: "Marketing design",
    sector: "Retail",
    reservedFor:
      "A campaign built from an existing system, tested across a full run of social assets.",
    scope: ["Marketing design"],
  },
  {
    slug: "website-slot-04",
    discipline: "Website design",
    sector: "Professional services",
    reservedFor:
      "A site designed for a brand that already has its rules written down.",
    scope: ["Website design"],
  },
];

/**
 * PLACEHOLDER DATA — invented names, drawn as wordmarks in the site's own
 * type. None of these are real companies, and no real company's mark appears
 * anywhere on this site.
 */
export const PLACEHOLDER_WORDMARKS: readonly string[] = [
  "NORTHBOUND",
  "Saltgrove",
  "MERIDIAN CO.",
  "Fieldnote",
  "ATLAS & CO",
  "Quarry",
];

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
      "Yes. If the rules exist and hold up, the work extends them. If they contradict each other, that comes up in discovery.",
  },
];
