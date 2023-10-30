export default defineNuxtConfig({
  modules: ['../src/module'],
  doppler: {
    serviceToken: process.env.DOPPLER_SERVICE_TOKEN,
    project: process.env.DOPPLER_PROJECT,
    config: process.env.DOPPLER_CONFIG
  },
  devtools: { enabled: true }
})
