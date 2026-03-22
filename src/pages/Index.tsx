import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { QuickStats } from "@/components/QuickStats";
import { ActiveCourses } from "@/components/ActiveCourses";
import { LearningHeatmap } from "@/components/LearningHeatmap";
import { SkillGraph } from "@/components/SkillGraph";
import { LearningActivity } from "@/components/LearningActivity";
import { RecentlyAccessed } from "@/components/RecentlyAccessed";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 px-8 py-7 overflow-y-auto">
        <DashboardHeader name={firstName} unitsRemaining={3} />
        <QuickStats />
        <div className="mt-6">
          <ActiveCourses />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <div className="col-span-2 space-y-4">
            <LearningActivity />
            <div className="grid grid-cols-2 gap-4">
              <LearningHeatmap />
              <SkillGraph />
            </div>
          </div>
          <div>
            <RecentlyAccessed />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
