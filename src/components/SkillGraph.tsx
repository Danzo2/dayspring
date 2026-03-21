import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Context Engineering", score: 18, fullMark: 20 },
  { subject: "Evaluation & Debugging", score: 14, fullMark: 20 },
  { subject: "Tools & Integrations", score: 16, fullMark: 20 },
  { subject: "Techniques", score: 17, fullMark: 20 },
  { subject: "Research", score: 12, fullMark: 20 },
];

export function SkillGraph() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/30 h-full">
      <h3 className="text-sm font-medium text-foreground mb-2">Skill Graph</h3>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="hsl(var(--border))" strokeWidth={0.8} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 20]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Skills"
            dataKey="score"
            stroke="hsl(var(--sage))"
            fill="hsl(var(--sage))"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "hsl(var(--terracotta))",
              stroke: "hsl(var(--terracotta))",
              strokeWidth: 0,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
