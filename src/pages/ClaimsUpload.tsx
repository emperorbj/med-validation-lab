import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TenantSelector } from "@/components/shared/TenantSelector";
import { ClaimsTable, Claim } from "@/components/shared/ClaimsTable";
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface UploadedFile {    
  name: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  errorMessage?: string;
}

// Transform API claims into ClaimTable format
const transformClaims = (apiClaims: any[]): Claim[] =>
  apiClaims.map((c) => ({
    id: c.claim_id,
    patientId: c.member_id,
    patientName: c.national_id,
    serviceDate: c.service_date,
    amount: c.paid_amount_aed,
    status: (c.status || "pending").toLowerCase(),
    errorType: c.error_type !== "No error" ? c.error_type : undefined,
    errorDescription: c.error_explanation?.join(", ") || undefined,
    recommendedAction: c.recommended_action || undefined,
  }));

export const ClaimsUpload: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewClaims, setPreviewClaims] = useState<Claim[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [selectedTenant]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    if (!selectedTenant) {
      toast({
        title: "Select Tenant",
        description: "Please select a tenant first",
        variant: "destructive",
      });
      return;
    }

    const validFiles = files.filter(
      (file) =>
        file.type === "text/csv" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls")

    );

    if (validFiles.length === 0) {
      toast({
        title: "Invalid File",
        description: "Please upload only CSV or XLSX files.",
        variant: "destructive",
      });
      return;
    }

    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    for (let index = 0; index < validFiles.length; index++) {
      const fileIndex = uploadedFiles.length + index;
      try {
        setUploadedFiles((prev) => {
          const updated = [...prev];
          updated[fileIndex].progress = 50;
          return updated;
        });

        const formData = new FormData();
        formData.append("file", validFiles[index]);
        formData.append("tenant_id", selectedTenant);

        const { data } = await api.post("/upload/claims", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setUploadedFiles((prev) => {
          const updated = [...prev];
          updated[fileIndex].status = "completed";
          updated[fileIndex].progress = 100;
          return updated;
        });

        toast({
          title: "Upload Successful",
          description: `${data?.claims_count} claims uploaded for ${data?.tenant_id}`,
        });

        // Fetch preview claims
        const results = await api.get(`/results/${selectedTenant}`);
        setPreviewClaims(transformClaims(results?.data?.claims || []));
        setShowPreview(true);
      } catch (err: any) {
        setUploadedFiles((prev) => {
          const updated = [...prev];
          updated[fileIndex].status = "error";
          updated[fileIndex].errorMessage =
            err.response?.data?.detail || "Upload failed";
          return updated;
        });
      }
    }
  };

  const removeFile = (index: number) =>
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const completedFiles = uploadedFiles.filter((f) => f.status === "completed");

  const handleTenantChange = (newTenant: string) => {
    localStorage.setItem("selectedTenant", newTenant);
    setSelectedTenant(newTenant);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Claims</h1>
          <p className="text-gray-600">
            Upload CSV or XLSX files containing claims data for validation
          </p>
        </div>
      </div>

      {/* Tenant Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <TenantSelector
              value={selectedTenant}
              onValueChange={handleTenantChange}
              placeholder="Select a tenant to upload claims for..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } ${!selectedTenant ? "opacity-50 pointer-events-none" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Drag and drop files here, or click to select
              </p>
              <p className="text-gray-500">
                Supports CSV and XLSX files up to 10MB each
              </p>
              <div className="pt-4">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".csv,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={!selectedTenant}
                />
                <Button asChild disabled={!selectedTenant}>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Select Files
                  </label>
                </Button>
              </div>
            </div>
          </div>
          {!selectedTenant && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select a tenant before uploading files.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* File Upload Status */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">{getStatusIcon(file.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {formatFileSize(file.size)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {file.status !== "completed" && file.status !== "error" && (
                      <>
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-sm text-gray-500">
                          {file.status === "uploading"
                            ? "Uploading..."
                            : "Processing..."}{" "}
                          {file.progress}%
                        </p>
                      </>
                    )}
                    {file.status === "completed" && (
                      <p className="text-sm text-green-600">
                        Upload completed successfully
                      </p>
                    )}
                    {file.status === "error" && (
                      <p className="text-sm text-red-600">{file.errorMessage}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Claims Table */}
      {showPreview && completedFiles.length > 0 && (
        <div className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {completedFiles.length} file(s) uploaded successfully. Preview:
            </AlertDescription>
          </Alert>
          <ClaimsTable
            claims={previewClaims}
            title="Preview - Uploaded Claims"
            showActions={false}
          />
          <div className="flex gap-4">
            <Button onClick={() => (window.location.href = "/validate")}>
              Proceed to Validation
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Upload More Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};













// import React, { useState, useCallback, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { TenantSelector } from "@/components/shared/TenantSelector";
// import { ClaimsTable } from "@/components/shared/ClaimsTable";
// import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
// import { api } from "@/lib/api";

// interface UploadedFile {
//   name: string;
//   size: number;
//   type: string;
//   status: "uploading" | "processing" | "completed" | "error";
//   progress: number;
//   errorMessage?: string;
// }

// export const ClaimsUpload: React.FC = () => {
//   const [selectedTenant, setSelectedTenant] = useState("");
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const [previewClaims, setPreviewClaims] = useState<any[]>([]);

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//   }, []);

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const files = Array.from(e.dataTransfer.files);
//     processFiles(files);
//   }, [selectedTenant]);

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     processFiles(files);
//   };

//   const processFiles = async (files: File[]) => {
//     if (!selectedTenant) {
//       toast({ title: "Select Tenant", description: "Please select a tenant first", variant: "destructive" });
//       return;
//     }

//     const validFiles = files.filter(
//       (file) =>
//         file.type === "text/csv" ||
//         file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
//         file.name.endsWith(".csv") ||
//         file.name.endsWith(".xlsx")
//     );

//     if (validFiles.length === 0) {
//       toast({ title: "Invalid File", description: "Please upload only CSV or XLSX files.", variant: "destructive" });
//       return;
//     }

//     const newFiles: UploadedFile[] = validFiles?.map((file) => ({
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       status: "uploading",
//       progress: 0,
//     }));

//     setUploadedFiles((prev) => [...prev, ...newFiles]);

//     for (let index = 0; index < validFiles.length; index++) {
//       const fileIndex = uploadedFiles.length + index;
//       try {
//         // Show progress halfway
//         setUploadedFiles((prev) => {
//           const updated = [...prev];
//           updated[fileIndex].progress = 50;
//           return updated;
//         });

//         const formData = new FormData();
//         formData.append("file", validFiles[index]);
//         formData.append("tenant_id", selectedTenant);

//         const { data } = await api.post("/upload/claims", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });

//         setUploadedFiles((prev) => {
//           const updated = [...prev];
//           updated[fileIndex].status = "completed";
//           updated[fileIndex].progress = 100;
//           return updated;
//         });

//         toast({
//           title: "Upload Successful",
//           description: `${data?.claims_count} claims uploaded for ${data?.tenant_id}`,
//         });

//         // Fetch preview data from /results
//         const results = await api.get(`/results/${selectedTenant}`);
//         setPreviewClaims(results?.data?.claims || []);
//         setShowPreview(true);
//       } catch (err: any) {
//         setUploadedFiles((prev) => {
//           const updated = [...prev];
//           updated[fileIndex].status = "error";
//           updated[fileIndex].errorMessage = err.response?.data?.detail || "Upload failed";
//           return updated;
//         });
//       }
//     }
//   };

//   const removeFile = (index: number) => {
//     setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return "0 B";
//     const k = 1024;
//     const sizes = ["B", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case "error":
//         return <AlertCircle className="h-4 w-4 text-red-500" />;
//       default:
//         return <FileText className="h-4 w-4 text-blue-500" />;
//     }
//   };

//   const completedFiles = uploadedFiles.filter((f) => f.status === "completed");

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Upload Claims</h1>
//           <p className="text-gray-600">Upload CSV or XLSX files containing claims data for validation</p>
//         </div>
//       </div>

//       {/* Tenant Selection */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Configuration</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="max-w-md">
//             <TenantSelector
//               value={selectedTenant}
//               onValueChange={setSelectedTenant}
//               placeholder="Select a tenant to upload claims for..."
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Upload Area */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Upload Files</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div
//             className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
//               isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
//             } ${!selectedTenant ? "opacity-50 pointer-events-none" : ""}`}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//           >
//             <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//             <div className="space-y-2">
//               <p className="text-lg font-medium text-gray-900">Drag and drop files here, or click to select</p>
//               <p className="text-gray-500">Supports CSV and XLSX files up to 10MB each</p>
//               <div className="pt-4">
//                 <input
//                   type="file"
//                   id="file-upload"
//                   multiple
//                   accept=".csv,.xlsx"
//                   onChange={handleFileSelect}
//                   className="hidden"
//                   disabled={!selectedTenant}
//                 />
//                 <Button asChild disabled={!selectedTenant}>
//                   <label htmlFor="file-upload" className="cursor-pointer">
//                     Select Files
//                   </label>
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {!selectedTenant && (
//             <Alert className="mt-4">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>Please select a tenant before uploading files.</AlertDescription>
//             </Alert>
//           )}
//         </CardContent>
//       </Card>

//       {/* File Upload Status */}
//       {uploadedFiles.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Upload Status</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {uploadedFiles?.map((file, index) => (
//                 <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
//                   <div className="flex-shrink-0">{getStatusIcon(file.status)}</div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between mb-2">
//                       <p className="font-medium text-gray-900 truncate">{file.name}</p>
//                       <div className="flex items-center gap-2">
//                         <Badge variant="secondary">{formatFileSize(file.size)}</Badge>
//                         <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                     {file.status !== "completed" && file.status !== "error" && (
//                       <div className="space-y-1">
//                         <Progress value={file.progress} className="h-2" />
//                         <p className="text-sm text-gray-500">
//                           {file.status === "uploading" ? "Uploading..." : "Processing..."} {file.progress}%
//                         </p>
//                       </div>
//                     )}
//                     {file.status === "completed" && (
//                       <p className="text-sm text-green-600">Upload completed successfully</p>
//                     )}
//                     {file.status === "error" && <p className="text-sm text-red-600">{file.errorMessage}</p>}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Preview */}
//       {showPreview && completedFiles.length > 0 && (
//         <div className="space-y-4">
//           <Alert>
//             <CheckCircle className="h-4 w-4" />
//             <AlertDescription>
//               {completedFiles.length} file(s) uploaded successfully. Preview of uploaded claims:
//             </AlertDescription>
//           </Alert>
//           <ClaimsTable claims={previewClaims} title="Preview - Uploaded Claims" showActions={false} />
//           <div className="flex gap-4">
//             <Button onClick={() => (window.location.href = "/validate")}>Proceed to Validation</Button>
//             <Button variant="outline" onClick={() => setShowPreview(false)}>
//               Upload More Files
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
