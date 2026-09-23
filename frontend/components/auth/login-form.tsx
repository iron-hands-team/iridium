"use client";

import { type LoginType, loginSchema } from "@/lib/schemas";
import { FaExclamationTriangle } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
import Input from "../ui/input";
import Btn from "../ui/btn";
import Link from "next/link";

const labelStyles =
  "text-black dark:text-zinc-300 text-sm flex flex-col gap-y-1 w-full";

function LoginForm() {
  const [userData, setUserData] = useState<LoginType>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const validated = loginSchema.safeParse(userData);
    if (validated.success) {
      const response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        window.location.reload();
      } else {
        setError((await response.json()).detail);
      }
    } else {
      setError(validated.error.issues[0].message);
    }
    setLoading(false);
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="border border-zinc-800 p-5 flex flex-col gap-y-5 w-100"
      >
        <Image
          src="/logo.png"
          alt="Iridium logo"
          width={75}
          height={75}
          className="mx-auto"
        />
        <div className="text-lg font-bold text-center">Iridium Login</div>
        <label className={labelStyles}>
          Username
          <Input
            placeholder="123456"
            value={userData.username}
            setValue={(username) => setUserData({ ...userData, username })}
          />
        </label>
        <label className={labelStyles}>
          Password
          <Input
            placeholder="password123"
            value={userData.password}
            setValue={(password) => setUserData({ ...userData, password })}
            type="password"
          />
        </label>
        <Link
          href="/reset"
          className="hover:underline text-black dark:text-zinc-300 text-xs w-fit"
        >
          Forgot your password?
        </Link>
        {error && (
          <div className="text-red-500 text-sm flex gap-x-3 items-center">
            <FaExclamationTriangle size={15} /> {error}
          </div>
        )}
        <Btn text={loading ? "Loading..." : "Log in"} primary />
      </form>
    </div>
  );
}

export default LoginForm;
