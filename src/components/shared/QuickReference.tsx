import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Video,
} from 'lucide-react';

const errorTypes = [
  {
    icon: CheckCircle,
    label: 'No Error',
    description: 'Claim passed all validations',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    icon: AlertTriangle,
    label: 'Technical Error',
    description: 'Data format, approval, threshold issues',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    icon: AlertCircle,
    label: 'Medical Error',
    description: 'Clinical logic, encounter type issues',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  {
    icon: XCircle,
    label: 'Both Errors',
    description: 'Has technical AND medical errors',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
];

export const QuickReference: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Error Types Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Error Types Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {errorTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${type.borderColor} ${type.bgColor} transition-all hover:shadow-sm`}
              >
                <Icon className={`h-5 w-5 mt-0.5 ${type.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{type.label}</p>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Help & Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-purple-500" />
            Help & Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => window.open('#', '_blank')}
            >
              <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">Documentation</p>
                <p className="text-xs text-gray-500">
                  Complete guide to the validation engine
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => window.open('#', '_blank')}
            >
              <Video className="h-4 w-4 mr-2 text-purple-500" />
              <div className="flex-1">
                <p className="font-medium">Video Tutorial</p>
                <p className="text-xs text-gray-500">
                  Watch a 5-minute walkthrough
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => window.open('mailto:support@humaein.com', '_blank')}
            >
              <HelpCircle className="h-4 w-4 mr-2 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">Support</p>
                <p className="text-xs text-gray-500">
                  Contact our team for help
                </p>
              </div>
            </Button>
          </div>

          {/* Pro Tips */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              💡 Pro Tips
            </p>
            <ul className="space-y-1 text-xs text-blue-800">
              <li>• Upload rules before claims for faster setup</li>
              <li>• Use CSV format for best compatibility</li>
              <li>• Check for duplicates after upload</li>
              <li>• Export results after validation</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};