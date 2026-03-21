import { DashboardSidebar } from "@/components/DashboardSidebar";
import { User, Bell, Palette, Shield, Clock } from "lucide-react";

const sections = [
  {
    icon: User,
    title: "Profile",
    description: "Manage your personal information and preferences.",
    fields: [
      { label: "Full Name", value: "Danny Bhaskaran" },
      { label: "Email", value: "danny@example.com" },
      { label: "Timezone", value: "Australia/Sydney" },
    ],
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Control how and when you receive notifications.",
    toggles: [
      { label: "Course reminders", enabled: true },
      { label: "Streak alerts", enabled: true },
      { label: "Weekly progress report", enabled: false },
    ],
  },
  {
    icon: Clock,
    title: "Study Preferences",
    description: "Set your daily study goals and preferred schedule.",
    fields: [
      { label: "Daily Goal", value: "4 hours" },
      { label: "Preferred Time", value: "Morning (6am–12pm)" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 px-8 py-7 overflow-y-auto">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-2xl font-medium text-foreground mb-1">Settings</h1>
          <p className="text-sm text-muted-foreground mb-8">Manage your account and preferences.</p>

          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="bg-card rounded-xl shadow-card border border-border/30 overflow-hidden animate-fade-up">
                <div className="px-6 py-4 border-b border-border/30 flex items-center gap-3">
                  <section.icon className="w-[18px] h-[18px] text-sage" strokeWidth={1.8} />
                  <div>
                    <h2 className="text-sm font-medium text-foreground">{section.title}</h2>
                    <p className="text-[11px] text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <div className="px-6 py-4 space-y-4">
                  {section.fields?.map((field) => (
                    <div key={field.label} className="flex items-center justify-between">
                      <label className="text-sm text-muted-foreground">{field.label}</label>
                      <input
                        type="text"
                        defaultValue={field.value}
                        className="text-sm text-foreground bg-muted/40 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30 transition-sanctuary w-60 text-right"
                      />
                    </div>
                  ))}
                  {section.toggles?.map((toggle) => (
                    <div key={toggle.label} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{toggle.label}</span>
                      <button
                        className={`w-10 h-6 rounded-full transition-sanctuary relative ${
                          toggle.enabled ? "bg-sage" : "bg-muted"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-sanctuary shadow-sm ${
                            toggle.enabled ? "left-5" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button className="px-5 py-2.5 rounded-lg bg-sage text-primary-foreground text-sm font-medium hover:bg-sage-hover transition-sanctuary active:scale-[0.97]">
              Save Changes
            </button>
            <button className="px-5 py-2.5 rounded-lg bg-muted/60 text-muted-foreground text-sm font-medium hover:bg-muted transition-sanctuary active:scale-[0.97]">
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
