import { createContext, useContext, useState, ReactNode } from "react";

export interface UserSubject {
  id: string;
  name: string;
  icon: string;
  topics: number;
  completed: number;
  examDate: string;
  hoursPerDay: string;
}

interface SubjectsContextType {
  subjects: UserSubject[];
  addSubject: (subject: Omit<UserSubject, "id">) => void;
  removeSubject: (id: string) => void;
  updateSubject: (id: string, updates: Partial<UserSubject>) => void;
}

const SubjectsContext = createContext<SubjectsContextType | null>(null);

export function useSubjects() {
  const ctx = useContext(SubjectsContext);
  if (!ctx) throw new Error("useSubjects must be used within SubjectsProvider");
  return ctx;
}

const iconOptions = ["📚", "⚡", "📐", "🧪", "🧬", "📖", "💻", "🎨", "🌍", "🔬", "📊", "🎵"];

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<UserSubject[]>([]);

  const addSubject = (subject: Omit<UserSubject, "id">) => {
    setSubjects((prev) => [...prev, { ...subject, id: crypto.randomUUID() }]);
  };

  const removeSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSubject = (id: string, updates: Partial<UserSubject>) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  return (
    <SubjectsContext.Provider value={{ subjects, addSubject, removeSubject, updateSubject }}>
      {children}
    </SubjectsContext.Provider>
  );
}

export { iconOptions };
