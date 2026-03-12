'use client';

import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !loading) onCancel();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const confirmBg =
    variant === 'danger'
      ? 'bg-danger text-white hover:bg-danger/90'
      : 'bg-gold text-charcoal hover:bg-gold-light';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current && !loading) onCancel();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-lg max-w-sm w-full p-8 animate-in zoom-in-95 fade-in duration-200">
        <h3 className="text-[22px] font-display font-semibold text-charcoal mb-2">
          {title}
        </h3>
        <p className="text-[14px] font-body text-charcoal/60 leading-relaxed mb-8">
          {description}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="
              flex-1 h-12 rounded-xl border border-border
              text-[14px] font-body font-medium text-charcoal/60
              hover:bg-surface-sunken transition-colors
              disabled:opacity-50
            "
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              flex-1 h-12 rounded-xl
              text-[14px] font-body font-medium
              transition-all duration-200
              disabled:opacity-50
              ${confirmBg}
            `}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                Processing…
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
