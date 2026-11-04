export * from "./auth/user.schema.js";


export  {
     loginSchema,
     registerSchema,
     verifyEmailSchema,
     resendVerificationSchema,
     resetPasswordSchema,
     logoutSchema,
     forgotPasswordSchema

 } from "./auth/auth.schema.js";

 export type {
    LoginInput,
    RegisterInput,
    LogoutInput,
    ForgotPasswordInput,
    ResetPasswordInput
  } from "./auth/auth.schema.js";