import { createContext, useContext, useState, ReactNode } from "react";

export interface Topic {
  id: string;
  name: string;
  completed: boolean;
}

export interface UserSubject {
  id: string;
  name: string;
  icon: string;
  topics: number;
  completed: number;
  examDate: string;
  hoursPerDay: string;
  topicList: Topic[];
}

interface SubjectsContextType {
  subjects: UserSubject[];
  addSubject: (subject: Omit<UserSubject, "id" | "topicList" | "completed" | "topics">) => void;
  removeSubject: (id: string) => void;
  updateSubject: (id: string, updates: Partial<UserSubject>) => void;
  toggleTopic: (subjectId: string, topicId: string) => void;
  xp: number;
  streak: number;
  studyLog: { date: string; minutes: number }[];
  addStudyTime: (minutes: number) => void;
}

const SubjectsContext = createContext<SubjectsContextType | null>(null);

export function useSubjects() {
  const ctx = useContext(SubjectsContext);
  if (!ctx) throw new Error("useSubjects must be used within SubjectsProvider");
  return ctx;
}

const iconOptions = ["📚", "⚡", "📐", "🧪", "🧬", "📖", "💻", "🎨", "🌍", "🔬", "📊", "🎵"];

// Predefined topic lists for common subjects
const subjectTopics: Record<string, string[]> = {
  physics: [
    "Units & Measurements", "Motion in a Straight Line", "Motion in a Plane",
    "Laws of Motion", "Work, Energy & Power", "Rotational Motion",
    "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids",
    "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory of Gases",
    "Oscillations", "Waves", "Electric Charges & Fields",
    "Electrostatic Potential & Capacitance", "Current Electricity", "Magnetic Effects of Current",
    "Magnetism & Matter", "Electromagnetic Induction", "Alternating Current",
    "Electromagnetic Waves", "Ray Optics", "Wave Optics",
    "Dual Nature of Radiation & Matter", "Atoms", "Nuclei", "Semiconductor Electronics",
  ],
  chemistry: [
    "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements",
    "Chemical Bonding & Molecular Structure", "States of Matter", "Thermodynamics",
    "Equilibrium", "Redox Reactions", "Hydrogen", "The s-Block Elements",
    "The p-Block Elements", "Organic Chemistry Basics", "Hydrocarbons",
    "Environmental Chemistry", "Solutions", "Electrochemistry",
    "Chemical Kinetics", "Surface Chemistry", "Coordination Compounds",
    "Haloalkanes & Haloarenes", "Alcohols, Phenols & Ethers", "Aldehydes, Ketones & Carboxylic Acids",
    "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life",
  ],
  mathematics: [
    "Sets", "Relations & Functions", "Trigonometric Functions",
    "Complex Numbers", "Linear Inequalities", "Permutations & Combinations",
    "Binomial Theorem", "Sequences & Series", "Straight Lines",
    "Conic Sections", "Limits & Derivatives", "Statistics",
    "Probability", "Matrices & Determinants", "Continuity & Differentiability",
    "Applications of Derivatives", "Integrals", "Applications of Integrals",
    "Differential Equations", "Vector Algebra", "3D Geometry",
    "Linear Programming",
  ],
  biology: [
    "The Living World", "Biological Classification", "Plant Kingdom",
    "Animal Kingdom", "Morphology of Flowering Plants", "Anatomy of Flowering Plants",
    "Cell: The Unit of Life", "Cell Cycle & Division", "Biomolecules",
    "Transport in Plants", "Mineral Nutrition", "Photosynthesis",
    "Respiration in Plants", "Plant Growth & Development", "Body Fluids & Circulation",
    "Excretory Products", "Locomotion & Movement", "Neural Control",
    "Chemical Coordination", "Reproduction in Organisms", "Sexual Reproduction in Plants",
    "Human Reproduction", "Reproductive Health", "Heredity & Variation",
    "Molecular Basis of Inheritance", "Evolution", "Human Health & Disease",
    "Microbes in Human Welfare", "Biotechnology Principles", "Organisms & Populations",
    "Ecosystem", "Biodiversity & Conservation",
  ],
  english: [
    "Reading Comprehension", "Grammar – Tenses", "Grammar – Articles & Determiners",
    "Grammar – Subject-Verb Agreement", "Grammar – Active & Passive Voice",
    "Grammar – Direct & Indirect Speech", "Vocabulary Building",
    "Essay Writing", "Letter Writing", "Notice & Report Writing",
    "Creative Writing", "Poetry Analysis", "Prose & Fiction Analysis",
    "Drama & Play Analysis", "Comprehension Passages", "Précis Writing",
  ],
  history: [
    "Ancient Civilizations", "Medieval Period", "The Renaissance",
    "The French Revolution", "Industrial Revolution", "World War I",
    "World War II", "Cold War Era", "Indian Freedom Movement",
    "Post-Independence India", "Ancient India – Vedic Period",
    "Mughal Empire", "British Colonial Rule", "Modern World History",
    "Constitutional Development",
  ],
  geography: [
    "The Earth – Origin & Evolution", "Interior of the Earth", "Landforms",
    "Atmosphere – Composition & Structure", "Weather & Climate", "Water Resources",
    "Oceans & Currents", "Natural Vegetation", "Soil Types",
    "Population & Settlement", "Human Development", "Resources & Development",
    "Agriculture", "Industries", "Transport & Communication",
    "Map Reading & Interpretation",
  ],
  economics: [
    "Introduction to Economics", "Consumer Behaviour", "Producer Behaviour",
    "Supply & Demand", "Market Equilibrium", "National Income",
    "Money & Banking", "Government Budget", "Balance of Payments",
    "Indian Economy – Overview", "Poverty & Inequality", "Infrastructure Development",
    "Statistics for Economics", "Index Numbers", "Development Experience of India",
  ],
  "computer science": [
    "Computer Fundamentals", "Data Types & Operators", "Control Structures",
    "Functions & Modules", "Arrays & Strings", "Object-Oriented Programming",
    "File Handling", "Data Structures – Stacks & Queues", "Data Structures – Linked Lists",
    "Sorting Algorithms", "Searching Algorithms", "Database Concepts & SQL",
    "Boolean Algebra", "Networking Basics", "Cyber Security",
    "Python Programming", "Web Development Basics",
  ],
  "political science": [
    "Constitution – Why & How", "Rights in the Indian Constitution",
    "Election & Representation", "Executive & Legislature",
    "Judiciary", "Federalism", "Local Government",
    "Political Parties", "Pressure Groups", "International Relations",
    "United Nations", "India's Foreign Policy", "Citizenship",
    "Secularism", "Philosophy of the Constitution",
  ],
};

