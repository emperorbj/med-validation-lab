import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  DollarSign,
} from "lucide-react";

// Mock data for dashboard
const mockStats = {
  totalClaims: 12547,
  validatedClaims: 11203,
  errorClaims: 1344,
  lastValidation: "2024-01-15 14:30:25",
  successRate: 89.3,
  totalValue: 4567890,
  pendingReview: 234,
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your healthcare claims validation system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalClaims.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validated Claims</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {mockStats.validatedClaims.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockStats.successRate}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Claims</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockStats.errorClaims.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockStats.pendingReview} pending review
            </p>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(mockStats.totalValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Claims processed this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Validation Progress */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Validation Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Claims Processed</span>
                <span>{mockStats.successRate}%</span>
              </div>
              <Progress value={mockStats.successRate} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-lg font-semibold text-success">
                  {mockStats.validatedClaims.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Validated</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-destructive">
                  {mockStats.errorClaims.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Validation Run</span>
                <Badge variant="secondary">{mockStats.lastValidation}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Status</span>
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Processing Queue</span>
                <Badge variant="outline">{mockStats.pendingReview} pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Upload New Rules</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Run Validation</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">Review Errors</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}