"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MarketingPanel from "./marketing-panel";
import LoginForm from "./login-form";
import MobileNavbar from "./mobile-navbar";
import Loader from "@/components/ui/loader";

const LoginClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    console.log("Login data:", data);
    
    // Simulate a successful login for the UI fix
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard/home");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <Loader />}
      <MobileNavbar />
      <div className="flex-1 grid lg:grid-cols-2">
        <div className=" p-4 h-full">
          <MarketingPanel />
        </div>

        <div className="flex flex-col items-center justify-center bg-white px-8 xl:px-32 py-12">
          <LoginForm
            onSubmit={handleSubmit}
            isPending={isLoading}
          />
          <p className="text-center text-sm mt-8">
            (C) 2025. LSA SCHOOL MANAGEMENT. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginClient;
