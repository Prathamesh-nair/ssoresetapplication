"use client";
import Image from "next/image";

declare interface InputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.FormEvent) => void;
  iconSrc?: string;
  type?: string;
}

export default function InputField({
  placeholder,
  value,
  onChange,
  iconSrc,
  type,
}: InputProps) {
  return (
    <div className="flex items-center w-full bg-white rounded-lg shadow-md p-4 mb-6">
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-gray-500 text-lg"
        value={value}
        onChange={onChange}
      />
      {iconSrc && (
        <div className="ml-3">
          <Image src={iconSrc} alt="Icon" width={30} height={30} />
        </div>
      )}
    </div>
  );
}
