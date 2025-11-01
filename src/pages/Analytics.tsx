import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TenantSelector } from '../components/shared/TenantSelector';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { useParams } from "react-router-dom";


export const Analytics: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState('hospital_A');
  const [timeRange, setTimeRange] = useState('7days');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  // const { id } = useParams();



    useEffect(() => {
      const savedTenant = localStorage.getItem("selectedTenant");
      if (savedTenant) {
        setSelectedTenant(savedTenant); 
      }
    }, []);
  

  const fetchAnalytics = async () => {
        if (!selectedTenant) return;

    try {
      setIsRefreshing(true);
      const { data } = await api.get(
        `/analytics/${encodeURIComponent(selectedTenant)}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setAnalyticsData(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsRefreshing(false);
    }
  };


   useEffect(() => {
    if (selectedTenant) {
      fetchAnalytics();
    }
  }, [selectedTenant]);

  // useEffect(() => {
  //   fetchAnalytics();
  // }, [selectedTenant]);


  const handleTenantChange = (newTenant: string) => {
    localStorage.setItem("selectedTenant", newTenant);
    setSelectedTenant(newTenant);
  };

  const handleExport = () => {
    if (!analyticsData) return;
    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_${selectedTenant}.json`;
    link.click();
  };

  if (!analyticsData) {
    return <p className="text-gray-600">Loading analytics...</p>;
  }

  const { total_claims, validation_summary, claims_by_error_chart, error_distribution } = analyticsData;
  const errorRate = ((validation_summary.not_validated / total_claims) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Tenant: {selectedTenant}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAnalytics} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TenantSelector value={selectedTenant} onValueChange={handleTenantChange} />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Time Range
              </label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Total Claims</p>
            <p className="text-3xl font-bold">{total_claims}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-green-600">Validated</p>
            <p className="text-3xl font-bold text-green-900">{validation_summary.validated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-red-600">Not Validated</p>
            <p className="text-3xl font-bold text-red-900">{validation_summary.not_validated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-yellow-600">Error Rate</p>
            <p className="text-3xl font-bold text-yellow-900">{errorRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Error Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={claims_by_error_chart}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
              >
                {claims_by_error_chart.map((entry: any, index: number) => (
                  <Cell key={index} fill={index % 2 === 0 ? '#EF4444' : '#F59E0B'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Error Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Error Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error_distribution.map((err: any, idx: number) => (
            <div key={idx} className="flex justify-between border p-4 rounded">
              <div>
                <h4 className="font-semibold">{err.error_category}</h4>
                <p className="text-sm text-gray-600">{err.claim_count} claims</p>
              </div>
              <Badge variant="secondary">{err.total_paid_amount.toFixed(2)} AED</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
