// Content taken from Mahesh Kontham's resume. Edit here; the About page renders from this.
export const PROFILE = {
  name: "Mahesh Kontham",
  headline: "Product-minded builder · Growth Associate Intern at NxtWave",
  phone: "9398377986",
  email: "maheshkontham18@gmail.com",
  linkedin: "https://www.linkedin.com/in/mahesh-kontham",
  linkedinLabel: "linkedin.com/in/mahesh-kontham",
  summary:
    "Computer Science graduate and Growth Associate Intern with hands-on experience taking products from user research and problem discovery to MVP development, testing, and iteration. I combine technical execution across React, Next.js, Node.js and Supabase with product thinking, user research, growth, and early-stage business experimentation.",
  rotating: ["user research", "problem discovery", "shipping MVPs", "growth experiments", "go-to-market"],
};

export const HIGHLIGHTS = [
  { value: 15, suffix: "", label: "student presidents interviewed to shape a product bet" },
  { value: 200, suffix: "", label: "tenant records running on an app I built end-to-end" },
  { value: 4, suffix: "", label: "roles across growth, product, GTM and marketing" },
  { value: 8.3, suffix: "", label: "CGPA in B.Tech Computer Science", decimals: 1 },
];

export type Role = {
  id: string;
  title: string;
  company: string;
  dates: string;
  location: string;
  current?: boolean;
  gist: string;
  metrics: string[];
  tags: string[];
  points: { lead: string; text: string }[];
};

export const EXPERIENCE: Role[] = [
  {
    id: "nxtwave",
    title: "Growth Associate Intern",
    company: "NxtWave",
    dates: "Jul 2026 – Present",
    location: "Hyderabad, Telangana",
    current: true,
    gist: "Driving product growth for NIAT Insider, from research to a shipped Q&A MVP.",
    metrics: ["15 presidents interviewed", "15-student pilot", "7 teams worked with"],
    tags: ["Product discovery", "MVP", "UX", "SEO", "AI-assisted"],
    points: [
      { lead: "Owned growth gaps.", text: "Drove product growth and development for NIAT Insider, identifying user, engagement, UX, and discoverability gaps and proposing and executing improvements across onboarding, product experience, and feature development with manager oversight." },
      { lead: "Research-led prioritisation.", text: "Interviewed 15 NIAT student presidents to understand adoption barriers and cross-campus needs; used the research to prioritise a Q&A experience over a broader student-networking concept, balancing engagement potential with search/discovery value." },
      { lead: "Shipped the MVP.", text: "Designed and shipped a Q&A MVP covering student answer submission, admin moderation, SEO review, approval, and publishing; piloted the workflow with 15 students to test cross-campus knowledge sharing and engagement." },
      { lead: "AI as a multiplier.", text: "Combined ChatGPT/LLMs with research, debugging, implementation, documentation, and rapid prototyping to learn unfamiliar problems quickly and turn insights into shipped solutions." },
      { lead: "Redesigned key surfaces.", text: "Used Figma/Stitch and user feedback to improve information architecture and the student discovery experience; worked cross-functionally with Product, Engineering, CRM, Content, Branding, SEO, and Operations teams to execute changes." },
    ],
  },
  {
    id: "obzient",
    title: "Founding Team Member",
    company: "Obzient",
    dates: "Nov 2025 – Jan 2026",
    location: "Hyderabad, Telangana",
    gist: "Turned a broker's Excel workflow into a tenant-management app used for real.",
    metrics: ["~200 tenant records", "Built end-to-end", "Validated with 3 users"],
    tags: ["Requirements", "Full-stack", "Workflow design"],
    points: [
      { lead: "Found the real problem.", text: "Identified operational gaps in a real-estate broker's Excel-based workflow, including fragmented tenant records, manual payment follow-ups, and dependence on sales staff to resolve tenant issues; translated these into requirements for a centralised application." },
      { lead: "Built it end-to-end.", text: "Designed and developed the application, implementing tenant data management, monthly payment notifications, and issue-management workflows; approximately 200 tenant records were added for real-world use." },
      { lead: "Changed the workflow.", text: "Moved tenant support from sales-mediated communication to direct ticket raising; validated the workflow with the broker and 2 sales representatives and iterated based on feedback." },
    ],
  },
  {
    id: "influencehut",
    title: "Founder's Office — GTM & Growth Advisor",
    company: "InfluenceHut",
    dates: "2024",
    location: "Hyderabad",
    gist: "Shaped positioning and an agency model for regional influencer campaigns.",
    metrics: ["Brand positioning", "GTM strategy", "Regional market gap"],
    tags: ["GTM", "Market research", "Strategy"],
    points: [
      { lead: "Advised the founder.", text: "Advised on brand positioning and go-to-market strategy for influencer campaigns; contributed to key early-stage decisions through data-backed audience targeting insights." },
      { lead: "Spotted a gap.", text: "Researched Telugu influencers and identified a gap between regional creators and companies seeking targeted promotions; contributed to an agency model matching brands with influencers by niche, audience, and campaign requirements." },
    ],
  },
  {
    id: "hashpro",
    title: "Digital Marketing Intern",
    company: "HashPro Academy",
    dates: "Nov 2023 – Jun 2024",
    location: "Hyderabad",
    gist: "Researched student behaviour and worked directly with learners at bootcamps.",
    metrics: ["Retention & pricing research", "Bootcamp engagement"],
    tags: ["User research", "Marketing", "Engagement"],
    points: [
      { lead: "Research.", text: "Conducted research on student behaviour, retention, pricing, and potential office locations, while contributing ideas for content, marketing strategies, and student engagement." },
      { lead: "Close to users.", text: "Interacted directly with students during bootcamps, gathering observations and communicating course value to support engagement and retention." },
    ],
  },
];

