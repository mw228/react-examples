import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = "primary", className = "", ...rest }: ButtonProps) {
  return <button {...rest} className={`btn btn--${variant} ${className}`.trim()} />;
}
