import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("access-token");
  const user = authToken
    ? await fetch(process.env.NEXT_PUBLIC_API_URL + "/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken.value}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }).then((res) => res.json())
    : null;

  return {
    user: user
      ? {
          id: user.username,
          lastName: user.last_name,
          firstName: user.first_name,
          middleName: user.middle_name,
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
  isAdmin?: boolean;
}
