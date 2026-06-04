import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "forest" | "terracotta" | "gold" | "muted";
}

const tones = {
  forest: "bg-forest/10 text-forest",
  terracotta: "bg-terracotta/10 text-terracotta",
  gold: "bg-gold/15 text-terracotta",
  muted: "bg-muted text-foreground",
};

export default function StatCard({ label, value, icon: Icon, hint, tone = "forest" }: Props) {
  return (
    <Card className="border-border shadow-card">
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground truncate">{hint}</p>}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-md", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
