import { defineNuxtModule } from '@nuxt/kit'
import DopplerSDK from '@dopplerhq/node-sdk'
import { _applyEnv } from './utils/applyEnv'

export default defineNuxtModule({
  meta: {
    name: 'dopplerSecrets',
    configKey: 'doppler'
  },
  defaults: {
    enabled: true,
    serviceToken: '',
    project: '',
    config: '',
    only: [] as string[],
    exclude: [] as string[],
    debug: false
  },
  async setup(options, nuxt) {
    const { serviceToken, config, enabled, project, only, exclude, debug } = options
    if (!enabled) return

    console.log('Doppler module setting runtimeConfig from doppler secrets 🪛')

    if (!serviceToken) return console.error('Doppler module requires an serviceToken')
    if (!project) return console.error('Doppler module requires a project')
    if (!config) return console.error('Doppler module requires a config')

    // make the doppler client
    if (debug) console.log('Creating doppler client')
    const doppler = new DopplerSDK({ accessToken: serviceToken })

    // only get these secrets if they are in the only array
    const onlySecrets = only?.length ? only.join(',') : undefined

    let secretsListResponse

    try {
      secretsListResponse = await doppler.secrets.list(project, config, {
        accepts: 'application/json',
        secrets: onlySecrets
      })
    } catch (error) {
      throw new Error(`Doppler module error: ${JSON.stringify(error, null, 2)}`)
    }

    if (!secretsListResponse) throw new Error('Doppler secrets list response empty')

    if (debug) console.log('Doppler secrets list response', JSON.stringify(secretsListResponse))

    if (!secretsListResponse.secrets) throw new Error('Doppler secrets list response did not include secrets')

    const dopplerSecrets = secretsListResponse.secrets

    // make an object of the secrets to use [key: secretName]: secretValue
    const kvSectres = Object.keys(dopplerSecrets)
      // filter out any secrets that are in the exclude array
      .filter((key) => !exclude.includes(key))
      .reduce((acc, key) => {
        // we weirdly type cast to USER because the doppler types are not great - this will actually be the secret key
        const value = dopplerSecrets[key as 'USER']?.raw
        if (value) acc[key] = value
        return acc
      }, {} as Record<string, string>)

    if (debug) console.log('Doppler secrets extracted', kvSectres)

    // assign the secrets to the nuxt runtimeConfig
    _applyEnv(kvSectres, nuxt.options.runtimeConfig)

    if (debug) {
      console.log('New runtimeConfig')
      console.log(nuxt.options.runtimeConfig)
    }
  }
})
