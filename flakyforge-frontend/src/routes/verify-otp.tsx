import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useVerifyOtp, useResendOtp, getErrorMessage } from "../hooks/useAuth";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";

type VerifyOtpSearch = { email: string };

export const Route = createFileRoute("/verify-otp")({
  validateSearch: (search: Record<string, unknown>): VerifyOtpSearch => ({
    email: String(search.email ?? ""),
  }),
  component: VerifyOtpPage,
});

const OTP_LENGTH = 6;

function VerifyOtpPage() {
  const { email } = Route.useSearch();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  const errorMessage =
    verifyMutation.error
      ? getErrorMessage(verifyMutation.error)
      : resendMutation.error
      ? getErrorMessage(resendMutation.error)
      : null;

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const arr = [...digits];
    arr[i] = val.slice(-1);
    setDigits(arr);

    if (val && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();

    const code = arr.join("");
    if (code.length === OTP_LENGTH) verifyMutation.mutate({ email, code });
  };

  const handleResend = () => {
    resendMutation.mutate(email, {
      onSuccess: () => {
        setCountdown(60);
        setDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center p-4">
      <div className="w-full max-w-105">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <p className="text-[#94A3B8] text-sm">
            We sent a code to <strong>{email || "your email"}</strong>
          </p>
        </div>

        <div className="bg-[#1A1D27] border border-[#2D3148] rounded-2xl p-10 text-center">
          <h1 className="text-white text-xl font-semibold mb-2">
            Verify your email
          </h1>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">
              {errorMessage}
            </div>
          )}

          {verifyMutation.isSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg p-3 mb-4">
              Email verified! Redirecting…
            </div>
          )}

          <div className="flex justify-center gap-3 my-6">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(i, e.target.value)}
                disabled={verifyMutation.isPending || verifyMutation.isSuccess}
                className="w-12 h-14 text-center text-xl font-bold bg-[#0F1117] border border-[#2D3148] rounded-lg text-white focus:border-[#6C63FF] outline-none"
              />
            ))}
          </div>

          {countdown > 0 ? (
            <p className="text-[#94A3B8] text-sm">
              Resend code in <strong>{countdown}s</strong>
            </p>
          ) : (
            <Button
              onClick={handleResend}
              className="text-[#6C63FF] hover:underline text-sm"
            >
              Resend code
            </Button>
          )}

          <p className="mt-6 text-[#94A3B8] text-sm">
            <Link to="/login" className="text-[#6C63FF] hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}