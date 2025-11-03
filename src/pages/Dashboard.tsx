import React, { useState, useEffect } from 'react';
import { StepCard } from '@/components/shared/StepCard';
import { ProgressIndicator } from '@/components/shared/ProgressIndicator';
import { QuickReference } from '@/components/shared/QuickReference';
import {
  FileText,
  Upload,
  Play,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState(1);

  // Optional: Load saved tenant to determine current step
  useEffect(() => {
    const savedTenant = localStorage.getItem('selectedTenant');
    if (savedTenant) {
      // If tenant is selected, user is likely past step 1
      setCurrentStep(2);
    }
  }, []);

  const steps = [
    {
      stepNumber: 1,
      title: 'Upload Rules',
      status: 'active' as const,
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      description:
        'Upload technical and medical validation rules. These rules define how claims are validated against healthcare standards.',
      tasks: [
        'Select your tenant (hospital_A, hospital_B, hospital_C)',
        'Upload Technical Rules document (PDF/CSV)',
        'Upload Medical Rules document (PDF/CSV)',
        'Rules are stored and ready for validation',
      ],
      actionLabel: 'Go to Rules Upload',
      actionUrl: '/rules',
      accentColor: 'blue' as const,
    },
    {
      stepNumber: 2,
      title: 'Upload Claims',
      status: 'ready' as const,
      icon: <Upload className="h-5 w-5 text-purple-500" />,
      description:
        'Upload your claims file containing patient encounters, services, and billing information.',
      tasks: [
        'Select the same tenant used for rules',
        'Upload claims file (CSV, XLS, or XLSX format)',
        'Preview uploaded claims in the table',
        'System automatically checks for duplicate claim IDs',
        'Remove duplicates if needed',
      ],
      actionLabel: 'Go to Claims Upload',
      actionUrl: '/upload',
      accentColor: 'purple' as const,
    },
    {
      stepNumber: 3,
      title: 'Run Validation',
      status: 'ready' as const,
      icon: <Play className="h-5 w-5 text-orange-500" />,
      description:
        'Execute the validation engine to check claims against your uploaded rules. This process is fast and automated.',
      tasks: [
        'Select your tenant',
        'Click "Run Validation" button',
        'Technical validation checks (approvals, thresholds, formats)',
        'Medical validation checks (encounter types, facility rules)',
        'Errors are categorized as technical, medical, or both',
        'Detailed explanations generated for each error',
      ],
      actionLabel: 'Go to Validation',
      actionUrl: '/validate',
      accentColor: 'orange' as const,
    },
    {
      stepNumber: 4,
      title: 'View Results',
      status: 'ready' as const,
      icon: <BarChart3 className="h-5 w-5 text-green-500" />,
      description:
        'Review detailed validation results, analytics, and error reports. Export data for further analysis.',
      tasks: [
        'View claim-by-claim validation results',
        'See detailed error explanations and recommendations',
        'Analyze error distribution with charts',
        'Access synthesized error reports',
        'Export results to CSV for reporting',
        'Check analytics dashboard for insights',
      ],
      actionLabel: 'View Results',
      actionUrl: '/results',
      accentColor: 'green' as const,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-900">
            Welcome to RCM Validation Engine
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Getting Started Guide
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your complete claims validation workflow in 4 simple steps.
          Follow this guide to validate healthcare claims with ease.
        </p>
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} totalSteps={4} />

      {/* Info Alert */}
      <Alert className="max-w-4xl mx-auto bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-900">
          <strong>👋 New here?</strong> Start with Step 1 to upload your validation rules.
          Each step builds on the previous one, so follow them in order for the best experience.
        </AlertDescription>
      </Alert>

      {/* Step Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {steps.map((step) => (
          <StepCard key={step.stepNumber} {...step} />
        ))}
      </div>

      {/* Quick Reference */}
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Quick Reference
        </h2>
        <QuickReference />
      </div>

      {/* System Info Footer */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            System Features
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600">
            <span>✓ Multi-tenant support</span>
            <span>✓ Duplicate detection</span>
            <span>✓ Real-time validation</span>
            <span>✓ Detailed error reports</span>
            <span>✓ Export capabilities</span>
            <span>✓ Analytics dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
}