
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
}

const AccordionContext = React.createContext<{
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  type: "single" | "multiple";
  collapsible: boolean;
}>({
  value: "",
  onValueChange: () => {},
  type: "single",
  collapsible: false,
});

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = "single", collapsible = false, defaultValue, value, onValueChange, ...props }, ref) => {
    const [stateValue, setStateValue] = useState<string | string[]>(defaultValue || (type === "multiple" ? [] : ""));
    
    const handleValueChange = (newValue: string | string[]) => {
      setStateValue(newValue);
      onValueChange?.(newValue);
    };

    const contextValue = {
      value: value !== undefined ? value : stateValue,
      onValueChange: onValueChange || handleValueChange,
      type,
      collapsible,
    };

    return (
      <AccordionContext.Provider value={contextValue}>
        <div ref={ref} className={cn("space-y-1", className)} {...props} />
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-b", disabled && "opacity-50 cursor-not-allowed", className)}
        data-value={value}
        data-disabled={disabled ? true : undefined}
        {...props}
      />
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const { value: contextValue, onValueChange, type, collapsible } = React.useContext(AccordionContext);
  
  const isExpanded = type === "multiple" 
    ? Array.isArray(contextValue) && contextValue.includes(value)
    : contextValue === value;

  const handleClick = () => {
    if (type === "multiple" && Array.isArray(contextValue)) {
      if (isExpanded) {
        if (!collapsible && contextValue.length <= 1) return;
        onValueChange(contextValue.filter(v => v !== value));
      } else {
        onValueChange([...contextValue, value]);
      }
    } else {
      if (isExpanded) {
        if (collapsible) onValueChange("");
      } else {
        onValueChange(value);
      }
    }
  };

  return (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline",
        className
      )}
      onClick={handleClick}
      aria-expanded={isExpanded}
      {...props}
    >
      <div className="flex-1 text-left">{children}</div>
      <ChevronDown className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        isExpanded && "rotate-180"
      )} />
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const { value: contextValue, type } = React.useContext(AccordionContext);
  
  const isExpanded = type === "multiple" 
    ? Array.isArray(contextValue) && contextValue.includes(value)
    : contextValue === value;

  return (
    <div 
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all",
        isExpanded ? "animate-accordion-down" : "animate-accordion-up h-0",
        className
      )}
      data-state={isExpanded ? "open" : "closed"}
      {...props}
    >
      {isExpanded && <div className="pb-4 pt-0">{children}</div>}
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";
