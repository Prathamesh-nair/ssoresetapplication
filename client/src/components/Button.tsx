"use client";
import { ArrowBigRight } from "lucide-react";

declare interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  text,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${
        disabled
          ? "bg-green-700 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
      } text-white text-lg font-bold px-8 py-3 rounded-full flex gap-3 items-center`}
    >
      {text}
      <ArrowBigRight />
    </button>
  );
}
