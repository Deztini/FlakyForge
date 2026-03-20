import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: aboutComponent,
})

function aboutComponent() {
  return <div>Hello "/about"!</div>
}
