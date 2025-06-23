/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_API_URL: string; 


    // Add any other environment variables you use here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }