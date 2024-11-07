import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="absolute top-0 left-0 p-6">
      <Link href="/" passHref>
        <Image src="/Logo.png" alt="Angel Logo" width={400} height={400} />
      </Link>
    </div>
  );
}
