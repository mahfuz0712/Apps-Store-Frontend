import { forwardRef } from "react";
import PropTypes from "prop-types";
import { cn } from "../utils/cn";
import { Loader2 } from "lucide-react";

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      children,
      className,
      isLoading = false,
      isDisabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded transition-all focus:outline-none";

    const variants = {
      primary:
        "bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white shadow-sm hover:shadow",
      secondary:
        "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm",
      outline:
        "bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
      ghost:
        "bg-transparent text-indigo-600 hover:bg-indigo-50",
      danger:
        "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm hover:shadow",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 rounded",
      md: "text-sm px-4 py-2 rounded-md",
      lg: "text-base px-5 py-2.5 rounded-lg",
      xl: "text-lg px-6 py-3 rounded-lg",
    };

    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          widthClasses,
          isDisabled && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={isDisabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!isLoading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "ghost", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
};

export default Button; 