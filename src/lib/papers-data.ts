export type Faculty = {
  slug: string;
  name: string;
  short: string;
  description: string;
  departments: string[];
  accent: string;
};

export const FACULTIES: Faculty[] = [
  {
    slug: "agriculture",
    name: "School of Agriculture & Environmental Sciences",
    short: "SAES",
    description: "Agriculture, environmental, soil, and crop sciences.",
    departments: ["Agriculture", "Environmental Sciences", "Soil Science", "Crop Science", "Food Science & Technology"],
    accent: "from-emerald-500/15 to-emerald-500/0",
  },
  {
    slug: "arts-sciences",
    name: "School of Arts & Sciences",
    short: "SAS",
    description: "Humanities, social sciences, and natural sciences.",
    departments: [
      "Development Studies", "English", "French", "Gender Studies", "Geography",
      "History", "Islamic Studies", "Christian Studies", "Political Science",
      "Psychology", "Sociology", "Mathematics", "Biology", "Chemistry", "Physics",
    ],
    accent: "from-teal-500/15 to-teal-500/0",
  },
  {
    slug: "engineering",
    name: "School of Engineering & Architecture",
    short: "SEA",
    description: "Community building, design, and engineering disciplines.",
    departments: ["Community Building & Design", "Civil Engineering", "Architecture"],
    accent: "from-orange-500/15 to-orange-500/0",
  },
  {
    slug: "education",
    name: "School of Education",
    short: "SOE",
    description: "Teacher training across the core academic subjects.",
    departments: [
      "Agriculture Ed.", "Mathematics Ed.", "Physics Ed.", "English Language Ed.",
      "Geography Ed.", "History Ed.", "Arabic Ed.", "French Ed.",
      "Biology Ed.", "Chemistry Ed.", "Economics Ed.",
    ],
    accent: "from-amber-500/15 to-amber-500/0",
  },
  {
    slug: "journalism",
    name: "School of Journalism & Digital Media",
    short: "SJDM",
    description: "Print, broadcast, and digital media studies.",
    departments: ["Journalism (BA)", "Journalism (BSc)", "Digital Media", "Broadcast"],
    accent: "from-rose-500/15 to-rose-500/0",
  },
  {
    slug: "business",
    name: "School of Business & Public Administration",
    short: "SBPA",
    description: "Management, finance, economics, and public administration.",
    departments: [
      "Public Administration", "Economics", "Management", "Accountancy",
      "Banking & Finance", "Marketing", "Tourism & Hospitality Management",
    ],
    accent: "from-sky-500/15 to-sky-500/0",
  },
  {
    slug: "ict",
    name: "School of Information & Communications Technology",
    short: "SICT",
    description: "Computer science and information systems.",
    departments: ["Computer Science", "Information Systems"],
    accent: "from-indigo-500/15 to-indigo-500/0",
  },
  {
    slug: "medicine",
    name: "School of Medicine & Allied Health Sciences",
    short: "SMAHS",
    description: "Medicine, nursing, and public/environmental health.",
    departments: ["Medicine (MB ChB)", "Nursing & Reproductive Health", "Public & Environmental Health"],
    accent: "from-red-500/15 to-red-500/0",
  },
  {
    slug: "law",
    name: "School of Law",
    short: "LAW",
    description: "Undergraduate and postgraduate legal studies.",
    departments: ["LLB", "LLM"],
    accent: "from-violet-500/15 to-violet-500/0",
  },
];

export type Paper = {
  id: string;
  code: string;
  title: string;
  faculty: string; // slug
  department: string;
  semester: "First" | "Second" | "Resit";
  year: number;
  downloads: number;
  addedAt: string; // ISO
  fileUrl: string;
};

export const PAPERS: Paper[] = [
  { id: "p1", code: "CSC101", title: "Introduction to Computer Science", faculty: "ict", department: "Computer Science", semester: "First", year: 2024, downloads: 1280, addedAt: "2025-01-12", fileUrl: "#" },
  { id: "p2", code: "CSC202", title: "Data Structures & Algorithms", faculty: "ict", department: "Computer Science", semester: "Second", year: 2024, downloads: 980, addedAt: "2025-02-04", fileUrl: "#" },
  { id: "p3", code: "ACC201", title: "Financial Accounting II", faculty: "business", department: "Accountancy", semester: "First", year: 2023, downloads: 1640, addedAt: "2024-11-20", fileUrl: "#" },
  { id: "p4", code: "ECO101", title: "Principles of Microeconomics", faculty: "business", department: "Economics", semester: "First", year: 2024, downloads: 870, addedAt: "2025-03-01", fileUrl: "#" },
  { id: "p5", code: "LAW210", title: "Constitutional Law", faculty: "law", department: "LLB", semester: "Second", year: 2023, downloads: 540, addedAt: "2024-10-09", fileUrl: "#" },
  { id: "p6", code: "JOU105", title: "Foundations of Journalism", faculty: "journalism", department: "Journalism (BA)", semester: "First", year: 2024, downloads: 420, addedAt: "2025-01-28", fileUrl: "#" },
  { id: "p7", code: "EDU220", title: "Curriculum Development", faculty: "education", department: "English Language Ed.", semester: "Second", year: 2024, downloads: 310, addedAt: "2025-02-18", fileUrl: "#" },
  { id: "p8", code: "MAT101", title: "Calculus I", faculty: "arts-sciences", department: "Mathematics", semester: "First", year: 2024, downloads: 1490, addedAt: "2025-03-15", fileUrl: "#" },
  { id: "p9", code: "ENG110", title: "Academic Writing", faculty: "arts-sciences", department: "English", semester: "First", year: 2023, downloads: 760, addedAt: "2024-09-30", fileUrl: "#" },
  { id: "p10", code: "INS305", title: "Database Systems", faculty: "ict", department: "Information Systems", semester: "Second", year: 2024, downloads: 1120, addedAt: "2025-04-02", fileUrl: "#" },
  { id: "p11", code: "MGT310", title: "Strategic Management", faculty: "business", department: "Management", semester: "First", year: 2023, downloads: 690, addedAt: "2024-12-11", fileUrl: "#" },
  { id: "p12", code: "PHY201", title: "Classical Mechanics", faculty: "arts-sciences", department: "Physics", semester: "Second", year: 2024, downloads: 530, addedAt: "2025-02-22", fileUrl: "#" },
  { id: "p13", code: "AGR110", title: "Introduction to Agriculture", faculty: "agriculture", department: "Agriculture", semester: "First", year: 2024, downloads: 280, addedAt: "2025-01-20", fileUrl: "#" },
  { id: "p14", code: "ENV205", title: "Environmental Impact Assessment", faculty: "agriculture", department: "Environmental Sciences", semester: "Second", year: 2023, downloads: 340, addedAt: "2024-12-02", fileUrl: "#" },
  { id: "p15", code: "MED201", title: "Human Anatomy I", faculty: "medicine", department: "Medicine (MB ChB)", semester: "First", year: 2024, downloads: 1820, addedAt: "2025-02-10", fileUrl: "#" },
  { id: "p16", code: "NUR110", title: "Foundations of Nursing", faculty: "medicine", department: "Nursing & Reproductive Health", semester: "First", year: 2024, downloads: 720, addedAt: "2025-01-30", fileUrl: "#" },
  { id: "p17", code: "ARC101", title: "Architectural Design Studio I", faculty: "engineering", department: "Architecture", semester: "First", year: 2024, downloads: 260, addedAt: "2025-03-08", fileUrl: "#" },
  { id: "p18", code: "PAD210", title: "Public Sector Management", faculty: "business", department: "Public Administration", semester: "Second", year: 2024, downloads: 410, addedAt: "2025-04-12", fileUrl: "#" },
];

export const SEMESTERS = ["First", "Second", "Resit"] as const;
export const YEARS = [2025, 2024, 2023, 2022, 2021, 2020];
