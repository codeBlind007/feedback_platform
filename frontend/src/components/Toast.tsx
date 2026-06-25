"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const onOpenChange = (id: string, open: boolean) => {
    if (!open) {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            open={true}
            onOpenChange={(open) => onOpenChange(t.id, open)}
            duration={4000}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg min-w-70 max-w-100 transition-all duration-300 animate-in slide-in-from-bottom-2",
              t.type === "success"
                ? "border-neutral-200 bg-white text-neutral-900"
                : "border-red-200 bg-red-50 text-red-900"
            )}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-neutral-600" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 text-red-500" />
            )}
            <ToastPrimitive.Description className="flex-1">
              {t.message}
            </ToastPrimitive.Description>
            <ToastPrimitive.Close
              className="ml-2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-100 m-0 flex flex-col p-4 gap-2 w-full max-w-105" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
