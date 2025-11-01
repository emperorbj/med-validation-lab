
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TenantSelector } from "@/components/shared/TenantSelector";
import { ClaimsTable } from "@/components/shared/ClaimsTable";
import {
  Download,
  RefreshCw,
  Filter,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

interface Claim {
  claim_id: string;
  service_date: string;
  paid_amount_aed: number;
  status: string;
  error_type: string;
  error_explanation: string[];
  recommended_action: string;
  encounter_type: string;
  member_id: string;
  national_id: string;
}

export const Results: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState("hospital_A");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const { id } = useParams();

useEffect(() => {
    const savedTenant = localStorage.getItem("selectedTenant");
    if (savedTenant) {
      setSelectedTenant(savedTenant);
    }
  }, []);

  // useEffect(() => {
  //   const savedTenant = localStorage.getItem("selectedTenant");
  //   if (savedTenant) setSelectedTenant(savedTenant); 
  //   if (!savedTenant && selectedTenant !== "hospital_A") {
  //     setSelectedTenant("hospital_A"); // Set default tenant
  //   }
  // }, []);

  const fetchResults = async () => {
        if (!selectedTenant) return;

    try {
      setIsRefreshing(true);
      const { data } = await api.get(`/results/${encodeURIComponent(selectedTenant)}`);
      setClaims(data.claims || []);
      toast({
        title: "Results Loaded",
        description: `${data.pagination.total} claims fetched for ${selectedTenant}`,
      });
    } catch (err: any) {
      toast({
        title: "Failed to Load Results",
        description: err.response?.data?.detail || "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

    useEffect(() => {
    if (selectedTenant) {
      fetchResults();
    }
  }, [selectedTenant]);

  // ✅ FIX: Save tenant to localStorage when changed
  const handleTenantChange = (newTenant: string) => {
    localStorage.setItem("selectedTenant", newTenant);
    setSelectedTenant(newTenant);
  };

  // useEffect(() => {
  //   fetchResults();
  // }, [selectedTenant]);

  const handleExport = () => {
    const csv = [
      ["Claim ID", "Service Date", "Paid Amount", "Status", "Error Type"],
      ...claims.map((c) => [
        c.claim_id,
        c.service_date,
        c.paid_amount_aed,
        c.status,
        c.error_type,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedTenant}-validation-results.csv`;
    link.click();
  };

  const totalClaims = claims.length;
  const validClaims = claims.filter((c) => c.status === "Validated").length;
  const invalidClaims = claims.filter((c) => c.status === "Invalid").length;
  const warningClaims = claims.filter((c) => c.status === "Warning").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Validation Results</h1>
          <p className="text-gray-600">
            Detailed results from claims validation process
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchResults} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TenantSelector value={selectedTenant} onValueChange={handleTenantChange} />
            <div>
              <p className="text-sm text-gray-500">
                Tenant results update automatically on change.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-3xl font-bold text-gray-900">{totalClaims}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Valid Claims</p>
                <p className="text-3xl font-bold text-green-900">{validClaims}</p>
                <p className="text-sm text-green-600">
                  {totalClaims ? Math.round((validClaims / totalClaims) * 100) : 0}% of total
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Warnings</p>
                <p className="text-3xl font-bold text-yellow-900">{warningClaims}</p>
                <p className="text-sm text-yellow-600">
                  {totalClaims ? Math.round((warningClaims / totalClaims) * 100) : 0}% of total
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Invalid Claims</p>
                <p className="text-3xl font-bold text-red-900">{invalidClaims}</p>
                <p className="text-sm text-red-600">
                  {totalClaims ? Math.round((invalidClaims / totalClaims) * 100) : 0}% of total
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <ClaimsTable
        claims={claims.map((c) => ({
          id: c.claim_id,
          patientId: c.member_id,
          patientName: c.national_id,
          serviceDate: c.service_date,
          amount: c.paid_amount_aed,
          status: c.status === "Validated" ? "valid" : "invalid",
          errorType: c.error_type,
          errorDescription: c.error_explanation?.join("; ") || "-",
          recommendedAction: c.recommended_action,
        }))}
        title="Detailed Validation Results"
        showActions
      />
    </div>
  );
};
