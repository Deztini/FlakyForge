import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: dashboard,
})

function dashboard() {
  return <div>Hello "/dashboard"!</div>
}
