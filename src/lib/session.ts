
// lib/session.ts
import { auth } from "@/lib/auth";

export async function getUserSession() {
  const session = await auth();

  if (!session) return null;
  
  const { user } = session;

  return {
    name: user?.name,
    email: user?.email,
    userType: session.user?.userType === "eng" ? "Engenheiro" : "Integrador",
    image: user?.image
  };
}