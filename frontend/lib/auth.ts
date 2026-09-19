export async function getSession() {
  //TODO: await fetch();
  return {
    user: { id: "0", firstName: "Admin", lastName: "Admin", isAdmin: true },
  } as { user: UserType };
}

export interface UserType {
  id: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  isAdmin?: boolean;
}
