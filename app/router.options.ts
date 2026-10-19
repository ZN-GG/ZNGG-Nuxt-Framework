import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior: () => ({ left: 0, top: 0 }),
}
