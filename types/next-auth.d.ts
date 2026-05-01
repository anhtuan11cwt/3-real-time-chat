import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    image?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      image?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string;
    id?: string;
    image?: string | null;
  }
}
