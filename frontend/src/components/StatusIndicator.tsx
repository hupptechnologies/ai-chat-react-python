import React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/solid';
import type { AppStatus } from '../types/chat';

interface StatusIndicatorProps {
  status: AppStatus;
  error?: string | null;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, error }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'idle':
        return {
          icon: CheckCircleIcon,
          text: 'Ready',
          className: 'status-idle',
        };
      case 'loading':
        return {
          icon: ClockIcon,
          text: 'AI is thinking...',
          className: 'status-loading',
        };
      case 'error':
        return {
          icon: ExclamationTriangleIcon,
          text: error || 'Error occurred',
          className: 'status-error',
        };
      default:
        return {
          icon: CheckCircleIcon,
          text: 'Ready',
          className: 'status-idle',
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`status-indicator ${config.className}`}>
      <IconComponent className="status-icon" />
      <span className="status-text">{config.text}</span>
    </div>
  );
};
