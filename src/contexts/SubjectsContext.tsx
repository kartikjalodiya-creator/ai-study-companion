import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

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
  loading: boolean;
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

function getTopicNamesForSubject(name: string): string[] {
  const key = name.toLowerCase().trim();
  const matched = Object.keys(subjectTopics).find(
    (k) => key.includes(k) || k.includes(key)
  );
  if (matched) return subjectTopics[matched];
  return Array.from({ length: 15 }, (_, i) => `${name} – Topic ${i + 1}`);
}

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<UserSubject[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [studyLog, setStudyLog] = useState<{ date: string; minutes: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from DB when user changes
  const loadData = useCallback(async () => {
    if (!user) {
      setSubjects([]);
      setXp(0);
      setStreak(0);
      setStudyLog([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Load subjects + topics
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", user.id);

      const { data: topicsData } = await supabase
        .from("topics")
        .select("*")
        .eq("user_id", user.id);

      if (subjectsData) {
        const mapped: UserSubject[] = subjectsData.map((s: any) => {
          const topicList = (topicsData || [])
            .filter((t: any) => t.subject_id === s.id)
            .map((t: any) => ({ id: t.id, name: t.name, completed: t.completed }));
          return {
            id: s.id,
            name: s.name,
            icon: s.icon,
            examDate: s.exam_date,
            hoursPerDay: s.hours_per_day,
            topics: topicList.length,
            completed: topicList.filter((t: Topic) => t.completed).length,
            topicList,
          };
        });
        setSubjects(mapped);
      }

      // Load XP
      const { data: xpData } = await supabase
        .from("xp_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (xpData) {
        setXp(xpData.xp);
        setStreak(xpData.streak);
      }

      // Load study log
      const { data: logData } = await supabase
        .from("study_log")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(90);
      if (logData) {
        setStudyLog(logData.map((l: any) => ({ date: l.date, minutes: l.minutes })));
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addSubject = async (subject: Omit<UserSubject, "id" | "topicList" | "completed" | "topics">) => {
    if (!user) return;
    const topicNames = getTopicNamesForSubject(subject.name);

    const { data: newSubject, error } = await supabase
      .from("subjects")
      .insert({
        user_id: user.id,
        name: subject.name,
        icon: subject.icon,
        exam_date: subject.examDate,
        hours_per_day: subject.hoursPerDay,
      })
      .select()
      .single();

    if (error || !newSubject) {
      console.error("Failed to add subject:", error);
      return;
    }

    const topicRows = topicNames.map((name) => ({
      subject_id: newSubject.id,
      user_id: user.id,
      name,
      completed: false,
    }));

    const { data: newTopics } = await supabase
      .from("topics")
      .insert(topicRows)
      .select();

    const topicList = (newTopics || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      completed: t.completed,
    }));

    setSubjects((prev) => [
      ...prev,
      {
        id: newSubject.id,
        name: newSubject.name,
        icon: newSubject.icon,
        examDate: newSubject.exam_date,
        hoursPerDay: newSubject.hours_per_day,
        topics: topicList.length,
        completed: 0,
        topicList,
      },
    ]);
  };

  const removeSubject = async (id: string) => {
    if (!user) return;
    await supabase.from("subjects").delete().eq("id", id).eq("user_id", user.id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSubject = async (id: string, updates: Partial<UserSubject>) => {
    if (!user) return;
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
    if (updates.examDate !== undefined) dbUpdates.exam_date = updates.examDate;
    if (updates.hoursPerDay !== undefined) dbUpdates.hours_per_day = updates.hoursPerDay;

    if (Object.keys(dbUpdates).length > 0) {
      await supabase.from("subjects").update(dbUpdates).eq("id", id).eq("user_id", user.id);
    }
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const toggleTopic = async (subjectId: string, topicId: string) => {
    if (!user) return;
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;
    const topic = subject.topicList.find((t) => t.id === topicId);
    if (!topic) return;

    const newCompleted = !topic.completed;
    await supabase
      .from("topics")
      .update({ completed: newCompleted })
      .eq("id", topicId)
      .eq("user_id", user.id);

    const xpDelta = newCompleted ? 25 : -25;
    const newXp = Math.max(0, xp + xpDelta);
    setXp(newXp);
    await supabase
      .from("xp_progress")
      .update({ xp: newXp })
      .eq("user_id", user.id);

    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        const newTopicList = s.topicList.map((t) =>
          t.id === topicId ? { ...t, completed: newCompleted } : t
        );
        return {
          ...s,
          topicList: newTopicList,
          completed: newTopicList.filter((t) => t.completed).length,
        };
      })
    );
  };

  const addStudyTime = async (minutes: number) => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];

    // Upsert study log
    const existing = studyLog.find((l) => l.date === today);
    if (existing) {
      await supabase
        .from("study_log")
        .update({ minutes: existing.minutes + minutes })
        .eq("user_id", user.id)
        .eq("date", today);
      setStudyLog((prev) =>
        prev.map((l) => (l.date === today ? { ...l, minutes: l.minutes + minutes } : l))
      );
    } else {
      await supabase
        .from("study_log")
        .insert({ user_id: user.id, date: today, minutes });
      setStudyLog((prev) => [{ date: today, minutes }, ...prev]);
    }

    // Update XP
    const newXp = xp + Math.round(minutes * 2);
    setXp(newXp);

    // Simple streak logic
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split("T")[0];
    const hadYesterday = studyLog.some((l) => l.date === yStr);
    const hadToday = studyLog.some((l) => l.date === today);
    let newStreak = streak;
    if (!hadToday) newStreak = streak + 1;

    setStreak(newStreak);
    await supabase
      .from("xp_progress")
      .update({ xp: newXp, streak: newStreak })
      .eq("user_id", user.id);
  };

  return (
    <SubjectsContext.Provider
      value={{ subjects, addSubject, removeSubject, updateSubject, toggleTopic, xp, streak, studyLog, addStudyTime, loading }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export { iconOptions };
