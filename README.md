# asp-unplugin-vue-components

- 基于 unplugin-vue-components 魔改而来，支持 asp-smart-ui-plus 组件库的自动导入
- 使用的话直接看 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 的文档即可

# example

```js
// rsbuild.config.ts
import { AspSmartUIPlusResolver } from 'asp-unplugin-vue-components/resolvers'
import UnpluginVueComponents from 'asp-unplugin-vue-components/rspack'
export default defineConfig({
  // ...

  tools: {
    rspack: {
      plugins: [
        unpluginAutoImport({
          imports: ['vue'],
          resolvers: [AspSmartUIPlusResolver()],
          dts: 'src/auto-imports.d.ts'
        }),
        unpluginVueComponents({
          resolvers: [AspSmartUIPlusResolver()],
          dts: 'src/components.d.ts'
        }),
      ],
    },
  },
})
```
