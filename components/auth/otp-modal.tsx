"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useOtpUserLogin,
  useGetOtp,
  setAuthCookies,
} from "@/lib/auth/mutations";
import { otpSchema, OtpFormData } from "@/lib/validations/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  username: string;
  onSuccess?: () => void;
  preventRedirect?: boolean;
}

export function OtpModal({
  isOpen,
  onClose,
  email,
  username,
  onSuccess,
  preventRedirect = false,
}: OtpModalProps) {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otpLoginMutation = useOtpUserLogin();
  const { refetch: resendOtp } = useGetOtp(username);

  const handleOtpSubmit = async (data: OtpFormData) => {
    try {
      await otpLoginMutation.mutateAsync(
        { email, otp: data.otp },
        {
          onSuccess: ({ data: responseData }) => {
            toast.success("OTP verified successfully");

            if (!preventRedirect) {
              // Handle redirects based on setup status
              if (
                responseData.setupStatus === "Completed" &&
                !responseData.changePassword
              ) {
                router.push("/dashboard/home");
              } else if (
                responseData.setupStatus === "Completed" &&
                responseData.changePassword
              ) {
                router.push("/change-password");
              } else if (
                responseData.setupStatus === "CompanyCreated" &&
                !responseData.changePassword
              ) {
                router.push("/dashboard/home");
              } else {
                router.push("/kyc");
              }
            }

            onClose();
            onSuccess?.();
          },
        }
      );
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp();
      toast.success("OTP sent successfully");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogDescription>
            We&ve sent a 6-digit code to {email}. Please enter it below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOtpSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="000000"
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={otpLoginMutation.isPending}
              >
                {otpLoginMutation.isPending ? "Verifying..." : "Verify OTP"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                className="w-full"
              >
                Resend OTP
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
