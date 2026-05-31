'use client';
import { useEffect, useState } from 'react';

interface FlashProps {
  message: string;
  type: 'success' | 'error';
}

export default function Flash({ message, type }: FlashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className={`flash flash-${type}`}>{message}</div>
  );
}
