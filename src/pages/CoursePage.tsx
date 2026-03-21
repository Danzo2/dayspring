import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ArrowLeft, Play, CheckCircle2, Circle, Clock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const modules = [
  {
    title: "Module 1: Foundations of Prompt Engineering",
    lessons: [
      { title: "What is Prompt Engineering?", duration: "12 min", completed: true },
      { title: "The Anatomy of a Good Prompt", duration: "18 min", completed: true },
      { title: "Common Pitfalls & Anti-patterns", duration: "15 min", completed: true },
    ],
  },
  {
    title: "Module 2: Advanced Techniques",
    lessons: [
      { title: "Chain-of-Thought Prompting", duration: "22 min", completed: true },
      { title: "Few-Shot Learning Strategies", duration: "20 min", completed: false },
      { title: "System Prompts & Role Setting", duration: "25 min", completed: false },
    ],
  },
  {
    title: "Module 3: Context Engineering",
    lessons: [
      { title: "Managing Context Windows", duration: "18 min", completed: false },
      { title: "RAG Fundamentals", duration: "30 min", completed: false },
      { title: "Prompt Chaining & Pipelines", duration: "28 min", completed: false },
    ],
  },
];

export default function CoursePage() {
  const navigate = useNavigate();
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (s, m) => s + m.lessons.filter((l) => l.completed).length,
    0
  );

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 px-8 py-7 overflow-y-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-sanctuary mb-6 active:scale-[0.97]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>

        <div className="animate-fade-up">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                AI Strategy
              </span>
              <h1 className="text-2xl font-medium text-foreground mt-2">
                Applied Prompt Engineering
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Master the art of crafting effective prompts for large language models.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" strokeWidth={1.8} />
                {totalLessons} lessons
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" strokeWidth={1.8} />
                ~4.5 hours
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1">
              <Progress value={(completedLessons / totalLessons) * 100} className="h-2 bg-muted" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {completedLessons}/{totalLessons} complete
            </span>
          </div>
        </div>

        <div className="space-y-6 animate-fade-up" style={{ animationDelay: "150ms" }}>
          {modules.map((mod) => (
            <div key={mod.title} className="bg-card rounded-xl shadow-card border border-border/30 overflow-hidden">
              <div className="px-5 py-4 border-b border-border/30">
                <h3 className="text-sm font-medium text-foreground">{mod.title}</h3>
              </div>
              <div className="divide-y divide-border/30">
                {mod.lessons.map((lesson) => (
                  <button
                    key={lesson.title}
                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-sanctuary text-left active:scale-[0.99] group"
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0" strokeWidth={1.8} />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 group-hover:text-sage transition-sanctuary" strokeWidth={1.8} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${lesson.completed ? "text-muted-foreground" : "text-foreground"}`}>
                        {lesson.title}
                      </p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{lesson.duration}</span>
                    <Play className="w-4 h-4 text-muted-foreground/40 group-hover:text-sage transition-sanctuary" strokeWidth={1.8} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
