
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";
import { ClaimDetailsModal } from "@/components/shared/ClaimsDetail";

export interface Claim {
  id: string;
  patientId: string;
  patientName: string;
  serviceDate: string;
  amount: number;
  status: string;
  errorType?: string;
  errorDescription?: string;
  recommendedAction?: string;
  // Add full claim data
  fullData?: any;
}

interface ClaimsTableProps {
  claims: Claim[];
  title?: string;
  showActions?: boolean;
}

export const ClaimsTable: React.FC<ClaimsTableProps> = ({
  claims,
  title = "Claims",
  showActions = true,
}) => {
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (claim: Claim) => {
    // Use fullData if available, otherwise construct from claim object
    const claimData = claim.fullData || claim;
    setSelectedClaim(claimData);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "valid" || statusLower === "validated") {
      return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
    } else if (statusLower === "invalid" || statusLower === "not validated") {
      return <Badge className="bg-red-100 text-red-800">Invalid</Badge>;
    } else if (statusLower === "pending") {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    } else {
      return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Patient ID",
      "Patient Name",
      "Service Date",
      "Amount",
      "Status",
      "Error Type",
    ];

    const rows = claims.map((claim) => [
      claim.id,
      claim.patientId,
      claim.patientName,
      claim.serviceDate,
      claim.amount,
      claim.status,
      claim.errorType || "No error",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `claims-${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">
                {claims.length} claim{claims.length !== 1 ? "s" : ""}
              </Badge>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left text-sm font-semibold">ID</th>
                  <th className="p-3 text-left text-sm font-semibold">
                    Patient ID
                  </th>
                  <th className="p-3 text-left text-sm font-semibold">
                    Patient Name
                  </th>
                  <th className="p-3 text-left text-sm font-semibold">
                    Service Date
                  </th>
                  <th className="p-3 text-left text-sm font-semibold">
                    Amount (AED)
                  </th>
                  <th className="p-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  {showActions && (
                    <th className="p-3 text-left text-sm font-semibold">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {claims.length === 0 ? (
                  <tr>
                    <td
                      colSpan={showActions ? 7 : 6}
                      className="p-8 text-center text-gray-500"
                    >
                      No claims to display
                    </td>
                  </tr>
                ) : (
                  claims.map((claim) => (
                    <tr
                      key={claim.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-sm font-mono">{claim.id}</td>
                      <td className="p-3 text-sm">{claim.patientId}</td>
                      <td className="p-3 text-sm">{claim.patientName}</td>
                      <td className="p-3 text-sm">{claim.serviceDate}</td>
                      <td className="p-3 text-sm font-semibold">
                        {claim.amount.toFixed(2)}
                      </td>
                      <td className="p-3">{getStatusBadge(claim.status)}</td>
                      {showActions && (
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(claim)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <ClaimDetailsModal
        claim={selectedClaim}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};