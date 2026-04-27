import { HTMLAttributes } from 'react';
import { useDrawer } from './DrawerContext';

export default function DrawerOverlay({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { onClose } = useDrawer();

  return (
    <div
      className={`animate-in fade-in absolute inset-0 bg-black/50 ${className}`.trim()}
      onClick={onClose}
      {...props}
    />
  );
}
