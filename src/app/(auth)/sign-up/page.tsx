"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckCircle2Icon, Loader2Icon, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 1000);
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const checkUsername = async () => {
    try {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        );
        setUsernameMessage(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setUsernameMessage(
        axiosError.response?.data.message ?? "Error checking username "
      );
    } finally {
      setIsCheckingUsername(false);
    }
  };

  useEffect(() => {
    checkUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/signup", data);
      toast.success("Account created successfully");
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("error signing up", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error("Sign Up Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md m-4 p-8 bg-white shadow-md border-2 rounded-xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black">Welcome to Mystery Feedback</h1>
          <p className="capitalize text-lg mt-4">
            Sign Up to send anonymous messages
          </p>
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="ex. john doe"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription
                    className={`text-sm ${usernameMessage === "username is unique" ? "text-green-500" : "text-red-500"}`}
                  >
                    {isCheckingUsername ? (
                      <Loader2Icon className="animate-spin aspect-square w-4 h-4" />
                    ) : (
                      usernameMessage
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
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
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          Already a member?{" "}
          <Link className="text-blue-600 hover:text-blue-800" href={"/sign-in"}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
