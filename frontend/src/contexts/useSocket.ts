import { useContext } from 'react';
import { SocketContext } from './SocketContext';
import type { SocketContextType } from '../types/index';

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
