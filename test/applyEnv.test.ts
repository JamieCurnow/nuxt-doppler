import { describe, it, expect } from 'vitest'
import { _applyEnv } from '../src/utils/applyEnv'

describe('applyEnv', async () => {
  it('applys secrets to the runtime config object', async () => {
    const secrets = {
      NUXT_PUBLIC_FOO: 'publicFoo',
      NUXT_PUBLIC_CAMEL_CASED: 'publicCamelCased',
      NUXT_PUBLIC_DEEP_BAR: 'publicDeepBar',
      NUXT_PUBLIC_DEEP_FOO_BAR: 'publicDeepFooBar',
      NUXT_APP_FOO: 'appFoo',
      NUXT_APP_CAMEL_CASED: 'appCamelCased',
      NUXT_APP_DEEP_BAR: 'appDeepBar',
      NUXT_APP_DEEP_FOO_BAR: 'appDeepFooBar',
      NUXT_FOO: 'foo',
      NUXT_CAMEL_CASED: 'camelCased',
      NUXT_DEEP_BAR: 'deepBar',
      NUXT_DEEP_FOO_BAR: 'deepFooBar'
    }

    const runtimeConfig = {
      public: {
        foo: '',
        camelCased: '',
        deep: {
          bar: '',
          fooBar: ''
        }
      },
      app: {
        foo: '',
        camelCased: '',
        deep: {
          bar: '',
          fooBar: ''
        }
      },
      foo: '',
      camelCased: '',
      deep: {
        bar: '',
        fooBar: ''
      }
    }

    _applyEnv(secrets, runtimeConfig)

    expect(runtimeConfig.public.foo).toBe('publicFoo')
    expect(runtimeConfig.public.camelCased).toBe('publicCamelCased')
    expect(runtimeConfig.public.deep.bar).toBe('publicDeepBar')
    expect(runtimeConfig.public.deep.fooBar).toBe('publicDeepFooBar')
    expect(runtimeConfig.app.foo).toBe('appFoo')
    expect(runtimeConfig.app.camelCased).toBe('appCamelCased')
    expect(runtimeConfig.app.deep.bar).toBe('appDeepBar')
    expect(runtimeConfig.app.deep.fooBar).toBe('appDeepFooBar')
    expect(runtimeConfig.foo).toBe('foo')
    expect(runtimeConfig.camelCased).toBe('camelCased')
    expect(runtimeConfig.deep.bar).toBe('deepBar')
    expect(runtimeConfig.deep.fooBar).toBe('deepFooBar')
  })
})
