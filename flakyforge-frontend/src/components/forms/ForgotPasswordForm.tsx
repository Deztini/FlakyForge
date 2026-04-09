import { Button } from "../Button";
import { Input } from "../Input";
import { Logo } from "../Logo";
import { Lock } from "lucide-react";
import { useForgotPassword, getErrorMessage } from "../../hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../lib/validations/auth.schema";

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const forgotMutation = useForgotPassword();

  const errorMessage = forgotMutation.error
    ? getErrorMessage(forgotMutation.error)
    : null;

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotMutation.mutate({ email: data.email });
  };

  return (
    <div className="min-h-screen w-full bg-[#0F1117] flex items-center justify-center p-4">
      <div className="flex flex-col items-center w-full max-w-100">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <p className="text-[#94A3B8] text-[14px]">
            AI-powered flaky test detection and repair
          </p>
        </div>

        <div className="w-full bg-[#1A1D27] rounded-2xl p-10 border border-[#2D3148]">
          <div className="text-center mb-6">
            <h2 className="text-white text-[20px] font-semibold mb-2">
              Forgot your password?
            </h2>
            <p className="text-[#94A3B8] text-[14px]">
              Enter your email and we'll send you a reset code
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">
              {errorMessage}
            </div>
          )}

          {forgotMutation.isSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg p-3 mb-4">
              Check your email for the reset code!
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Input
                label="Email address"
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                error={errors.email?.message}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || forgotMutation.isPending}
              className="w-full h-11 bg-[#6C63FF] hover:bg-[#5B52E8] transition-colors rounded-lg text-white text-[15px] font-medium mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || forgotMutation.isPending
                ? "Sending..."
                : "Send reset code"}
            </Button>
          </form>

          <p className="text-center text-[#94A3B8] text-[13px] mt-5">
            Remember your password?{" "}
            <Link to="/login" className="text-[#6C63FF] hover:underline">
              Back to login
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t border-[#2D3148]">
            <p className="text-center text-[#94A3B8] text-[12px] flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              We only request read access to your repositories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
