/**
 * This handles setting the right keys in the runtimeConfig object from the doppler secrets
 *
 * It's mostly a direct copy of https://github.com/unjs/nitro/blob/main/src/runtime/config.ts
 *
 * There are some interesting ways that Nuxt maps env vars to runtime config keys so we do the same
 * as they do internally to map the env vars to the right keys.
 */

import { snakeCase } from 'scule'
import destr from 'destr'

// get env prefix
const _inlineRuntimeConfig = process.env.RUNTIME_CONFIG as any
const ENV_PREFIX = 'NITRO_'
const ENV_PREFIX_ALT = _inlineRuntimeConfig?.nitro?.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? '_'

// get the value from the doppler secrets for a given key
function _getEnv(dopplerSecrets: Record<string, string>, key: string) {
  const envKey = snakeCase(key).toUpperCase()
  return destr(dopplerSecrets[ENV_PREFIX + envKey] ?? dopplerSecrets[ENV_PREFIX_ALT + envKey])
}

// check if the input is an object
function _isObject(input: unknown) {
  return typeof input === 'object' && !Array.isArray(input)
}

/**
 * Apply the doppler secrets to the runtime config object deeply.
 */
export function _applyEnv(
  dopplerSecrets: Record<string, string>,
  runtimeConfig: Record<string, any>,
  parentKey = ''
) {
  for (const key in runtimeConfig) {
    const subKey = parentKey ? `${parentKey}_${key}` : key
    const envValue = _getEnv(dopplerSecrets, subKey)
    if (_isObject(runtimeConfig[key])) {
      if (_isObject(envValue)) {
        runtimeConfig[key] = { ...runtimeConfig[key], ...(envValue as any) }
      }
      _applyEnv(dopplerSecrets, runtimeConfig[key], subKey)
    } else {
      runtimeConfig[key] = envValue ?? runtimeConfig[key]
    }
  }
  return runtimeConfig
}
