"use client";

declare interface FormWrapperProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormWrapper({ children, onSubmit }: FormWrapperProps) {
  return (
    <form className="w-full max-w-md" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
