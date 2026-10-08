// Central copy and links so wording stays consistent across screens.
export const AUTHOR = "Mahesh Kontham";
export const EMAIL = "maheshkontham18@gmail.com";
export const ROLE = "Associate Product Manager (APM)";

const subject = "APM opportunity at Ownly · Mahesh Kontham";
const body = [
  "Hi Mahesh,",
  "",
  "I went through your Ownly case study. Let's find 15 minutes to talk about the APM role.",
  "",
  "Best,",
].join("\n");
export const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const STEPS = [
  { path: "/", label: "Intro", short: "1" },
  { path: "/story", label: "The story", short: "2" },
  { path: "/prototype", label: "Try the idea", short: "3" },
  { path: "/case-study", label: "Full case study", short: "4" },
  { path: "/evidence", label: "Evidence & data", short: "5" },
];

export const SOURCES = [
  { name: "Google Play Store · Ownly customer app", detail: "1,000 reviews scraped · 27 Sep – 4 Oct 2026" },
  { name: "Google Play Store · Ownly Captain (rider) app", detail: "376 reviews scraped · 5 Mar – 4 Oct 2026" },
  { name: "Google Play Store · Ownly restaurant partner app", detail: "105 reviews scraped · 14 Nov 2025 – 4 Oct 2026" },
  { name: "Semrush", detail: "Organic research for ownly.food (India, desktop) · exported 5 Oct 2026" },
  { name: "Open sources", detail: "Press coverage (Business Today, Upstox) and Ownly's public website" },
];

export const DOWNLOADS = {
  casePdf: "/downloads/Ownly_PM_Case_Study_Mahesh_Kontham.pdf",
  caseDocx: "/downloads/Ownly_PM_Case_Study_Mahesh_Kontham.docx",
  onePager: "/downloads/Ownly_One_Page_Summary.pdf",
  deck: "/downloads/Ownly_Pitch_Deck.pptx",
};
