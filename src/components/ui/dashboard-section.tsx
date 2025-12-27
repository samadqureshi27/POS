"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Separator } from './separator';
import {
  ChevronRight,
  MoreHorizontal,
  Settings,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';

export interface DashboardSectionProps {
  title: string;
  subtitle?: string;
  priority?: 'high' | 'medium' | 'low';
  expandable?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
  onExpand?: () => void;
  onSettings?: () => void;
  rightActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  subtitle,
  priority = 'medium',
  expandable = false,
  collapsible = false,
  defaultExpanded = true,
  onToggleVisibility,
  onExpand,
  onSettings,
  rightActions,
  children,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [isVisible, setIsVisible] = React.useState(true);

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-blue-100 text-blue-800',
    low: 'bg-gray-100 text-gray-800'
  };

  const handleToggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (newState && onExpand) {
      onExpand();
    }
  };

  const handleToggleVisibility = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    if (onToggleVisibility) {
      onToggleVisibility(newState);
    }
  };

  if (!isVisible) {
    return (
      <div className="flex items-center justify-between p-4 border border-dashed border-gray-300 rounded-sm bg-gray-50">
        <div className="flex items-center gap-3">
          <EyeOff size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">{title} (Hidden)</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleVisibility}
          className="text-xs"
        >
          Show Section
        </Button>
      </div>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleExpanded}
                className="p-1 h-6 w-6"
              >
                <ChevronRight
                  size={14}
                  className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </Button>
            )}

            <div>
              <CardTitle className="flex items-center gap-2">
                {title}
                <Badge className={priorityColors[priority]}>
                  {priority}
                </Badge>
              </CardTitle>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {rightActions}

            {expandable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExpand}
                className="text-xs"
              >
                <TrendingUp size={14} className="mr-1" />
                Expand
              </Button>
            )}

            {onToggleVisibility && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleVisibility}
                className="p-1 h-6 w-6"
              >
                <Eye size={14} />
              </Button>
            )}

            {onSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSettings}
                className="p-1 h-6 w-6"
              >
                <Settings size={14} />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
            >
              <MoreHorizontal size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <>
          <Separator className="mx-6" />
          <CardContent className="pt-4">
            {children}
          </CardContent>
        </>
      )}
    </Card>
  );
};

// Predefined section layouts for your POS requirements
export const DailySalesSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DashboardSection
    title="Daily Sales Operations"
    subtitle="Real-time tactical metrics for day-to-day management"
    priority="high"
    collapsible={true}
    defaultExpanded={true}
  >
    {children}
  </DashboardSection>
);

export const CEOInsightsSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DashboardSection
    title="Strategic Performance"
    subtitle="High-level metrics for business decisions"
    priority="medium"
    expandable={true}
    collapsible={true}
    defaultExpanded={true}
  >
    {children}
  </DashboardSection>
);

export const InventorySection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DashboardSection
    title="Inventory Management"
    subtitle="Stock levels, waste tracking, and variance reports"
    priority="high"
    collapsible={true}
    defaultExpanded={true}
  >
    {children}
  </DashboardSection>
);

export const StaffPerformanceSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DashboardSection
    title="Staff Performance"
    subtitle="Team productivity and order fulfillment metrics"
    priority="medium"
    collapsible={true}
    defaultExpanded={false}
  >
    {children}
  </DashboardSection>
);