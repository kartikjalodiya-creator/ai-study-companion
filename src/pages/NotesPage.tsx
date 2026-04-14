import { useState, useRef } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Youtube, Sparkles, BookOpen, CreditCard, List, Loader2, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface Flashcard {
  q: string;
  a: string;
}

interface GeneratedContent {
  notes: string[];
  flashcards: Flashcard[];
  summary: string[];
}

export default function NotesPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const toggleFlip = (i: number) => {
    const next = new Set(flippedCards);
    if (next.has(i)) next.delete(i); else next.add(i);
    setFlippedCards(next);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF file.", variant: "destructive" });
    }
  };

  const extractPdfText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(" ");
      text += pageText + "\n\n";
    }
    return text.slice(0, 15000);
  };

  const handleGenerate = async () => {
    if (!pdfFile && !url.trim()) {
      toast({ title: "No input", description: "Please upload a PDF or paste a URL.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setContent(null);
    setFlippedCards(new Set());

    try {
      let textContent = "";
      let sourceType = "url";

      if (pdfFile) {
        sourceType = "pdf";
        textContent = await extractPdfText(pdfFile);
        if (textContent.trim().length < 50) {
          toast({ title: "Could not extract text", description: "The PDF might be scanned/image-based. Try a text-based PDF.", variant: "destructive" });
          setLoading(false);
          return;
        }
      } else {
        textContent = `Please analyze and generate study materials from this URL: ${url.trim()}. Extract the main educational content and concepts from it.`;
      }

      const { data, error } = await supabase.functions.invoke("generate-notes", {
        body: { content: textContent, sourceType },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setContent({
        notes: data.notes || [],
        flashcards: data.flashcards || [],
        summary: data.summary || [],
      });

      toast({ title: "Notes generated!", description: "Your study materials are ready." });
    } catch (err: any) {
      console.error("Generation error:", err);
      toast({ title: "Generation failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <FileText className="w-7 h-7 text-primary" /> Notes & Summary Tool
        </h1>
        <p className="text-muted-foreground mt-1">Upload PDFs or paste YouTube links to generate smart notes with AI.</p>
      </motion.div>

      <GlassCard delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 border border-dashed border-border rounded-xl text-center hover:border-primary/40 transition-colors cursor-pointer"
          >
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
            {pdfFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-10 h-10 text-primary mx-auto" />
                <p className="font-display font-semibold text-foreground text-sm">{pdfFile.name}</p>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}>
                  <X className="w-3 h-3 mr-1" /> Remove
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-display font-semibold text-foreground text-sm">Upload PDF</p>
                <p className="text-xs text-muted-foreground mt-1">Click to browse</p>
              </>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-destructive shrink-0" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube or any URL..."
                className="bg-muted/30 border-border"
                disabled={!!pdfFile}
              />
            </div>
            <Button variant="hero" className="w-full" onClick={handleGenerate} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {loading ? "Generating..." : "Generate Notes"}
            </Button>
          </div>
        </div>
      </GlassCard>

      {content && (
        <GlassCard delay={0.2}>
          <Tabs defaultValue="notes">
            <TabsList className="bg-muted/30 mb-4">
              <TabsTrigger value="notes" className="data-[state=active]:bg-primary/20 gap-1"><BookOpen className="w-4 h-4" /> Notes ({content.notes.length})</TabsTrigger>
              <TabsTrigger value="flashcards" className="data-[state=active]:bg-primary/20 gap-1"><CreditCard className="w-4 h-4" /> Flashcards ({content.flashcards.length})</TabsTrigger>
              <TabsTrigger value="summary" className="data-[state=active]:bg-primary/20 gap-1"><List className="w-4 h-4" /> Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-3">
              {content.notes.map((note, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/20 text-sm text-foreground/80 whitespace-pre-wrap">{note}</div>
              ))}
            </TabsContent>

            <TabsContent value="flashcards">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {content.flashcards.map((card, i) => (
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
                  {content.summary.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </GlassCard>
      )}
    </div>
  );
}
