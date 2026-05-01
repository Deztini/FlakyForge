import { createFileRoute } from "@tanstack/react-router";
import { RepositoriesPage } from "../../features/repositories/pages/RepositoriesPage";

export const Route = createFileRoute("/_dashboard/repositories")({
  component: RepositoriesPage,
});
