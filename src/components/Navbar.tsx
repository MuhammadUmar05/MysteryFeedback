"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  return (
    <nav className="fixed top-0 right-0 w-full px-4 py-5 shadow-md flex items-center justify-between bg-black text-white">
      <div className="flex relative items-center justify-between max-w-6xl  mx-auto w-full">
        <Link href={"/dashboard"}>
          <h1 className="md:text-3xl text-2xl font-bold">MysteryFeedback</h1>
        </Link>
        {session ? (
          <>
            <span className="sm:inline  hidden">
              Welcome {user.username || user.email}
            </span>
            <Button className="dark" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <Link href={"/sign-in"}>
            <Button className="dark">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
