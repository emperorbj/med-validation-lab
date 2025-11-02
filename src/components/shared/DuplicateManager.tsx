import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Copy, Trash2, RefreshCw, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface DuplicateInfo {
  _id: string;
  count: number;
  claim_ids: string[];
}

interface DuplicateManagerProps {
  tenantId: string;
  onDuplicatesRemoved?: () => void;
}

export const DuplicateManager: React.FC<DuplicateManagerProps> = ({
  tenantId,
  onDuplicatesRemoved,
}) => {
  const [duplicates, setDuplicates] = useState<DuplicateInfo[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);

  const checkDuplicates = async () => {
    if (!tenantId) {
      toast({
        title: "No Tenant Selected",
        description: "Please select a tenant first",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    try {
      const { data } = await api.get(`/claims/${tenantId}/duplicates`);
      setDuplicates(data.duplicates || []);
      setShowDuplicates(true);

      if (data.duplicate_count === 0) {
        toast({
          title: "No Duplicates Found",
          description: "All claims have unique IDs",
        });
      } else {
        toast({
          title: "Duplicates Found",
          description: `Found ${data.duplicate_count} duplicate claim groups`,
          variant: "default",
        });
      }
    } catch (err: any) {
      toast({
        title: "Check Failed",
        description: err.response?.data?.detail || "Failed to check duplicates",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const removeDuplicates = async () => {
    setIsRemoving(true);
    try {
      const { data } = await api.delete(`/claims/${tenantId}/duplicates`);
      
      toast({
        title: "Duplicates Removed",
        description: `Removed ${data.claims_deleted} duplicate claims from ${data.duplicate_groups} groups`,
      });

      // Refresh the duplicate check
      setDuplicates([]);
      setShowDuplicates(false);

      // Notify parent component
      if (onDuplicatesRemoved) {
        onDuplicatesRemoved();
      }
    } catch (err: any) {
      toast({
        title: "Removal Failed",
        description: err.response?.data?.detail || "Failed to remove duplicates",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Copy className="h-5 w-5" />
          Duplicate Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Check Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={checkDuplicates}
            disabled={isChecking || !tenantId}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Checking..." : "Check for Duplicates"}
          </Button>

          {duplicates.length > 0 && (
            <Badge variant="destructive">
              {duplicates.length} duplicate groups found
            </Badge>
          )}
        </div>

        {/* Show Duplicates List */}
        {showDuplicates && duplicates.length > 0 && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Found {duplicates.length} unique_id(s) with duplicate claims
              </AlertDescription>
            </Alert>

            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-4">
              {duplicates.slice(0, 10).map((dup, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded"
                >
                  <div>
                    <p className="font-mono text-sm font-semibold">
                      {dup._id}
                    </p>
                    <p className="text-xs text-gray-600">
                      {dup.count} duplicates • Claim IDs: {dup.claim_ids.join(", ")}
                    </p>
                  </div>
                  <Badge variant="destructive">{dup.count}x</Badge>
                </div>
              ))}
              {duplicates.length > 10 && (
                <p className="text-sm text-gray-500 text-center">
                  ... and {duplicates.length - 10} more
                </p>
              )}
            </div>

            {/* Remove Duplicates Button with Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isRemoving}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isRemoving ? "Removing..." : "Remove All Duplicates"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove duplicate claims, keeping only the most recent
                    upload for each unique_id. This action cannot be undone.
                    <br />
                    <br />
                    <strong>{duplicates.length} unique_id groups</strong> will be
                    cleaned up.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={removeDuplicates}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remove Duplicates
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {showDuplicates && duplicates.length === 0 && (
          <Alert>
            <AlertDescription>
              ✅ No duplicates found for this tenant
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};