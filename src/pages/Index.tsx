import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ActiveCourses } from "@/components/ActiveCourses";
import { LearningHeatmap } from "@/components/LearningHeatmap";
import { SkillGraph } from "@/components/SkillGraph";
import { QuickStats } from "@/components/QuickStats";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 px-8 py-7 overflow-y-auto">
        <DashboardHeader name="Danny" unitsRemaining={3} />
        <ActiveCourses />
        <div className="grid grid-cols-2 gap-4 mt-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <LearningHeatmap />
          <SkillGraph />
        </div>
        <div className="mt-6">
          <QuickStats />
        </div>
      </main>
    </div>
  );
};

export default Index;
