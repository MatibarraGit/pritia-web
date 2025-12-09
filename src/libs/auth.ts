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
  rateLimit: {
    enabled: true,
    max: 10,
    window: 60, // seconds
    customRules: {
      "/auth/sign-in": {
        window: 60,
        max: 2,
      }
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 30 days
    updateAge: 60 * 60 * 24, // 1 day (Cada 1 día se actualiza la expiración de la sesión)
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false // Para que el usuario no pueda cambiar su rol
      }
    }
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
    nextCookies(),
    // phoneNumber({
    //     sendOTP: ({ phoneNumber, code }, ctx) => {
    //         // Implement sending OTP code via SMS
    //     }
    // })
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;