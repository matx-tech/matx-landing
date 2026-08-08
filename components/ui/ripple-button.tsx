'use client';

import { useRef } from 'react';
import { useRippleEffect } from '@/lib/hooks/use-ripple-effect';
import { cn } from '@/lib/utils';

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function RippleButton({
  children,
  onClick,
  className,
  variant = 'primary',
  size = 'md',
}: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ripplesRef = useRef<HTMLDivElement>(null);
  const createRipple = useRippleEffect();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    onClick?.();
  };

  const baseStyles =
    'relative overflow-hidden inline-flex items-center justify-center font-medium transition-all focus-ring-target';

  const variants = {
    primary: 'bg-primary text-text-inverse hover:bg-primary/90',
    secondary:
      'bg-surface text-text-primary border border-border hover:bg-surface/80 hover:border-primary',
    outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg min-h-[44px]',
    md: 'px-6 py-3 text-base rounded-xl min-h-[44px]',
    lg: 'px-8 py-4 text-lg rounded-xl min-h-[44px]',
  };

  return (
    <button
      type='button'
      ref={buttonRef}
      onClick={handleClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      <span className='relative z-10'>{children}</span>
      <span ref={ripplesRef} className='absolute inset-0 pointer-events-none' />
    </button>
  );
}