function getTopicsForSubject(name: string): Topic[] {
  const key = name.toLowerCase().trim();
  const matched = Object.keys(subjectTopics).find(
    (k) => key.includes(k) || k.includes(key)
  );
  if (matched) {
    return subjectTopics[matched].map((t) => ({
      id: crypto.randomUUID(),
      name: t,
      completed: false,
    }));
  }
  // Generic fallback topics
  const count = 15;
  return Array.from({ length: count }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `${name} – Topic ${i + 1}`,
    completed: false,
  }));
}

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<UserSubject[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [studyLog, setStudyLog] = useState<{ date: string; minutes: number }[]>([]);

  const addSubject = (subject: Omit<UserSubject, "id" | "topicList" | "completed" | "topics">) => {
    const topicList = getTopicsForSubject(subject.name);
    setSubjects((prev) => [
      ...prev,
      {
        ...subject,
        id: crypto.randomUUID(),
        topicList,
        topics: topicList.length,
        completed: 0,
      },
    ]);
  };

  const removeSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSubject = (id: string, updates: Partial<UserSubject>) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const toggleTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        const newTopicList = s.topicList.map((t) =>
          t.id === topicId ? { ...t, completed: !t.completed } : t
        );
        const completed = newTopicList.filter((t) => t.completed).length;
        const wasCompleted = s.topicList.find((t) => t.id === topicId)?.completed;
        if (!wasCompleted) {
          setXp((prev) => prev + 25);
        } else {
          setXp((prev) => Math.max(0, prev - 25));
        }
        return { ...s, topicList: newTopicList, completed };
      })
    );
  };

  const addStudyTime = (minutes: number) => {
    const today = new Date().toISOString().split("T")[0];
    setStudyLog((prev) => {
      const existing = prev.find((l) => l.date === today);
      if (existing) {
        return prev.map((l) => l.date === today ? { ...l, minutes: l.minutes + minutes } : l);
      }
      return [...prev, { date: today, minutes }];
    });
    setXp((prev) => prev + Math.round(minutes * 2));
    // Simple streak logic
    setStreak((prev) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      const hadYesterday = studyLog.some((l) => l.date === yStr);
      const hadToday = studyLog.some((l) => l.date === today);
      if (!hadToday) return prev + 1;
      return prev;
    });
  };

  return (
    <SubjectsContext.Provider
      value={{ subjects, addSubject, removeSubject, updateSubject, toggleTopic, xp, streak, studyLog, addStudyTime }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export { iconOptions };
