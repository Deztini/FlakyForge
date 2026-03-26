import { createFileRoute } from "@tanstack/react-router";
import { GuestGuard } from "../components/guards/AuthGuard";
import { SignupForm } from "../components/forms/SignupForm";

export const Route = createFileRoute("/signup")({
  component: signupPage,
});

function signupPage() {
  return (
    <GuestGuard>
      <SignupForm />
    </GuestGuard>
  );
}
