/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_IDB_NAME: string
  readonly VITE_IDB_VERSION: string
  readonly VITE_ENABLE_OFFLINE_MODE: string
  readonly VITE_ENABLE_QR_SCANNER: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_MAX_CACHE_SIZE: string
  readonly VITE_CACHE_EXPIRATION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
