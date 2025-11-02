import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  User,
  Calendar,
  DollarSign,
  Building,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";

interface ClaimDetailsModalProps {
  claim: any; // Full claim object
  isOpen: boolean;
  onClose: () => void;
}

export const ClaimDetailsModal: React.FC<ClaimDetailsModalProps> = ({
  claim,
  isOpen,
  onClose,
}) => {
  if (!claim) return null;

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "validated") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Validated
        </Badge>
      );
    } else if (statusLower === "not validated") {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300">
          <XCircle className="h-3 w-3 mr-1" />
          Not Validated
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary">
          <Activity className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    }
  };

  const getErrorTypeBadge = (errorType: string) => {
    if (!errorType || errorType === "No error") {
      return <Badge variant="outline">No Errors</Badge>;
    }
    
    const type = errorType.toLowerCase();
    if (type.includes("technical")) {
      return <Badge variant="destructive">Technical Error</Badge>;
    } else if (type.includes("medical")) {
      return <Badge className="bg-orange-100 text-orange-800 border-orange-300">Medical Error</Badge>;
    } else if (type === "both") {
      return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Technical & Medical</Badge>;
    }
    return <Badge variant="secondary">{errorType}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Claim Details
          </DialogTitle>
          <DialogDescription>
            Complete information for claim {claim.claim_id || claim.unique_id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Validation Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                {getStatusBadge(claim.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Error Type:</span>
                {getErrorTypeBadge(claim.error_type)}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Claim ID</p>
                <p className="font-mono font-semibold">{claim.claim_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Unique ID</p>
                <p className="font-mono font-semibold">{claim.unique_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">National ID</p>
                <p className="font-mono">{claim.national_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Member ID</p>
                <p className="font-mono">{claim.member_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Encounter Type</p>
                <Badge variant="outline">{claim.encounter_type}</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Service Date</p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {claim.service_date}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service & Financial Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4" />
                Service & Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Facility ID</p>
                <p className="font-mono">{claim.facility_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Service Code</p>
                <Badge variant="secondary">{claim.service_code}</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Paid Amount</p>
                <p className="flex items-center gap-1 font-semibold text-lg">
                  <DollarSign className="h-4 w-4" />
                  {claim.paid_amount_aed?.toFixed(2)} AED
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Approval Number</p>
                <p className="font-mono">
                  {claim.approval_number || <span className="text-gray-400">Not provided</span>}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Diagnosis Codes</CardTitle>
            </CardHeader>
            <CardContent>
              {claim.diagnosis_codes && claim.diagnosis_codes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {claim.diagnosis_codes.map((code: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="font-mono">
                      {code}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No diagnosis codes</p>
              )}
            </CardContent>
          </Card>

          {/* Error Details */}
          {claim.error_explanation && claim.error_explanation.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  Validation Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {claim.error_explanation.map((error: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-red-600 font-bold">•</span>
                      <span className="text-red-900">{error}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recommended Action */}
          {claim.recommended_action && claim.recommended_action !== "" && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-base text-blue-800">
                  Recommended Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-900">{claim.recommended_action}</p>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-500">Tenant ID</p>
                <p className="font-mono">{claim.tenant_id}</p>
              </div>
              {claim.uploaded_at && (
                <div>
                  <p className="text-gray-500">Uploaded At</p>
                  <p>{new Date(claim.uploaded_at).toLocaleString()}</p>
                </div>
              )}
              {claim.validated_at && (
                <div>
                  <p className="text-gray-500">Validated At</p>
                  <p>{new Date(claim.validated_at).toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};