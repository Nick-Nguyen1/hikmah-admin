import { cn } from "@/lib/utils";

type Status = "PENDING" | "ACCEPTED" | "DECLINED";

export function MatchStatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        status === "PENDING" && "bg-muted text-muted-foreground",
        status === "ACCEPTED" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        status === "DECLINED" && "bg-destructive/10 text-destructive"
      )}
    >
      {status}
    </span>
  );
}
