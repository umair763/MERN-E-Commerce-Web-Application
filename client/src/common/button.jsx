import { forwardRef } from "react";

/**
 * Button — Premium button component with modern variants and smooth transitions
 * Features consistent micro-interactions, accessibility, and responsive design
 */
const Button = forwardRef(({ className, variant = "primary", as: Comp = "button", ...props }, ref) => {
  const variantClasses = {
    primary:
      "bg-blue-600 text-white text-base font-semibold rounded-full px-6 py-3 hover:bg-blue-700 shadow-sm hover:shadow-md",
    secondary:
      "bg-transparent text-blue-600 text-base font-semibold rounded-full border border-blue-600 px-6 py-3 hover:bg-blue-50",
    "dark-utility":
      "bg-neutral-900 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-black",
    pearl:
      "bg-neutral-100 text-neutral-600 text-sm font-medium rounded-lg border border-neutral-200 px-4 py-2 hover:bg-neutral-200",
    "store-hero":
      "bg-blue-600 text-white text-lg font-semibold rounded-full px-8 py-4 hover:bg-blue-700 shadow-md hover:shadow-lg",
    "icon-circular":
      "bg-white/80 text-neutral-900 rounded-full w-11 h-11 backdrop-blur-sm hover:bg-white shadow-sm hover:shadow-md",
    link: "bg-transparent text-blue-600 text-base font-semibold underline-offset-4 hover:underline p-0",
    "link-on-dark":
      "bg-transparent text-blue-400 text-base font-semibold underline-offset-4 hover:underline p-0",
    ghost:
      "bg-transparent text-neutral-600 text-base font-medium rounded-full px-4 py-2 hover:bg-neutral-100",
  };

  const baseClasses = "inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

  return (
    <Comp 
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} 
      ref={ref} 
      {...props} 
    />
  );
});

Button.displayName = "Button";

export { Button };
