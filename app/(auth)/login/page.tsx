import { Suspense } from "react";
import LoginClient from "./_components/login-client";
import Loader from "@/components/ui/loader";

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginClient />
    </Suspense>
  );
}
