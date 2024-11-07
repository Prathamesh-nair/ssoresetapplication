"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Logo from "@/components/Logo";
import Image from "next/image";
import HeaderSection from "@/components/HeaderSection";
import FormWrapper from "@/components/FormWrapper";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

export default function ForgotPassword() {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5001/api/searchUser", {
        username: domain,
      });

      console.log(res);
      const empName = res.data?.empName;
      if (res.status === 200) {
        toast.success("User found successfully.");
        localStorage.setItem("username", domain);
        localStorage.setItem("empName", empName);
        router.push(`/domain-reset`);
      } else {
        toast.error(res.data.message || "An error occurred.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Request failed. Try again later.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      {/* LEFT SIDE */}
      <div className="flex flex-col w-1/2 relative">
        <Logo />
        <div className="flex items-center justify-center h-full">
          <Image src="/lock.jpg" alt="Lock Logo" width={700} height={700} />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-[#2D51FF] w-1/2 flex flex-col items-center justify-center rounded-tl-[100px] rounded-bl-[100px] p-10 relative">
        <HeaderSection
          title="Forgot password?"
          subtitle="Don’t worry."
          spantitle="We can help you."
        />

        <FormWrapper onSubmit={handleSubmit}>
          <InputField
            placeholder="Enter your Domain ID"
            value={domain}
            onChange={(e) => setDomain(e.target.value)} // Simplified
            iconSrc="/user.svg"
            type="text"
          />
          <Button
            text={isLoading ? "Loading..." : "Continue"} // Added ellipsis for loading state
            type="submit"
            className="text-white"
            disabled={isLoading}
          />
        </FormWrapper>

        <Toaster position="top-center" richColors />
      </div>
    </div>
  );
}
