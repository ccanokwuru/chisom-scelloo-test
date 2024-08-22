import type { RouteLocationAsRelativeGeneric, RouteLocationAsPathGeneric } from 'vue-router'

export type Tab = {
  label: string
  name: string
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric
}
