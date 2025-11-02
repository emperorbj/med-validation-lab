// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

// export interface Claim {
//   id: string;
//   patientId: string;
//   patientName: string;
//   serviceDate: string;
//   amount: number;
//   status: "valid" | "invalid" | "warning" | "pending";
//   errorType?: string;
//   errorDescription?: string;
//   recommendedAction?: string;
//   fullData?: any;
// }

// interface ClaimsTableProps {
//   claims?: Claim[];
//   showActions?: boolean;
//   title?: string;
// }

// const getStatusBadge = (status: string) => {
//   const variants = {
//     valid: "bg-green-100 text-green-800 border-green-200",
//     invalid: "bg-red-100 text-red-800 border-red-200",
//     warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
//     pending: "bg-blue-100 text-blue-800 border-blue-200",
//   };
//   return (
//     <Badge className={`${variants[status as keyof typeof variants]} border`}>
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </Badge>
//   );
// };

// export const ClaimsTable: React.FC<ClaimsTableProps> = ({
//   claims = [],
//   showActions = true,
//   title = "Claims",
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const filteredClaims = claims.filter((claim) => {
//     const matchesSearch =
//       (claim.id ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (claim.patientName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (claim.patientId ?? "").toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedClaims = filteredClaims.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-2">
//             {title}
//             <Badge variant="secondary">{filteredClaims.length}</Badge>
//           </CardTitle>
//         </div>
//         {/* Filters */}
//         <div className="flex gap-4 items-center mt-2">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input
//               placeholder="Search claims..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-40">
//               <Filter className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Filter Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="valid">Valid</SelectItem>
//               <SelectItem value="invalid">Invalid</SelectItem>
//               <SelectItem value="warning">Warning</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Claim ID</TableHead>
//                 <TableHead>Patient</TableHead>
//                 <TableHead>Service Date</TableHead>
//                 <TableHead>Amount</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Error Type</TableHead>
//                 <TableHead>Description</TableHead>
//                 {showActions && <TableHead>Actions</TableHead>}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {paginatedClaims.map((claim) => (
//                 <TableRow key={claim.id}>
//                   <TableCell className="font-medium">{claim.id}</TableCell>
//                   <TableCell>
//                     <div>
//                       <div className="font-medium">{claim.patientName}</div>
//                       <div className="text-sm text-gray-500">{claim.patientId}</div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     {new Date(claim.serviceDate).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>${claim.amount.toFixed(2)}</TableCell>
//                   <TableCell>{getStatusBadge(claim.status)}</TableCell>
//                   <TableCell>{claim.errorType || "-"}</TableCell>
//                   <TableCell
//                     className="max-w-xs truncate"
//                     title={claim.errorDescription}
//                   >
//                     {claim.errorDescription || "-"}
//                   </TableCell>
//                   {showActions && (
//                     <TableCell>
//                       <Button variant="outline" size="sm">
//                         View Details
//                       </Button>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between pt-4">
//             <div className="text-sm text-gray-500">
//               Showing {startIndex + 1} to{" "}
//               {Math.min(startIndex + itemsPerPage, filteredClaims.length)} of{" "}
//               {filteredClaims.length} claims
//             </div>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 Previous
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(totalPages, prev + 1))
//                 }
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };


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