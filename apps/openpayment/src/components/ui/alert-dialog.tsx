
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface AlertDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface AlertDialogContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | undefined>(undefined);

export function AlertDialog({ children, open: externalOpen, onOpenChange }: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(externalOpen || false);
  
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (value: boolean) => {
    setInternalOpen(value);
    onOpenChange?.(value);
  };

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(AlertDialogContext);
  
  if (!context) {
    throw new Error("AlertDialogTrigger must be used within an AlertDialog");
  }
  
  return (
    <button type="button" onClick={() => context.setOpen(true)} {...props}>
      {children}
    </button>
  );
}

export function AlertDialogContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(AlertDialogContext);
  const contentRef = useRef<HTMLDivElement>(null);
  
  if (!context) {
    throw new Error("AlertDialogContent must be used within an AlertDialog");
  }
  
  const { open, setOpen } = context;
  
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open, setOpen]);
  
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div 
        ref={contentRef}
        className={cn("w-full max-w-lg rounded-md bg-white p-6", className)}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

export const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);

export const AlertDialogTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
);

export const AlertDialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

export const AlertDialogAction = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(buttonVariants({ variant: "default" }), className)}
    {...props}
  />
);

export const AlertDialogCancel = ({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const context = React.useContext(AlertDialogContext);
  
  if (!context) {
    throw new Error("AlertDialogCancel must be used within an AlertDialog");
  }
  
  return (
    <button
      className={cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        context.setOpen(false);
      }}
      {...props}
    />
  );
};
