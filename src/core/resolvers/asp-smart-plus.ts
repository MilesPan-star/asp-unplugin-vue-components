import type { ComponentInfo, ComponentResolver, SideEffectsInfo } from '../../types'
import { getPkgVersion, kebabCase } from '../utils'

export interface AspSmartUIPlusResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'

  /**
   * use commonjs lib & source css or scss for ssr
   */
  ssr?: boolean

  /**
   * specify element-plus version to load style
   *
   * @default installed version
   */
  version?: string

  /**
   * auto import for directives
   *
   * @default true
   */
  directives?: boolean

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp

  /**
   * a list of component names that have no styles, so resolving their styles file should be prevented
   */
  noStylesComponents?: string[]

  /**
   * nightly version
   */
  nightly?: boolean
}

type AspSmartUIPlusResolverOptionsResolved = Required<Omit<AspSmartUIPlusResolverOptions, 'exclude'>> &
  Pick<AspSmartUIPlusResolverOptions, 'exclude'>

function getSideEffects(dirName: string, options: AspSmartUIPlusResolverOptionsResolved): SideEffectsInfo | undefined {
  const { importStyle } = options
  const themeFolder = 'asp-smart-ui-plus/theme-chalk'

  if (importStyle === 'sass') {
    return [`${themeFolder}/src/pc/base.scss`, `${themeFolder}/src/pc/${dirName}.scss`]
  }
  else if (importStyle === true || importStyle === 'css') {
    return [`${themeFolder}/pc/base.css`, `${themeFolder}/pc/asp-${dirName}.css`]
  }
}

function resolveComponent(name: string, options: AspSmartUIPlusResolverOptionsResolved): ComponentInfo | undefined {
  if (options.exclude && name.match(options.exclude))
    return

  if (!name.match(/^Asp[A-Z]/))
    return

  if (name.match(/^AspIcon.+/)) {
    return {
      name: name.replace(/^AspIcon/, ''),
      from: '@asp-smart-ui-plus/icons-vue',
    }
  }

  const partialName = kebabCase(name.slice(3))// AspTableColumn -> table-column
  return {
    name,
    from: `asp-smart-ui-plus/es/components/pc/basic/${partialName}/index`,
    sideEffects: getSideEffects(partialName, options),
  }
}

const noStylesComponents = ['AspAutoResizer']

/**
 * Resolver for Element Plus
 *
 * See https://github.com/antfu/vite-plugin-components/pull/28 for more details
 * See https://github.com/antfu/vite-plugin-components/issues/117 for more details
 *
 * @author @develar @nabaonan @sxzz
 * @link https://element-plus.org/ for element-plus
 *
 */
export function AspSmartUIPlusResolver(
  options: AspSmartUIPlusResolverOptions = {},
): ComponentResolver[] {
  let optionsResolved: AspSmartUIPlusResolverOptionsResolved

  async function resolveOptions() {
    if (optionsResolved)
      return optionsResolved
    optionsResolved = {
      ssr: false,
      version: await getPkgVersion('asp-smart-ui-plus', '1.0.11'),
      importStyle: 'css',
      directives: false,
      exclude: undefined,
      noStylesComponents: options.noStylesComponents || [],
      nightly: false,
      ...options,
    }
    return optionsResolved
  }

  return [
    {
      type: 'component',
      resolve: async (name: string) => {
        const options = await resolveOptions()

        if ([...options.noStylesComponents, ...noStylesComponents].includes(name))
          return resolveComponent(name, { ...options, importStyle: false })
        else return resolveComponent(name, options)
      },
    },
  ]
}
