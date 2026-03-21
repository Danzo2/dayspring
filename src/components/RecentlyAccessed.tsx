import { FileText, PlayCircle, HelpCircle, BookOpen } from "lucide-react";

const items = [
  {
    icon: FileText,
    iconColor: "text-terracotta",
    title: "Prompt Patterns Cheatsheet.pdf",
    subtitle: "Advanced Prompt Engineering • Module 3",
  },
  {
    icon: PlayCircle,
    iconColor: "text-sage",
    title: "Introduction to Chain-of-Thought",
    subtitle: "Context Window Mastery • Module 2",
  },
  {
    icon: HelpCircle,
    iconColor: "text-terracotta",
    title: "Evaluation Frameworks Quiz",
    subtitle: "Evaluation Frameworks • Module 1",
  },
  {
    icon: BookOpen,
    iconColor: "text-sage",
    title: "Research Methodology Guide",
    subtitle: "UX Research Methods • Module 4",
  },
];

export function RecentlyAccessed() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/30">
      <h3 className="text-sm font-medium text-foreground mb-3">Recently Accessed</h3>
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.title}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-sanctuary text-left active:scale-[0.98] group"
          >
            <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0">
              <item.icon className={`w-4 h-4 ${item.iconColor}`} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-sage-hover transition-sanctuary">
                {item.title}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{item.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
