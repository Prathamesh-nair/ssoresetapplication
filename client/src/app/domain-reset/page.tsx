"use client";
import Button from "@/components/Button";
import FormWrapper from "@/components/FormWrapper";
import HeaderSection from "@/components/HeaderSection";
import InputField from "@/components/InputField";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sentOtp, setSentOtp] = useState(""); // Store sent OTP
  const router = useRouter();
  const hasFetched = useRef(false);

  const sendOtp = async () => {
    setIsLoading(true); // Start loading
    const username = localStorage.getItem("username");
    const empName = localStorage.getItem("empName");
    try {
      const response = await axios.post("http://localhost:5001/api/sendOTP", {
        username,
        empName,
      });
      console.log("SendOTP Response: ", response);

      if (response.data.success) {
        setSentOtp(response.data.otp); // Assume the server sends back the OTP
        toast.success("OTP sent successfully");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to send OTP");
      } else {
        toast.error("An error occurred while sending OTP");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      sendOtp();
    }
  }, []);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const username = localStorage.getItem("username");
    try {
      const response = await axios.post(
        "http://localhost:5001/api/validatecredentials",
        {
          username: username,
          enteredOtp: enteredOtp,
          password: password,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data?.Message);
        console.log(response.data.Message);
        // Redirect to another page if needed
      } else if (response.status === 403) {
        toast.error(response.data?.Message);
        console.log(response.data.Message);
      } else if (response.status === 404) {
        toast.error(response.data?.Message);
        console.log(response.data.Message);
      } else {
        console.log("Something went wrong. Kindly contact Administrator.");
      }
    } catch (error) {
      // Add detailed error logging
      if (error.response) {
        console.error("API Error:", error.response.data);
        toast.error(error.response.data.Message || "Error in catch block");
      } else if (error.request) {
        console.error("Request Error:", error.request);
        toast.error("No response received from server");
      } else {
        console.error("Error:", error.message);
        toast.error("Error occurred: " + error.message);
      }
    } finally {
      setIsLoading(false);
      // localStorage.removeItem("username");
      localStorage.removeItem("empName");
    }
  };

  return (
    <div className="h-screen flex">
      {/* LEFT SIDE */}
      <div className="flex flex-col items-center justify-evenly w-1/2 relative">
        <Logo />
        <div className="flex flex-col items-start justify-center h-full text-[#727272] px-6 gap-32">
          <div>
            <p className="font-bold text-[24px]">Important Information</p>
            <p>
              Please <span className="font-bold">read the information</span>{" "}
              below and then kindly share the requested information.
            </p>
          </div>
          {/* Information List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Password Requirements
            </h3>
            <ul className="list-disc list-inside">
              <li className="mb-4">
                <span className="font-bold text-sm">Minimum Length: </span>
                Password must be at least 8 characters long.
              </li>
              <li className="mb-4">
                <span className="font-bold  text-sm">Complexity: </span>
                Must include at least one uppercase letter, one lowercase
                letter, one numeric digit, and one special character (e.g.,{" "}
                <code>!</code>, <code>@</code>, <code>#</code>).
              </li>
              <li className="mb-4">
                <span className="font-bold text-sm">Password History: </span>
                You cannot reuse any of your previous 24 passwords.
              </li>
              <li className="mb-4">
                <span className="font-bold text-sm">Sequential Digits: </span>
                Passwords with sequential numbers (e.g., <code>
                  123456
                </code>, <code>987654</code>) are not permitted.
              </li>
              <li className="mb-4">
                <span className="font-bold text-sm">
                  Account Name Restriction:{" "}
                </span>
                Passwords must not contain your user account name.
              </li>
              <li className="mb-4">
                <span className="font-bold text-sm">
                  No Letter or Number Sequences:{" "}
                </span>
                Avoid common patterns or sequences of letters and numbers, such
                as <code>Pass@123</code> or <code>Angel@123</code>.
              </li>
            </ul>
          </div>

          <p>
            <span className="font-bold">Support: </span>
            ITSupportDesk@angelbroking.com
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-[#2D51FF] w-1/2 flex flex-col items-center justify-center rounded-tl-[100px] rounded-bl-[100px] p-10 relative">
        <HeaderSection title="Domain Password Reset" />

        <FormWrapper onSubmit={handleSubmit}>
          <InputField
            placeholder="Enter the OTP"
            type="text"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
          />
          <InputField
            placeholder="Enter the new Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <InputField
            placeholder="Re-enter the new Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="text"
          />
          <div className="flex gap-4">
            {isLoading ? (
              <Button
                className="text-white"
                text="Loading"
                type="submit"
                disabled
              />
            ) : (
              <Button text="Submit" type="submit" />
            )}
          </div>
        </FormWrapper>

        <Toaster position="top-center" richColors />
      </div>
    </div>
  );
}
