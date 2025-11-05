import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as C from "@radix-ui/react-checkbox";
import { Check, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const CheckboxGroup= React.forwardRef<
  React.ElementRef<typeof C.Root>,
  React.ComponentPropsWithoutRef<typeof C.Root>
>(({ className, ...props }, ref) => {
  return <C.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
CheckboxGroup.displayName = C.Root.displayName;

const CheckboxGroupItem = React.forwardRef<
  React.ElementRef<typeof C.Checkbox>,
  React.ComponentPropsWithoutRef<typeof C.Checkbox>
>(({ className, ...props }, ref) => {
  return (
    <C.Checkbox
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-sm border border-primary ring-offset-background " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground " +
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
    )}
      {...props}
    >
      <C.Indicator className="flex items-center justify-center text-primary-foreground">
        <Check className="h-3 w-3" />
      </C.Indicator>
    </C.Checkbox>
  );
});
CheckboxGroupItem.displayName = C.Checkbox.displayName;

export { CheckboxGroup, CheckboxGroupItem };