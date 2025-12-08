import { createAuthClient } from "better-auth/react";
import { nextCookies } from 'better-auth/next-js';

// import { phoneNumberClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [
    // phoneNumberClient()
    nextCookies()
  ]
})

export const {
  signIn,
  signOut,
  signUp,
  useSession
} = authClient;