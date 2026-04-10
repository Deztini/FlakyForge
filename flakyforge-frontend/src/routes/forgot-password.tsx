import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "../components/forms/ForgotPasswordForm";
import { GuestGuard } from "../components/guards/AuthGuard";

export const Route = createFileRoute("/forgot-password")({
  component: forgotPasswordPage,
});

function forgotPasswordPage() {
  return (
    <GuestGuard>
      <ForgotPasswordForm />
    </GuestGuard>
  );
}