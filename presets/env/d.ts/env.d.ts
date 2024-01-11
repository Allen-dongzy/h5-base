/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_LOCAL_URL_PREFIX: string
  readonly VITE_APP_SERVER_URL_PREFIX: string
  readonly VITE_APP_API_URL_PREFIX: string
  readonly VITE_APP_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}