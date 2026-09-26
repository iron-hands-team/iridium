import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import type { UserResponse, UserType } from "@/types/user";
import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("access-token");

  let user: UserResponse | null = null;
  if (authToken) {
    const res = await fetch(`${process.env.INTERNAL_API_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (res.ok) {
      user = await res.json();
    }
  }

  return {
    user: user
      ? {
          username: user.username,
          lastName: user.last_name,
          firstName: user.first_name,
          middleName: user.middle_name,
          role: user.role,
        }
      : null,
    cookie: authToken,
  } as { user: UserType; cookie: RequestCookie };
}
