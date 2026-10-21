// import type { Role } from '../../../../apps/api/src/generated/prisma/client.js';

// declare global {
//   namespace Express {
//     interface User {
//       id: string;
//       email: string;
//       role: Role;
//       profile: {
//         id: string;
//         firstName: string;
//         lastName: string;
//         bio: string | null;
//       } | null;
//     }

//     interface Request {
//       user?: User;
//     }
//   }
// }

// export {};

// export interface RegisterUserDto {
//     email: string;
//     password: string;
//     profile: {
//         firstName: string;
//         lastName: string;
//         bio?: string;
//     };
// }

// export interface LoginUserDto {
//     email: string;
//     password: string;
// }

export type Role = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    bio: string | null;
  } | null;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    bio?: string;
  };
}

export interface LoginUserDto {
  email: string;
  password: string;
}