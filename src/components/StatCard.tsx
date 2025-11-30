import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  colorVariant: "primary" | "success" | "pending" | "destructive";
  tooltip?: string;
}

const colorClasses = {
  primary: "border-l-primary",
  success: "border-l-success",
  pending: "border-l-pending",
  destructive: "border-l-destructive",
};

const textColorClasses = {
  primary: "text-foreground",
  success: "text-success",
  pending: "text-pending",
  destructive: "text-destructive",
};

const iconColorClasses = {
  primary: "text-muted-foreground",
  success: "text-success",
  pending: "text-pending",
  destructive: "text-destructive",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  colorVariant,
  tooltip,
}: StatCardProps) {
  const borderColor = colorClasses[colorVariant];
  const textColor = textColorClasses[colorVariant];
  const iconColor = iconColorClasses[colorVariant];

  const cardContent = (
    <Card
      className={cn(
        "hover:shadow-lg transition-all cursor-help border-l-4",
        borderColor
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", textColor)}>{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return cardContent;
}

