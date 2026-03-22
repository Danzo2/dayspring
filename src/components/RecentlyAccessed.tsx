import { FileText, PlayCircle, HelpCircle, BookOpen } from "lucide-react";
import { useRecentlyAccessed } from "@/hooks/useDashboardData";
import { type LucideIcon } from "lucide-react";

const contentTypeIcons: Record<string, { icon: LucideIcon; color: string }> = {
  external_url: { icon: PlayCircle, color: "text-sage" },
  video: { icon: PlayCircle, color: "text-sage" },
  pdf: { icon: FileText, color: "text-terracotta" },
  quiz: { icon: HelpCircle, color: "text-terracotta" },
  reading: { icon: BookOpen, color: "text-sage" },
};

export function RecentlyAccessed() {
  const { data: recent } = useRecentlyAccessed();

  const hasData = recent && recent.length > 0;

  const items = hasData
    ? recent.map((r) => {
        const section = r.sections as any;
        const contentType = section?.content_type ?? "external_url";
        const mapping = contentTypeIcons[contentType] ?? contentTypeIcons.external_url;
        const unitTitle = section?.units?.title ?? "";
        const courseTitle = section?.units?.courses?.title ?? "";
        return {
          icon: mapping.icon,
          iconColor: mapping.color,
          title: section?.title ?? "Untitled",
          subtitle: `${courseTitle}${unitTitle ? ` • ${unitTitle}` : ""}`,
        };
      })
    : [];

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/30">
      <h3 className="text-sm font-medium text-foreground mb-3">Recently Accessed</h3>
      {!hasData && (
        <p className="text-sm text-muted-foreground">No recently accessed sections yet.</p>
      )}
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
