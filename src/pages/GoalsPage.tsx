import { FormEvent, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useGoals, useMilestones } from "@/hooks/useDashboardData";
import { Target, Plus, CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function GoalsPage() {
  const { user } = useAuth();
  const { data: goals } = useGoals();
  const { data: milestones } = useMilestones();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("");
  const [dueDate, setDueDate] = useState("");

  const activeGoals = goals?.filter((g) => !g.is_completed) ?? [];
  const completedGoals = goals?.filter((g) => g.is_completed) ?? [];
  const onTrack = activeGoals.length > 0
    ? Math.round((activeGoals.filter((g) => (g.current_value ?? 0) / (g.target_value ?? 1) >= 0.5).length / activeGoals.length) * 100)
    : 100;

  const createGoalMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be signed in to create a goal.");
      const parsedTarget = targetValue.trim() ? Number(targetValue) : null;
      if (parsedTarget !== null && Number.isNaN(parsedTarget)) {
        throw new Error("Target value must be a valid number.");
      }

      const { error } = await supabase.from("goals").insert({
        user_id: user.id,
        title: title.trim(),
        target_value: parsedTarget,
        current_value: parsedTarget === null ? null : 0,
        unit: unit.trim() || null,
        due_date: dueDate || null,
        is_completed: false,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["goals", user?.id] });
      toast({ title: "Goal created", description: "Your new goal is now being tracked." });
      setIsCreateGoalOpen(false);
      setTitle("");
      setTargetValue("");
      setUnit("");
      setDueDate("");
    },
    onError: (error: Error) => {
      toast({ title: "Couldn't create goal", description: error.message, variant: "destructive" });
    },
  });

  const handleCreateGoal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createGoalMutation.mutate();
  };

  return (
    <>
      <div className={`flex min-h-screen bg-background transition-[filter] duration-200 ${isCreateGoalOpen ? "blur-sm pointer-events-none select-none" : ""}`}>
        <DashboardSidebar />
        <main className="flex-1 px-8 py-7 overflow-y-auto">
          <div className="flex items-start justify-between mb-8 animate-fade-up">
            <div>
              <h1 className="text-2xl font-medium text-foreground">Goals & Tracking</h1>
              <p className="text-sm text-muted-foreground mt-1">Track your learning objectives and milestones.</p>
            </div>
            <button
              onClick={() => setIsCreateGoalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sage text-primary-foreground text-sm font-medium hover:bg-sage-hover transition-sanctuary active:scale-[0.97]"
            >
              <Plus className="w-4 h-4" />
              New Goal
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            {[
              { label: "Active Goals", value: String(activeGoals.length), icon: Target, color: "text-sage" },
              { label: "Completed", value: String(completedGoals.length), icon: CheckCircle2, color: "text-sage" },
              { label: "On Track", value: `${onTrack}%`, icon: TrendingUp, color: "text-terracotta" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-xl p-5 shadow-card border border-border/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted/60 flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="col-span-3 space-y-3">
              <h2 className="text-base font-medium text-foreground mb-3">Active Goals</h2>
              {activeGoals.length === 0 && (
                <div className="bg-card rounded-xl p-8 shadow-card border border-border/30 text-center">
                  <p className="text-sm text-muted-foreground">No active goals yet. Create one to get started!</p>
                </div>
              )}
              {activeGoals.map((g) => {
                const pct = g.target_value ? Math.round(((g.current_value ?? 0) / g.target_value) * 100) : 0;
                return (
                  <div key={g.id} className="bg-card rounded-xl p-5 shadow-card border border-border/30">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm font-medium text-foreground">{g.title}</h3>
                      <span className="text-[11px] text-muted-foreground">
                        {g.current_value ?? 0} / {g.target_value ?? 0} {g.unit ?? ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Progress value={pct} className="h-1.5 bg-muted" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="col-span-2">
              <h2 className="text-base font-medium text-foreground mb-3">Milestones</h2>
              <div className="bg-card rounded-xl p-5 shadow-card border border-border/30 space-y-3">
                {(!milestones || milestones.length === 0) && (
                  <p className="text-sm text-muted-foreground">No milestones yet.</p>
                )}
                {milestones?.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    {m.is_completed ? (
                      <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0" strokeWidth={1.8} />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" strokeWidth={1.8} />
                    )}
                    <span className={`text-sm ${m.is_completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {isCreateGoalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Close modal"
            className="absolute inset-0 bg-background/50 backdrop-blur-md"
            onClick={() => setIsCreateGoalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card rounded-2xl p-6 shadow-card-hover border border-border/40 animate-fade-up">
            <h2 className="text-lg font-medium text-foreground">Create New Goal</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              Add a focused learning goal and track it over time.
            </p>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="goal-title" className="text-xs font-medium text-muted-foreground">Goal name</Label>
                <Input
                  id="goal-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Complete Unit 1"
                  required
                  className="h-11 bg-background/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="goal-target" className="text-xs font-medium text-muted-foreground">Target value</Label>
                  <Input
                    id="goal-target"
                    type="number"
                    min="0"
                    step="1"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder="10"
                    className="h-11 bg-background/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="goal-unit" className="text-xs font-medium text-muted-foreground">Unit</Label>
                  <Input
                    id="goal-unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="sections"
                    className="h-11 bg-background/60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="goal-due-date" className="text-xs font-medium text-muted-foreground">Due date (optional)</Label>
                <Input
                  id="goal-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-11 bg-background/60"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateGoalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createGoalMutation.isPending || title.trim().length === 0}
                  className="bg-sage text-primary-foreground hover:bg-sage-hover"
                >
                  {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
