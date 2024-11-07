"use client";

declare interface HeaderProps {
  title: string;
  subtitle?: string;
  spantitle?: string;
}

export default function HeaderSection({
  title,
  subtitle,
  spantitle,
}: HeaderProps) {
  return (
    <div className="absolute top-52 left-52">
      <h1 className="flex flex-col text-5xl font-extrabold text-[#FF7300] mb-2">
        <p>{title}</p>
      </h1>
      <p className="text-lg text-white mb-6">
        {subtitle}{" "}
        <span className="text-[#FF7300] font-extrabold">{spantitle}</span>
      </p>
    </div>
  );
}
