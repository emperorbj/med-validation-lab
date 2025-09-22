// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { Badge } from '@/components/ui/badge';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { TenantSelector } from '../components/shared/TenantSelector';
// import { Play, CheckCircle, AlertTriangle, XCircle, FileText, Clock, BarChart3 } from 'lucide-react';

// interface ValidationSummary {
//   totalClaims: number;
//   validClaims: number;
//   invalidClaims: number;
//   warningClaims: number;
//   processingTime: string;
//   rulesApplied: number;
// }

// export const Validate: React.FC = () => {
//   const [selectedTenant, setSelectedTenant] = useState('');
//   const [isValidating, setIsValidating] = useState(false);
//   const [validationProgress, setValidationProgress] = useState(0);
//   const [currentStep, setCurrentStep] = useState('');
//   const [validationComplete, setValidationComplete] = useState(false);
//   const [validationSummary, setValidationSummary] = useState<ValidationSummary | null>(null);

//   const mockSummary: ValidationSummary = {
//     totalClaims: 1250,
//     validClaims: 1050,
//     invalidClaims: 125,
//     warningClaims: 75,
//     processingTime: '2m 34s',
//     rulesApplied: 47
//   };

//   const validationSteps = [
//     'Initializing validation engine...',
//     'Loading claims data...',
//     'Applying business rules...',
//     'Checking data integrity...',
//     'Validating CPT codes...',
//     'Verifying insurance information...',
//     'Generating validation report...',
//     'Validation complete!'
//   ];

//   const handleRunValidation = () => {
//     if (!selectedTenant) {
//       alert('Please select a tenant before running validation.');
//       return;
//     }

//     setIsValidating(true);
//     setValidationProgress(0);
//     setValidationComplete(false);
    
//     // Simulate validation process
//     let stepIndex = 0;
//     const interval = setInterval(() => {
//       if (stepIndex < validationSteps.length) {
//         setCurrentStep(validationSteps[stepIndex]);
//         setValidationProgress((stepIndex + 1) * (100 / validationSteps.length));
//         stepIndex++;
//       } else {
//         clearInterval(interval);
//         setIsValidating(false);
//         setValidationComplete(true);
//         setValidationSummary(mockSummary);
//       }
//     }, 800);
//   };

//   const resetValidation = () => {
//     setValidationComplete(false);
//     setValidationSummary(null);
//     setValidationProgress(0);
//     setCurrentStep('');
//   };

//   const getSuccessRate = () => {
//     if (!validationSummary) return 0;
//     return Math.round((validationSummary.validClaims / validationSummary.totalClaims) * 100);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Validate Claims</h1>
//           <p className="text-gray-600">Run validation rules against uploaded claims data</p>
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
//               placeholder="Select tenant to validate claims for..."
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Validation Status */}
//       {selectedTenant && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <FileText className="h-5 w-5" />
//               Claims Data Status
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-blue-600">Total Claims</p>
//                     <p className="text-2xl font-bold text-blue-900">1,250</p>
//                   </div>
//                   <FileText className="h-8 w-8 text-blue-500" />
//                 </div>
//               </div>
              
//               <div className="bg-green-50 p-4 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-green-600">Ready for Validation</p>
//                     <p className="text-2xl font-bold text-green-900">1,250</p>
//                   </div>
//                   <CheckCircle className="h-8 w-8 text-green-500" />
//                 </div>
//               </div>
              
//               <div className="bg-purple-50 p-4 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-purple-600">Active Rules</p>
//                     <p className="text-2xl font-bold text-purple-900">47</p>
//                   </div>
//                   <BarChart3 className="h-8 w-8 text-purple-500" />
//                 </div>
//               </div>
//             </div>
            
//             <Alert className="mt-4">
//               <CheckCircle className="h-4 w-4" />
//               <AlertDescription>
//                 Claims data is loaded and ready for validation. All business rules are active.
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//         </Card>
//       )}

//       {/* Validation Control */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Run Validation</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {!isValidating && !validationComplete && (
//               <div className="text-center py-8">
//                 <Play className="mx-auto h-16 w-16 text-blue-500 mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Validate</h3>
//                 <p className="text-gray-600 mb-6">
//                   Click the button below to start the validation process for all uploaded claims.
//                 </p>
//                 <Button 
//                   onClick={handleRunValidation}
//                   disabled={!selectedTenant}
//                   size="lg"
//                   className="px-8"
//                 >
//                   <Play className="h-4 w-4 mr-2" />
//                   Run Validation
//                 </Button>
//               </div>
//             )}

//             {isValidating && (
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//                     <Clock className="h-8 w-8 text-blue-600 animate-spin" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Validation in Progress</h3>
//                   <p className="text-gray-600">{currentStep}</p>
//                 </div>
                
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Progress</span>
//                     <span>{Math.round(validationProgress)}%</span>
//                   </div>
//                   <Progress value={validationProgress} className="h-3" />
//                 </div>
//               </div>
//             )}

//             {validationComplete && validationSummary && (
//               <div className="space-y-6">
//                 <div className="text-center">
//                   <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//                     <CheckCircle className="h-8 w-8 text-green-600" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Validation Complete!</h3>
//                   <p className="text-gray-600">
//                     Processed {validationSummary.totalClaims.toLocaleString()} claims in {validationSummary.processingTime}
//                   </p>
//                 </div>

//                 {/* Results Summary */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-green-600">Valid Claims</p>
//                         <p className="text-2xl font-bold text-green-900">{validationSummary.validClaims.toLocaleString()}</p>
//                       </div>
//                       <CheckCircle className="h-8 w-8 text-green-500" />
//                     </div>
//                   </div>
                  
