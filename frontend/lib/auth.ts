import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("access-token");

  let user = null;
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
          id: user.username,
          lastName: user.last_name,
          firstName: user.first_name,
          middleName: user.middle_name,
          role: user.role,
          isAdmin: user.role === "admin",
        }
      : null,
  } as { user: UserType };
}

export interface UserType {
  id: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  role?: string;
  isAdmin?: boolean;
}
