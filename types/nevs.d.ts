declare global {
  namespace NodeJS {
    interface ProcessEnv {
      //PUBLIC
      NEXT_PUBLIC_WEB_URL: string;
      //AUTH
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
      JWT_SECRET: string;
      //AZURE
      STORAGE_RESOURCE_NAME: string;
      AZURE_STORAGE_ACCESS_KEY: string;

      // SLACK
      SLACK_BOT_TOKEN: string;
      // FIREBASE

      NEXT_PUBLIC_FB_API_KEY: string;
      NEXT_PUBLIC_FB_AUTH_DOMAIN: string;
      NEXT_PUBLIC_FB_PROJECT_ID: string;
      NEXT_PUBLIC_FB_STORAGE_BUCKET: string;
      NEXT_PUBLIC_FB_MESSAGING_SENDER_ID: string;
      NEXT_PUBLIC_FB_APP_ID: string;
      NEXT_PUBLIC_FB_MEASUREMENT_ID: string;

      FCM_SERVER_KEY: string;

      NEXT_PUBLIC_FB_MESSAGING_KEY: string;

      //SENDGRID

      SENDGRID_API_KEY: string;
      SENDGRID_FROM: string;
    }
  }
}
export {};
