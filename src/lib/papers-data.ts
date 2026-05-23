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
    slug: "journalism",
    name: "School of Journalism",
    short: "SOJ",
    description: "Media, communications, and broadcast studies.",
    departments: ["Print Journalism", "Broadcast", "Digital Media", "Public Relations"],
    accent: "from-rose-500/15 to-rose-500/0",
  },
  {
    slug: "ict",
    name: "School of ICT",
    short: "ICT",
    description: "Computer science, software, and information systems.",
    departments: ["Computer Science", "Software Engineering", "Information Systems", "Networking"],
    accent: "from-sky-500/15 to-sky-500/0",
  },
  {
    slug: "business",
    name: "School of Business",
    short: "SBPA",
    description: "Management, accounting, finance, and economics.",
    departments: ["Accounting", "Finance", "Management", "Economics", "Marketing"],
    accent: "from-emerald-500/15 to-emerald-500/0",
  },
  {
    slug: "education",
    name: "School of Education",
    short: "SOE",
    description: "Teaching, curriculum, and educational leadership.",
    departments: ["Primary Education", "Secondary Education", "Curriculum Studies", "Educational Psychology"],
    accent: "from-amber-500/15 to-amber-500/0",
  },
  {
    slug: "law",
    name: "School of Law",
    short: "LAW",
    description: "Legal studies, jurisprudence, and constitutional law.",
    departments: ["Public Law", "Private Law", "International Law", "Commercial Law"],
    accent: "from-violet-500/15 to-violet-500/0",
  },
  {
    slug: "arts-sciences",
    name: "School of Arts and Sciences",
    short: "SAS",
    description: "Humanities, social sciences, and natural sciences.",
    departments: ["English", "History", "Mathematics", "Physics", "Biology", "Chemistry", "Sociology"],
    accent: "from-teal-500/15 to-teal-500/0",
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
  { id: "p3", code: "ACC201", title: "Financial Accounting II", faculty: "business", department: "Accounting", semester: "First", year: 2023, downloads: 1640, addedAt: "2024-11-20", fileUrl: "#" },
  { id: "p4", code: "ECO101", title: "Principles of Microeconomics", faculty: "business", department: "Economics", semester: "First", year: 2024, downloads: 870, addedAt: "2025-03-01", fileUrl: "#" },
  { id: "p5", code: "LAW210", title: "Constitutional Law", faculty: "law", department: "Public Law", semester: "Second", year: 2023, downloads: 540, addedAt: "2024-10-09", fileUrl: "#" },
  { id: "p6", code: "JOU105", title: "Foundations of Journalism", faculty: "journalism", department: "Print Journalism", semester: "First", year: 2024, downloads: 420, addedAt: "2025-01-28", fileUrl: "#" },
  { id: "p7", code: "EDU220", title: "Curriculum Development", faculty: "education", department: "Curriculum Studies", semester: "Second", year: 2024, downloads: 310, addedAt: "2025-02-18", fileUrl: "#" },
  { id: "p8", code: "MAT101", title: "Calculus I", faculty: "arts-sciences", department: "Mathematics", semester: "First", year: 2024, downloads: 1490, addedAt: "2025-03-15", fileUrl: "#" },
  { id: "p9", code: "ENG110", title: "Academic Writing", faculty: "arts-sciences", department: "English", semester: "First", year: 2023, downloads: 760, addedAt: "2024-09-30", fileUrl: "#" },
  { id: "p10", code: "CSC305", title: "Database Systems", faculty: "ict", department: "Information Systems", semester: "Second", year: 2024, downloads: 1120, addedAt: "2025-04-02", fileUrl: "#" },
  { id: "p11", code: "BUS310", title: "Strategic Management", faculty: "business", department: "Management", semester: "First", year: 2023, downloads: 690, addedAt: "2024-12-11", fileUrl: "#" },
  { id: "p12", code: "PHY201", title: "Classical Mechanics", faculty: "arts-sciences", department: "Physics", semester: "Second", year: 2024, downloads: 530, addedAt: "2025-02-22", fileUrl: "#" },
];

export const SEMESTERS = ["First", "Second", "Resit"] as const;
export const YEARS = [2025, 2024, 2023, 2022, 2021, 2020];
