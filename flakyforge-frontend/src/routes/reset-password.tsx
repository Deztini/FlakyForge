import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordForm } from "../components/forms/ResetPasswordForm";
import { GuestGuard } from "../components/guards/AuthGuard";

export const Route = createFileRoute("/reset-password")({
  component: resetPasswordPage,
});

function resetPasswordPage() {
  return (
    <GuestGuard>
      <ResetPasswordForm />
    </GuestGuard>
  );
}