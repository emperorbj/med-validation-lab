import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Loader2, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StepCardProps {
  stepNumber: number;
  title: string;
  status: 'complete' | 'active' | 'pending' | 'ready';
  icon: React.ReactNode;
  description: string;
  tasks: string[];
  actionLabel: string;
  actionUrl: string;
  accentColor: 'blue' | 'purple' | 'orange' | 'green';
}

const statusConfig = {
  complete: {
    icon: CheckCircle,
    badge: 'Complete',
    badgeVariant: 'default' as const,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  active: {
    icon: PlayCircle,
    badge: 'Next Step',
    badgeVariant: 'default' as const,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  ready: {
    icon: Circle,
    badge: 'Ready',
    badgeVariant: 'secondary' as const,
    iconColor: 'text-gray-400',
    bgColor: 'bg-gray-50',
  },
  pending: {
    icon: Loader2,
    badge: 'Pending',
    badgeVariant: 'outline' as const,
    iconColor: 'text-gray-300',
    bgColor: 'bg-gray-50',
  },
};

const accentColors = {
  blue: 'border-l-blue-500 hover:border-l-blue-600',
  purple: 'border-l-purple-500 hover:border-l-purple-600',
  orange: 'border-l-orange-500 hover:border-l-orange-600',
  green: 'border-l-green-500 hover:border-l-green-600',
};

export const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  status,
  icon,
  description,
  tasks,
  actionLabel,
  actionUrl,
  accentColor,
}) => {
  const navigate = useNavigate();
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card
      className={`relative border-l-4 ${accentColors[accentColor]} transition-all duration-300 hover:shadow-lg group`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500">
                  Step {stepNumber}
                </span>
                <Badge variant={config.badgeVariant} className="text-xs">
                  {config.badge}
                </Badge>
              </div>
              <h3 className="text-xl font-bold mt-1">{title}</h3>
            </div>
          </div>
          <StatusIcon className={`h-6 w-6 ${config.iconColor}`} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{description}</p>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            What you'll do:
          </p>
          <ul className="space-y-1.5">
            {tasks.map((task, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={() => navigate(actionUrl)}
          className="w-full mt-4 group-hover:shadow-md transition-shadow"
          variant={status === 'active' ? 'default' : 'outline'}
          disabled={status === 'pending'}
        >
          {actionLabel}
          <span className="ml-2">→</span>
        </Button>
      </CardContent>
    </Card>
  );
};