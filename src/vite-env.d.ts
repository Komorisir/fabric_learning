declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const vueComponent: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default vueComponent
}
