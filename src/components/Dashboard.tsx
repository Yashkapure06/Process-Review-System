import { Process } from "@/types/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  ArrowRight,
  Package,
} from "lucide-react";
import { StatCard } from "./StatCard";

interface DashboardProps {
  processes: Process[];
  onSelectProcess: (id: string) => void;
}

export function Dashboard({ processes, onSelectProcess }: DashboardProps) {
  const stats = {
    totalTasks: 0,
    approved: 0,
    pending: 0,
    needsFix: 0,
    totalProcesses: processes.length,
  };

  processes.forEach((process) => {
    process.subprocesses.forEach((subprocess) => {
      subprocess.tasks.forEach((task) => {
        stats.totalTasks++;
        if (task.status === "Approved") stats.approved++;
        else if (task.status === "Pending") stats.pending++;
        else if (task.status === "Needs Fix") stats.needsFix++;
      });
    });
  });

  const completionPercentage =
    stats.totalTasks > 0
      ? Math.round((stats.approved / stats.totalTasks) * 100)
      : 0;

  const processData = processes.map((process) => {
    const totalTasks = process.subprocesses.reduce(
      (sum, sub) => sum + sub.tasks.length,
      0
    );
    const approvedTasks = process.subprocesses.reduce(
      (sum, sub) =>
        sum + sub.tasks.filter((t) => t.status === "Approved").length,
      0
    );
    return {
      name:
        process.name.length > 15
          ? process.name.substring(0, 15) + "..."
          : process.name,
      fullName: process.name,
      approved: approvedTasks,
      total: totalTasks,
      id: process.id,
    };
  });

  const pieData = [
    { name: "Approved", value: stats.approved, color: "hsl(var(--success))" },
    { name: "Pending", value: stats.pending, color: "hsl(var(--pending))" },
    {
      name: "Needs Fix",
      value: stats.needsFix,
      color: "hsl(var(--destructive))",
    },
  ].filter((item) => item.value > 0);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of all manufacturing process reviews
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            description={`Across ${stats.totalProcesses} processes`}
            icon={Activity}
            colorVariant="primary"
            tooltip="Total number of tasks to review"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            description={`${
              stats.totalTasks > 0
                ? Math.round((stats.approved / stats.totalTasks) * 100)
                : 0
            }% complete`}
            icon={CheckCircle2}
            colorVariant="success"
            tooltip="Tasks that have been approved"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            description="Awaiting review"
            icon={Clock}
            colorVariant="pending"
            tooltip="Tasks waiting for review"
          />
          <StatCard
            title="Needs Fix"
            value={stats.needsFix}
            description="Requires attention"
            icon={AlertCircle}
            colorVariant="destructive"
            tooltip="Tasks that need to be fixed"
          />
        </div>

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>
              Total approval completion across all processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-semibold">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Start Review Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Start Review
            </CardTitle>
            <CardDescription>
              Select a process to begin reviewing tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processes.map((process) => {
                const totalTasks = process.subprocesses.reduce(
                  (sum, sub) => sum + sub.tasks.length,
                  0
                );
                const approvedTasks = process.subprocesses.reduce(
                  (sum, sub) =>
                    sum +
                    sub.tasks.filter((t) => t.status === "Approved").length,
                  0
                );
                const progress =
                  totalTasks > 0
                    ? Math.round((approvedTasks / totalTasks) * 100)
                    : 0;

                return (
                  <Card
                    key={process.id}
                    className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
                    onClick={() => onSelectProcess(process.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-start justify-between">
                        <span className="line-clamp-2">{process.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {approvedTasks}/{totalTasks} tasks
                        </span>
                        <span>{process.subprocesses.length} subprocesses</span>
                      </div>
                      <Button className="w-full" size="sm">
                        Review Process
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Process Progress</CardTitle>
              <CardDescription>
                Approved tasks per process (click to view)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Bar
                    dataKey="approved"
                    radius={[8, 8, 0, 0]}
                    cursor="pointer"
                    onClick={(data) => onSelectProcess(data.id)}
                  >
                    {processData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="hsl(var(--chart-1))" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Overall task status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
