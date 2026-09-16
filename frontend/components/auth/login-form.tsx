"use client";

import { type LoginType, loginSchema } from "@/lib/schemas";
import { useState } from "react";
import Input from "../ui/input";
import Btn from "../ui/btn";
import Link from "next/link";

function LoginForm() {
  const [userData, setUserData] = useState<LoginType>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    const validated = loginSchema.safeParse(userData);
    if (validated.success) {
      //TODO: await fetch
    } else {
      setError(validated.error.issues[0].message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* TODO: school logo here */}
      <div>School Name</div>
      <label>
        Username
        <input
          value={userData.username}
          onChange={(e) =>
            setUserData({ ...userData, username: e.target.value })
          }
        />
        <Input />
      </label>
      <label>
        Password
        <input
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        />
        <Input />
      </label>
      <Link href="/reset">Forgot your password?</Link>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}

export default LoginForm;
