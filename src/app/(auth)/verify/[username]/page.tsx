"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { verifySchema } from "@/schemas/verifySchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
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
const page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsSubmitting(true)
      await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast.success("Account verified successfully");
      router.replace("/sign-in");
    } catch (error) {
      console.error("error signing up", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage ?? "Verification failed, Try again!");
    } finally{
      setIsSubmitting(false)
    }
  };
  return (
    <div className="min-h-screen w-full overflow-hidden flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md m-4 p-8 bg-white shadow-md border-2 rounded-xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black">Verify Your Account </h1>
          <p className="mt-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="ex. 123456" {...field} />
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
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
