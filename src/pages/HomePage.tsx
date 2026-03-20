import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { Sparkles, Brain, Calendar, BarChart3, Trophy, Zap, ArrowRight, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: Brain, title: "AI Concept Explainer", desc: "Get instant, clear explanations for any topic in multiple difficulty levels." },
  { icon: Calendar, title: "Smart Study Planner", desc: "AI creates a personalized daily plan based on your exam schedule and pace." },
  { icon: BarChart3, title: "Performance Analytics", desc: "Track progress, identify weak areas, and predict exam scores with AI." },
  { icon: Trophy, title: "Gamified Learning", desc: "Earn XP, badges, and compete with friends to stay motivated." },
  { icon: Zap, title: "Focus Mode", desc: "Pomodoro timer with ambient sounds for distraction-free study sessions." },
  { icon: MessageSquare, title: "AI Chat Assistant", desc: "Ask questions anytime and get personalized tutoring from your AI buddy." },
];

const testimonials = [
  { name: "Sarah K.", role: "12th Grade Student", text: "StudyBuddy helped me improve my exam scores by 40%. The AI planner is a game changer!", rating: 5 },
  { name: "Alex M.", role: "College Freshman", text: "The focus mode and gamification kept me studying consistently for the first time ever.", rating: 5 },
  { name: "Priya R.", role: "Medical Student", text: "AI explanations break down complex biology topics so well. Highly recommend!", rating: 5 },
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16">
      {/* Hero */}
      <section className="relative text-center pt-12 md:pt-20">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            Powered by Advanced AI
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Your Personal AI Teacher,{" "}
            <span className="gradient-text">Anytime Anywhere</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Plan smarter, learn faster, and track your success with AI. The ultimate study companion for students who want to excel.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="hero" size="lg" className="text-base px-8">
                Start Learning <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Link to="/assistant">
              <Button variant="hero-outline" size="lg" className="text-base px-8">
                Try Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "3s" }} />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            Everything You Need to <span className="gradient-text">Ace Your Exams</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Powerful AI tools designed specifically for students preparing for exams.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <GlassCard key={f.title} delay={i * 0.1} className="group hover:border-primary/30 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            Loved by <span className="gradient-text">Students</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <GlassCard key={t.name} delay={i * 0.15}>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-xp text-xp" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 mb-4 italic">"{t.text}"</p>
              <div>
                <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto text-center">
        <GlassCard className="gradient-border py-12">
          <h2 className="text-3xl font-display font-bold mb-4 text-foreground">Ready to Transform Your Study Routine?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of students already acing their exams with AI Study Buddy.</p>
          <Link to="/dashboard">
            <Button variant="hero" size="lg" className="text-base px-10">
              Get Started Free <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
