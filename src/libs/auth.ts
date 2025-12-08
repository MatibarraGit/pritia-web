import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { phoneNumber } from 'better-auth/plugins';
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
      enabled: true,
    //   async sendResetPassword(data, request) {
    //       // Send an email to the user with a link to reset their password
    //   },
  },
//   socialProviders: {
//       google: {
//           clientId: process.env.GOOGLE_CLIENT_ID!,
//           clientSecret: process.env.GOOGLE_CLIENT_SECRET!
//       },
//       facebook: {
//           clientId: process.env.FACEBOOK_CLIENT_ID!,
//           clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
//       },
//       apple: {
//           clientId: process.env.APPLE_CLIENT_ID!,
//           clientSecret: process.env.APPLE_CLIENT_SECRET!
//       }
//   },
  plugins: [
    // phoneNumber({
    //     sendOTP: ({ phoneNumber, code }, ctx) => {
    //         // Implement sending OTP code via SMS
    //     }
    // })
    nextCookies()
  ]
});