//                   <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-yellow-600">Warnings</p>
//                         <p className="text-2xl font-bold text-yellow-900">{validationSummary.warningClaims.toLocaleString()}</p>
//                       </div>
//                       <AlertTriangle className="h-8 w-8 text-yellow-500" />
//                     </div>
//                   </div>
                  
//                   <div className="bg-red-50 p-4 rounded-lg border border-red-200">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-red-600">Invalid Claims</p>
//                         <p className="text-2xl font-bold text-red-900">{validationSummary.invalidClaims.toLocaleString()}</p>
//                       </div>
//                       <XCircle className="h-8 w-8 text-red-500" />
//                     </div>
//                   </div>
                  
//                   <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-blue-600">Success Rate</p>
//                         <p className="text-2xl font-bold text-blue-900">{getSuccessRate()}%</p>
//                       </div>
//                       <BarChart3 className="h-8 w-8 text-blue-500" />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Quick Stats */}
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <span className="text-gray-600">Processing Time:</span>
//                       <span className="ml-2 font-medium">{validationSummary.processingTime}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Rules Applied:</span>
//                       <span className="ml-2 font-medium">{validationSummary.rulesApplied}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-4 justify-center">
//                   <Button onClick={() => window.location.href = '/results'} size="lg">
//                     <FileText className="h-4 w-4 mr-2" />
//                     View Detailed Results
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     onClick={() => window.location.href = '/analytics'} 
//                     size="lg"
//                   >
//                     <BarChart3 className="h-4 w-4 mr-2" />
//                     View Analytics
//                   </Button>
//                   <Button variant="outline" onClick={resetValidation}>
//                     Run Again
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };




import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TenantSelector } from "@/components/shared/TenantSelector";
import {
  Play,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Clock,
  BarChart3,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface ValidationSummary {
  totalClaims: number;
  validatedClaims: number;
  errorClaims: number;
  warningClaims?: number;
  processing_time: number;
  rulesApplied?: number;
}

export const Validate: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [validationComplete, setValidationComplete] = useState(false);
  const [validationSummary, setValidationSummary] =
    useState<ValidationSummary | null>(null);

  const validationSteps = [
    "Initializing validation engine...",
    "Loading claims data...",
    "Applying business rules...",
    "Checking data integrity...",
    "Validating CPT codes...",
    "Verifying insurance information...",
    "Generating validation report...",
    "Validation complete!",
  ];

  const handleRunValidation = async () => {
    if (!selectedTenant) {
      toast({
        title: "Missing Tenant",
        description: "Please select a tenant before running validation.",
        variant: "destructive",
      });
      return;
    }
    setIsValidating(true);
    setValidationProgress(0);
    setValidationComplete(false);

    // Simulated step progress
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < validationSteps.length) {
        setCurrentStep(validationSteps[stepIndex]);
        setValidationProgress(((stepIndex + 1) / validationSteps.length) * 100);
        stepIndex++;
      }
    }, 500);

    try {
      const { data } = await api.post(
         `/validate?tenant_id=${encodeURIComponent(selectedTenant)}`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );

      clearInterval(stepInterval);
      setIsValidating(false);
      setValidationComplete(true);

      const summary: ValidationSummary = {
        totalClaims: data.total_claims,
        validatedClaims: data.validated_claims,
        errorClaims: data.error_claims,
        warningClaims: data.warning_claims || 0,
        processing_time: data.processing_time,
        rulesApplied: data.rules_applied || 0,
      };

      setValidationSummary(summary);
      toast({
        title: "Validation Complete",
        description: `Processed ${summary.totalClaims} claims for ${selectedTenant}`,
      });
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsValidating(false);
      toast({
        title: "Validation Failed",
        description:
          err.response?.data?.detail || "An error occurred during validation.",
        variant: "destructive",
      });
    }
  };

  const resetValidation = () => {
    setValidationComplete(false);
    setValidationSummary(null);
    setValidationProgress(0);
    setCurrentStep("");
  };

  const getSuccessRate = () => {
    if (!validationSummary) return 0;
    return Math.round(
      (validationSummary.validatedClaims / validationSummary.totalClaims) * 100
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Validate Claims</h1>
          <p className="text-gray-600">
            Run validation rules against uploaded claims data
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
              onValueChange={setSelectedTenant}
              placeholder="Select tenant to validate claims for..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Run Validation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Run Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isValidating && !validationComplete && (
              <div className="text-center py-8">
                <Play className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Validate</h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to start validating all uploaded claims.
                </p>
                <Button
                  onClick={handleRunValidation}
                  disabled={!selectedTenant}
                  size="lg"
                  className="px-8"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run Validation
                </Button>
              </div>
            )}

            {isValidating && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Clock className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Validation in Progress
                  </h3>
                  <p className="text-gray-600">{currentStep}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(validationProgress)}%</span>
                  </div>
                  <Progress value={validationProgress} className="h-3" />
                </div>
              </div>
            )}

            {validationComplete && validationSummary && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Validation Complete!
                  </h3>
                  <p className="text-gray-600">
                    Processed {validationSummary.totalClaims.toLocaleString()}{" "}
                    claims in {validationSummary.processing_time}s
                  </p>
                </div>

                {/* Results Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border">
                    <p className="text-sm font-medium text-green-600">
                      Validated
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {validationSummary.validatedClaims.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border">
                    <p className="text-sm font-medium text-red-600">Errors</p>
                    <p className="text-2xl font-bold text-red-900">
                      {validationSummary.errorClaims.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border">
                    <p className="text-sm font-medium text-blue-600">
                      Success Rate
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {getSuccessRate()}%
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border">
                    <p className="text-sm font-medium text-purple-600">
                      Rules Applied
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {validationSummary.rulesApplied}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => (window.location.href = `/results/${selectedTenant}`)}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = `/analytics/${selectedTenant}`)}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" onClick={resetValidation}>
                    Run Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
