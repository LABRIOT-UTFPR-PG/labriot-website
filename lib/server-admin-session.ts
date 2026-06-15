import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";

export type CurrentAdminActor = {
  userId: string;
  username: string;
};

export async function getCurrentAdminActor() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await verifyAdminSessionToken(token);

    if (typeof session.sub !== "string" || typeof session.username !== "string") {
      return null;
    }

    return {
      userId: session.sub,
      username: session.username,
    } satisfies CurrentAdminActor;
  } catch {
    return null;
  }
}
