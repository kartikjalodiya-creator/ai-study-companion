import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Youtube, Sparkles, BookOpen, CreditCard, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const sampleNotes = [
  "**Newton's Laws of Motion**\n\n1. **First Law (Inertia):** An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n2. **Second Law:** F = ma. Force equals mass times acceleration.\n\n3. **Third Law:** For every action, there is an equal and opposite reaction.",
];

const sampleFlashcards = [
  { q: "What is Newton's First Law?", a: "An object at rest stays at rest unless acted upon by an external force." },
  { q: "What is the formula for Force?", a: "F = ma (Force = mass × acceleration)" },
  { q: "What does the Third Law state?", a: "For every action, there is an equal and opposite reaction." },
];

export default function NotesPage() {
  const [url, setUrl] = useState("");
  const [generated, setGenerated] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const toggleFlip = (i: number) => {
    const next = new Set(flippedCards);
    if (next.has(i)) next.delete(i); else next.add(i);
    setFlippedCards(next);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <FileText className="w-7 h-7 text-primary" /> Notes & Summary Tool
        </h1>
        <p className="text-muted-foreground mt-1">Upload PDFs or paste YouTube links to generate smart notes.</p>
      </motion.div>

      <GlassCard delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border border-dashed border-border rounded-xl text-center hover:border-primary/40 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-display font-semibold text-foreground text-sm">Upload PDF</p>
            <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to browse</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-destructive shrink-0" />
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste YouTube URL..." className="bg-muted/30 border-border" />
            </div>
            <Button variant="hero" className="w-full" onClick={() => setGenerated(true)}>
              <Sparkles className="w-4 h-4 mr-2" /> Generate Notes
            </Button>
          </div>
        </div>
      </GlassCard>

      {generated && (
        <GlassCard delay={0.2}>
          <Tabs defaultValue="notes">
            <TabsList className="bg-muted/30 mb-4">
              <TabsTrigger value="notes" className="data-[state=active]:bg-primary/20 gap-1"><BookOpen className="w-4 h-4" /> Notes</TabsTrigger>
              <TabsTrigger value="flashcards" className="data-[state=active]:bg-primary/20 gap-1"><CreditCard className="w-4 h-4" /> Flashcards</TabsTrigger>
              <TabsTrigger value="summary" className="data-[state=active]:bg-primary/20 gap-1"><List className="w-4 h-4" /> Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-3">
              {sampleNotes.map((note, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/20 text-sm text-foreground/80 whitespace-pre-wrap">{note}</div>
              ))}
            </TabsContent>

            <TabsContent value="flashcards">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {sampleFlashcards.map((card, i) => (
                  <motion.div key={i} onClick={() => toggleFlip(i)}
                    className="p-4 rounded-xl bg-muted/20 border border-border cursor-pointer min-h-[120px] flex items-center justify-center text-center hover:border-primary/30 transition-colors">
                    <p className="text-sm text-foreground">
                      {flippedCards.has(i) ? <span className="text-success">{card.a}</span> : card.q}
                    </p>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">Click cards to flip</p>
            </TabsContent>

            <TabsContent value="summary">
              <div className="p-4 rounded-lg bg-muted/20 text-sm text-foreground/80">
                <p className="font-display font-semibold mb-2 text-foreground">Key Takeaways:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Newton's three laws form the foundation of classical mechanics</li>
                  <li>F = ma is the most commonly used equation in physics problems</li>
                  <li>Action-reaction pairs always act on different objects</li>
                  <li>Inertia explains why seatbelts are necessary in vehicles</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </GlassCard>
      )}
    </div>
  );
}
