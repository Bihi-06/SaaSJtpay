
import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "checked"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false);
    
    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCheckedState = event.target.checked;
      if (checked === undefined) {
        setIsChecked(newCheckedState);
      }
      onCheckedChange?.(newCheckedState);
      props.onChange?.(event);
    };
    
    return (
      <div className={cn("inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[checked=true]:bg-primary data-[checked=false]:bg-input", 
        className
      )} data-checked={isChecked}>
        <input 
          ref={ref}
          type="checkbox" 
          className="sr-only" 
          checked={isChecked}
          onChange={handleChange}
          {...props}
        />
        <span 
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[checked=true]:translate-x-5 data-[checked=false]:translate-x-0"
          )}
          data-checked={isChecked}
        />
      </div>
    );
  }
);

Switch.displayName = "Switch";