export const PROJECTS = [
  {
    name: "Attendance Management System",
    stack: ["React", "Supabase", "PostgreSQL", "TypeScript"],
    problem: "Hardware and fingerprint attendance systems add friction for work-from-office teams.",
    points: [
      "Built an MVP that verifies attendance through location and IP, with a 50-metre office geofence.",
      "Piloted with 2 users, gathered feedback from real usage, and iterated on the attendance and verification flow.",
    ],
    stat: { value: "50 m", label: "geofence" },
  },
  {
    name: "Employee Management System",
    stack: ["Spring Boot", "MySQL", "REST APIs", "Maven"],
    problem: "A clean, layered back-end for managing employee records.",
    points: [
      "Developed a RESTful application with full CRUD using a Controller–Service–Repository layered architecture.",
      "Tested every API with Postman.",
    ],
    stat: { value: "CRUD", label: "REST API" },
  },
];

export const SKILLS = {
  "Product & Business": ["Product Discovery", "Problem Definition", "MVP Development", "Feature Prioritization", "User Feedback", "Product Analytics", "Growth Experiments", "GTM"],
  "Technology & AI": ["React", "Node.js", "REST APIs", "Supabase", "PostgreSQL", "Java", "AI-assisted Development", "SQL", "Authentication"],
} as const;

export const EDUCATION = [
  { school: "Keshav Memorial Institute of Technology", degree: "B.Tech in Computer Science Engineering", dates: "2023 – 2026", location: "Hyderabad, Telangana", cgpa: 8.3 },
  { school: "Indure Institute of Engineering and Technology", degree: "Diploma in Computer Science Engineering", dates: "2020 – 2023", location: "Siddipet, Telangana", cgpa: 8.3 },
];

export const RECOGNITION = [
  { title: "Art of Influence Program — Evolving Enthusiast Recognition", year: "2024", text: "Recognised for participation and demonstrated communication, leadership, critical-thinking, and structured problem-solving skills." },
  { title: "Deloitte Australia — Data Analytics Job Simulation", year: "Forage", text: "Completed Deloitte's data analytics job simulation on Forage." },
];
