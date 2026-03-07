import { cn } from "../../lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { HTMLAttributes, ReactNode } from "react";

const buttonVariants = cva(
  "flex items-center justify-center rounded-lg font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]",
  {
    variants: {
      variant: {
        // ** FILLED
        default:
          "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg focus:ring-indigo-500",
        danger:
          "bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg focus:ring-red-500",
        cancel:
          "bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300 focus:ring-gray-300",

        // ** OUTLINE
        outline:
          "border-2 border-indigo-600 bg-transparent text-indigo-700 hover:bg-indigo-600 hover:text-white hover:shadow-md focus:ring-indigo-500",
      },
      size: {
        default: "px-5 py-3 text-base",
        sm: "px-4 py-2 text-sm",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends
    HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
  type?: "submit" | "button" | "reset";
}

const Button = ({
  variant,
  size,
  fullWidth,
  isLoading,
  className,
  children,
  type,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
      disabled={isLoading}
    >
      {isLoading ? (
        <svg
          className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
