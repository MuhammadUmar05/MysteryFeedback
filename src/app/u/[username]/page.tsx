"use client";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import axios, { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ApiResponse } from "@/types/ApiResponse";
import { Separator } from "@/components/ui/separator";

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const messageContent = form.watch("content");
  const handleMessageTap = (message: string) =>
    form.setValue("content", message);

  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const parseMessageString = (messages: string): Array<string> =>
    messages.split("||");

  const [AImessages, setAIMessages] = useState<Array<string>>(
    parseMessageString(initialMessageString)
  );

  const pathname = usePathname();
  const username = pathname.slice(3);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });
      form.reset();
      toast.success(response.data.message || "Message sent successfully");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Error sending message", axiosError);
      toast.error(
        axiosError.response?.data.message || "Failed to send message"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const suggestNewMessages = async () => {
    setIsSuggesting(true)
    try {
      const response = await axios.post("/api/suggest-messages");
      toast.success("Messages have been refreshed");

      setAIMessages(parseMessageString(response.data.message || []));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Error sending message", axiosError);
      toast.error(
        axiosError.response?.data.message || "Failed to refresh messages"
      );
    } finally{
        setIsSuggesting(false)
    }
  };

  return (
    <div className="max-w-6xl px-4 mx-auto">
      <h1 className="md:text-5xl text-3xl font-bold text-center md:mt-10 mt-6 ">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Message Content</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Type your anonymous message...."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading || !messageContent}>
            {isLoading ? (
              <>
                {" "}
                <Loader2Icon className="animate-spin aspect-square" />{" "}
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </form>
      </Form>
      <div className="flex flex-col items-start mt-12 gap-6">
        <Button onClick={suggestNewMessages} disabled={isSuggesting}>
            {isSuggesting ? (
              <>
                {" "}
                <Loader2Icon className="animate-spin aspect-square" />{" "}
                Suggesting...
              </>
            ) : (
              "Suggest Messages"
            )}
          </Button>
        <div className="flex flex-col gap-4 p-6 border border-gray-300 w-full rounded-lg">
          <p className="font-bold text-xl">Messages</p>
          <div className="flex flex-col gap-4">
            {AImessages.map((message, index) => (
              <p
                key={index}
                onClick={() => handleMessageTap(message)}
                className="font-bold text-center border-gray-300 border py-3 rounded-lg cursor-pointer hover:bg-white/0"
              >
                {message}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
