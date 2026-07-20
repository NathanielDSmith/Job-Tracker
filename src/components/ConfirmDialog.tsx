import React from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-bg-card dark:border dark:border-neon-violet/20 rounded-xl shadow-xl dark:shadow-neon-violet/10 max-w-sm w-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">{title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">{message}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 bg-neon-pink hover:bg-pink-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-pink focus:ring-offset-2 dark:focus:ring-offset-bg-card transition-colors duration-200 text-sm font-medium"
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-100 dark:bg-bg-secondary text-slate-600 dark:text-slate-300 py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-bg-card transition-colors duration-200 text-sm font-medium"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
