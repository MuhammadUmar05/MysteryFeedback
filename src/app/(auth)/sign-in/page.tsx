"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    setIsSubmitting(false);
    if (result?.error) {
      toast.error("Sign In Failed, Please try again");
    } else {
      toast.success("Sign In Successfully");
      router.replace("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md m-4 p-8 bg-white shadow-md border-2 rounded-xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black">
            Welcome Back to Mystery Feedback
          </h1>
          <p className="capitalize text-lg mt-4">
            Sign In to start sending anonymous messages
          </p>
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="ex. johndoe@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="**********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {" "}
                  <Loader2Icon className="animate-spin aspect-square" />{" "}
                  Processing
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          Don't have an account?{" "}
          <Link className="text-blue-600 hover:text-blue-800" href={"/sign-up"}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
