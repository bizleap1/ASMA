import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext(null);

// Global listeners for outside-react / direct utility calls
let globalToastHandler = null;
let globalConfirmHandler = null;
let globalAlertModalHandler = null;

export const toast = {
  success: (message, title) => globalToastHandler?.({ type: 'success', message, title }),
  error: (message, title) => globalToastHandler?.({ type: 'error', message, title }),
  warning: (message, title) => globalToastHandler?.({ type: 'warning', message, title }),
  info: (message, title) => globalToastHandler?.({ type: 'info', message, title }),
};

export const showConfirm = ({
  title = "Please Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false
}) => {
  if (globalConfirmHandler) {
    return globalConfirmHandler({ title, message, confirmText, cancelText, isDestructive });
  }
  return Promise.resolve(window.confirm(message));
};

export const showAlertModal = ({
  title = "Notice",
  message,
  confirmText = "OK",
  type = "info"
}) => {
  if (globalAlertModalHandler) {
    return globalAlertModalHandler({ title, message, confirmText, type });
  }
  return Promise.resolve(window.alert(message));
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [dialogState, setDialogState] = useState(null); // { isOpen, title, message, type, confirmText, cancelText, isDestructive, resolve }

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', message, title, duration = 4500 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, type, message, title, duration };
    setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5 toasts visible

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const promptConfirm = useCallback(({
    title = "Confirmation",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false
  }) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        isConfirm: true,
        title,
        message,
        confirmText,
        cancelText,
        isDestructive,
        resolve: (result) => {
          setDialogState(null);
          resolve(result);
        }
      });
    });
  }, []);

  const promptAlert = useCallback(({
    title = "Notice",
    message,
    confirmText = "Understood",
    type = "info"
  }) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        isConfirm: false,
        title,
        message,
        confirmText,
        type,
        resolve: () => {
          setDialogState(null);
          resolve();
        }
      });
    });
  }, []);

  // Register global singletons & intercept native window.alert
  useEffect(() => {
    globalToastHandler = addToast;
    globalConfirmHandler = promptConfirm;
    globalAlertModalHandler = promptAlert;

    // Failsafe: intercept native window.alert to prevent ugly browser popups anywhere!
    const originalAlert = window.alert;
    window.alert = (msg) => {
      addToast({
        type: 'warning',
        title: 'Advait Academy',
        message: String(msg)
      });
    };

    return () => {
      globalToastHandler = null;
      globalConfirmHandler = null;
      globalAlertModalHandler = null;
      window.alert = originalAlert;
    };
  }, [addToast, promptConfirm, promptAlert]);

  return (
    <NotificationContext.Provider value={{ toast, showConfirm, showAlert: promptAlert, addToast }}>
      {children}

      {/* Toast Notification Container (Top-Center / Responsive) */}
      <div 
        aria-live="polite" 
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2.5 w-full max-w-md px-4 pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="pointer-events-auto w-full rounded-xl bg-[#FAF8F5] border border-[#173D2B]/15 shadow-[0_12px_32px_rgba(23,61,43,0.18)] p-3.5 sm:p-4 overflow-hidden relative backdrop-blur-md"
            >
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className="shrink-0 mt-0.5">
                  {item.type === 'success' && (
                    <div className="w-8 h-8 rounded-lg bg-[#173D2B]/10 text-[#173D2B] flex items-center justify-center border border-[#173D2B]/20">
                      <svg className="w-5 h-5 text-[#173D2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {item.type === 'error' && (
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  {item.type === 'warning' && (
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center border border-amber-200">
                      <svg className="w-5 h-5 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  )}
                  {item.type === 'info' && (
                    <div className="w-8 h-8 rounded-lg bg-[#173D2B]/10 text-[#173D2B] flex items-center justify-center border border-[#173D2B]/20">
                      <svg className="w-5 h-5 text-[#173D2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#173D2B] tracking-tight">
                      {item.title || (item.type === 'success' ? 'Success' : item.type === 'error' ? 'Notice' : item.type === 'warning' ? 'Attention' : 'ASMA Notification')}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#8C6D1F]">
                      ASMA
                    </span>
                  </div>
                  <p className="text-[13px] text-[#2E2A27] font-normal leading-snug mt-1 break-words">
                    {item.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => removeToast(item.id)}
                  className="shrink-0 p-1 text-[#173D2B]/40 hover:text-[#173D2B] hover:bg-[#173D2B]/5 rounded-md transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Accent Left Bar */}
              <div 
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  item.type === 'success' ? 'bg-[#173D2B]' :
                  item.type === 'error' ? 'bg-red-500' :
                  item.type === 'warning' ? 'bg-[#D4AF37]' :
                  'bg-[#173D2B]'
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Dialog for Confirmations / Critical Alerts */}
      <AnimatePresence>
        {dialogState?.isOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dialogState.resolve(false)}
              className="absolute inset-0 bg-[#061810]/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="relative w-full max-w-md bg-[#FAF8F5] rounded-2xl border border-[#173D2B]/15 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 overflow-hidden z-10"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#173D2B] via-[#D4AF37] to-[#173D2B]" />

              <div className="flex items-start gap-4 mt-1">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  dialogState.isDestructive 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'bg-[#173D2B]/10 text-[#173D2B] border border-[#173D2B]/20'
                }`}>
                  {dialogState.isDestructive ? (
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-[#173D2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-[17px] font-bold text-[#173D2B] leading-tight">
                    {dialogState.title}
                  </h3>
                  <p className="text-[14px] text-[#4A433E] mt-2 leading-relaxed">
                    {dialogState.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#173D2B]/10">
                {dialogState.isConfirm && (
                  <button
                    type="button"
                    onClick={() => dialogState.resolve(false)}
                    className="px-4 py-2.5 rounded-lg text-[13px] font-semibold text-[#173D2B] hover:bg-[#173D2B]/5 border border-[#173D2B]/20 transition-all active:scale-95"
                  >
                    {dialogState.cancelText}
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => dialogState.resolve(true)}
                  className={`px-5 py-2.5 rounded-lg text-[13px] font-bold text-white shadow-md transition-all active:scale-95 ${
                    dialogState.isDestructive
                      ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                      : 'bg-[#173D2B] hover:bg-[#115234] shadow-[#173D2B]/25'
                  }`}
                >
                  {dialogState.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
