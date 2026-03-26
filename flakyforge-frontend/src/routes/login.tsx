import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "../components/forms/LoginForm";
import { GuestGuard } from "../components/guards/AuthGuard";

export const Route = createFileRoute("/login")({
  component: loginPage,
});

function loginPage() {
  return (
    <GuestGuard>
      <LoginForm />
    </GuestGuard>
  );
}
