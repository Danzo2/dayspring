import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useProfile } from "@/hooks/useDashboardData";
import { useAuth } from "@/hooks/useAuth";
import { User, Bell, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: profile, refetch } = useProfile();
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string | null>(null);
  const [dailyGoal, setDailyGoal] = useState<string | null>(null);
  const [preferredTime, setPreferredTime] = useState<string | null>(null);
  const [notifyReminders, setNotifyReminders] = useState<boolean | null>(null);
  const [notifyStreaks, setNotifyStreaks] = useState<boolean | null>(null);
  const [notifyWeekly, setNotifyWeekly] = useState<boolean | null>(null);

  const name = fullName ?? profile?.full_name ?? "";
  const tz = timezone ?? profile?.timezone ?? "Australia/Adelaide";
  const goal = dailyGoal ?? String(profile?.daily_goal_hours ?? 4);
  const time = preferredTime ?? profile?.preferred_time_range ?? "Morning (6am-12pm)";
  const reminders = notifyReminders ?? profile?.notify_reminders ?? true;
  const streaks = notifyStreaks ?? profile?.notify_streaks ?? true;
  const weekly = notifyWeekly ?? profile?.notify_weekly_report ?? false;

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name,
        timezone: tz,
        daily_goal_hours: Number(goal),
        preferred_time_range: time,
        notify_reminders: reminders,
        notify_streaks: streaks,
        notify_weekly_report: weekly,
      })
      .eq("id", user.id);

    setSaving(false);
    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved");
      refetch();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 px-8 py-7 overflow-y-auto">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-2xl font-medium text-foreground mb-1">Settings</h1>
          <p className="text-sm text-muted-foreground mb-8">Manage your account and preferences.</p>

          <div className="space-y-6">
            {/* Profile */}
            <div className="bg-card rounded-xl shadow-card border border-border/30 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/30 flex items-center gap-3">
                <User className="w-[18px] h-[18px] text-sage" strokeWidth={1.8} />
                <div>
                  <h2 className="text-sm font-medium text-foreground">Profile</h2>
                  <p className="text-[11px] text-muted-foreground">Manage your personal information and preferences.</p>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setFullName(e.target.value)}
                    className="text-sm text-foreground bg-muted/40 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30 transition-sanctuary w-60 text-right"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Email</label>
                  <span className="text-sm text-muted-foreground">{user?.email ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Timezone</label>
                  <input
                    type="text"
                    value={tz}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="text-sm text-foreground bg-muted/40 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30 transition-sanctuary w-60 text-right"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-card rounded-xl shadow-card border border-border/30 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/30 flex items-center gap-3">
                <Bell className="w-[18px] h-[18px] text-sage" strokeWidth={1.8} />
                <div>
                  <h2 className="text-sm font-medium text-foreground">Notifications</h2>
                  <p className="text-[11px] text-muted-foreground">Control how and when you receive notifications.</p>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                {[
                  { label: "Course reminders", value: reminders, setter: setNotifyReminders },
                  { label: "Streak alerts", value: streaks, setter: setNotifyStreaks },
                  { label: "Weekly progress report", value: weekly, setter: setNotifyWeekly },
                ].map((toggle) => (
                  <div key={toggle.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{toggle.label}</span>
                    <button
                      onClick={() => toggle.setter(!toggle.value)}
                      className={`w-10 h-6 rounded-full transition-sanctuary relative ${
                        toggle.value ? "bg-sage" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-sanctuary shadow-sm ${
                          toggle.value ? "left-5" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Preferences */}
            <div className="bg-card rounded-xl shadow-card border border-border/30 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/30 flex items-center gap-3">
                <Clock className="w-[18px] h-[18px] text-sage" strokeWidth={1.8} />
                <div>
                  <h2 className="text-sm font-medium text-foreground">Study Preferences</h2>
                  <p className="text-[11px] text-muted-foreground">Set your daily study goals and preferred schedule.</p>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Daily Goal (hours)</label>
                  <input
                    type="number"
                    value={goal}
                    onChange={(e) => setDailyGoal(e.target.value)}
                    className="text-sm text-foreground bg-muted/40 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30 transition-sanctuary w-60 text-right"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Preferred Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="text-sm text-foreground bg-muted/40 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30 transition-sanctuary w-60 text-right"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-sage text-primary-foreground text-sm font-medium hover:bg-sage-hover transition-sanctuary active:scale-[0.97] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setFullName(null); setTimezone(null); setDailyGoal(null);
                setPreferredTime(null); setNotifyReminders(null);
                setNotifyStreaks(null); setNotifyWeekly(null);
              }}
              className="px-5 py-2.5 rounded-lg bg-muted/60 text-muted-foreground text-sm font-medium hover:bg-muted transition-sanctuary active:scale-[0.97]"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
