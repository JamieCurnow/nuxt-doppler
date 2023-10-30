# Doppler Nuxt Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Integrate your Doppler secrets into your Nuxt build for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-doppler?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- ⛰ &nbsp;Minimal setup
- 🚠 &nbsp;Secure

## Quick Setup

1. Add `nuxt-doppler` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-doppler

# Using yarn
yarn add --dev nuxt-doppler

# Using npm
npm install --save-dev nuxt-doppler
```

2. Add `nuxt-doppler` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ['nuxt-doppler']
})
```

3. Configure the doppler module:

```js
export default defineNuxtConfig({
  modules: ['nuxt-doppler'],

  doppler: {
    // your Doppler service token
    serviceToken: process.env.DOPPLER_SERVICE_TOKEN,
    // your Doppler project name
    project: 'your-doppler-project',
    // your Doppler config name
    config: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  }
})
```

4. Add to your `runtimeConfig` in `nuxt.config.ts`. Any keys in the `runtimeConfig` will be mapped to your Doppler secrets. [Read about runtime config here](https://nuxt.com/docs/guide/going-further/runtime-config).

`NUXT_PUBLIC_YOUR_VAR => runtimeConfig.public.yourVar.`

```js
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      yourVar: ''
    }
  },

  modules: ['nuxt-doppler'],

  doppler: {
    // your Doppler service token
    serviceToken: process.env.DOPPLER_SERVICE_TOKEN,
    // your Doppler project name
    project: 'your-doppler-project',
    // your Doppler config name
    config: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  }
})
```

That's it! Your secrets will now be available to use in Nuxt! ✨

## Configuration

### `serviceToken`

`string` - **Required**

This is your Doppler service token for the doppler project/config. [Generate your key](https://docs.doppler.com/docs/service-tokens). It's recommended that you use an environment variable to store this. This environment variable is only required in the build process for your nuxt app. It should not be in the runtime process.

### `project`

`string` - **Required**

This is the name of the doppler project that you want to access secrets from.

### `config`

`string` - **Required**

This is the name of the doppler config in the doppler project that you want to access secrets from. Doppler has a project => config hierarchy. You can have multiple configs in a project. This allows you to have different secrets for different environments.

It's usual that you will have a different config for local dev / staging / production environments. You can use any method to get the correct config string, but using `process.env.NODE_ENV` is an easy way to do so as Nuxt will automatically set this to `production` in a production build.

```js
doppler: {
  //...
  config: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}
```

Another way to do this would be to set an `ENV` environment variable in your build process. This is usefull if you have more than one production-like environment.

```bash
ENV=staging npm run build
```

```js
doppler: {
  //...
  config: process.env.ENV
}
```

### `enabled`

`boolean` - **Default: `true`**

Just enables / disables the module. This is useful if you want to disable the module in a certain environment. Defaults to `true`.

### `only`

`string[]` - **Optional**

This is a string array of Doppler secrets to fetch from the Doppler API. If this is set, only these secrets will be fetched and mapped to the runtimeConfig object. If this is not set, all secrets will be fetched, but only secrets that can be mapped to the runtimeConfig object will be mapped.

### `exclude`

`string[]` - **Optional**

This is a string array of Doppler secrets to exclude from mapping to the runtimeConfig object. This is useful if you want to only use certain Doppler secrets and get the rest from env vars as usual.

### `debug`

`boolean` - **Default: `false`**

This will enable debug mode. This will log out the Doppler secrets that are fetched from the Doppler API. This is useful for debugging.

## Further Reading

The way this module works is by using the Doppler API with the provided `serviceToken` to fetch secrets for the given Doppler project/config. It then loops deeply over your `runtimeConfig`objct and maps any fetched Dopper secrets to the runtime config object, setting them as plain strings. This is the same things that Nuxt does internally with your process env vars.

This all happens at build time which means that you don't need to have any env vars exposed at run time.

Because this happens at build time, your build process / ci will need to have access to the Doppler `serviceToken`. It's recommended that you expose this servixce token through and environment variable at build time. This can be done with Action secrets in github actions for example. It means that you only need to expose and maintain this one secret in your build pipeline and everything else is managed be Doppler.

The way the runtimeConfig works in Nuxt is that nuxt will first look for an environment variable matching the runtimeConfig key. If it finds one, it will use that. If it doesn't find one, it will use the default value in the runtimeConfig object.

This module is run **after** Nuxt does this. So it will take precedence over any environment variables that you have set.

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-doppler/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-doppler

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-doppler.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-doppler

[license-src]: https://img.shields.io/npm/l/nuxt-doppler.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-doppler

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
