import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Clock, CheckCircle, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for uploaded rules
const mockRulesData = [
  {
    id: 1,
    tenantId: "TENANT_001",
    tenantName: "Regional Medical Center",
    uploadTime: "2024-01-15 10:30:00",
    technicalRules: true,
    medicalRules: true,
    status: "active",
  },
  {
    id: 2,
    tenantId: "TENANT_002", 
    tenantName: "City Healthcare Network",
    uploadTime: "2024-01-14 16:45:00",
    technicalRules: true,
    medicalRules: false,
    status: "pending",
  },
];

export default function Rules() {
  const [selectedTenant, setSelectedTenant] = useState("");
  const [technicalFile, setTechnicalFile] = useState<File | null>(null);
  const [medicalFile, setMedicalFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (type: "technical" | "medical", file: File | null) => {
    if (type === "technical") {
      setTechnicalFile(file);
    } else {
      setMedicalFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedTenant) {
      toast({
        title: "Missing Tenant",
        description: "Please select a tenant before uploading",
        variant: "destructive",
      });
      return;
    }

    if (!technicalFile && !medicalFile) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one rules file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Upload Successful",
            description: "Rules have been uploaded and are being processed",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rules Management</h1>
        <p className="text-muted-foreground">
          Upload and manage validation rules for different tenants
        </p>
      </div>

      {/* Upload Section */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Rules
          </CardTitle>
          <CardDescription>
            Upload technical and medical validation rules for your tenants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tenant Selection */}
          <div className="space-y-2">
            <Label htmlFor="tenant">Select Tenant</Label>
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a tenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TENANT_001">Regional Medical Center</SelectItem>
                <SelectItem value="TENANT_002">City Healthcare Network</SelectItem>
                <SelectItem value="TENANT_003">Metro Health System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Areas */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Technical Rules */}
            <div className="space-y-2">
              <Label>Technical Rules</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop technical rules file here or click to browse
                </p>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.json"
                  onChange={(e) => handleFileChange("technical", e.target.files?.[0] || null)}
                  className="hidden"
                  id="technical-upload"
                />
                <Label htmlFor="technical-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>Select File</span>
                  </Button>
                </Label>
                {technicalFile && (
                  <p className="text-xs text-primary mt-2">
                    Selected: {technicalFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Medical Rules */}
            <div className="space-y-2">
              <Label>Medical Rules</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop medical rules file here or click to browse
                </p>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.json"
                  onChange={(e) => handleFileChange("medical", e.target.files?.[0] || null)}
                  className="hidden"
                  id="medical-upload"
                />
                <Label htmlFor="medical-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>Select File</span>
                  </Button>
                </Label>
                {medicalFile && (
                  <p className="text-xs text-primary mt-2">
                    Selected: {medicalFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || (!technicalFile && !medicalFile)}
            className="btn-healthcare"
          >
            {isUploading ? "Uploading..." : "Upload Rules"}
          </Button>
        </CardContent>
      </Card>

      {/* Rules Table */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Uploaded Rules
          </CardTitle>
          <CardDescription>
            View and manage rules for all tenants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRulesData.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{rule.tenantName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Tenant ID: {rule.tenantId}
                    </p>
                  </div>
                  <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                    {rule.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {rule.technicalRules ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>Technical Rules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {rule.medicalRules ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>Medical Rules</span>
                    </div>
                  </div>
                  <span className="text-muted-foreground">
                    Uploaded: {rule.uploadTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}