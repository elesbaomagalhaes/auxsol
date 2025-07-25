import { DefaultSession } from "next-auth";

declare module "next-auth" {
  
  interface Session {
    user: {
      image: any;
      id: string;
      name?: string | null;
      email?: string | null;
      userType?: string | null;
    }
  }

  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    userType?: string | null;
  }
}