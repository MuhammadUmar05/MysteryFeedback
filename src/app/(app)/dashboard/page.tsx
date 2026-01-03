"use client";
import React, { useCallback, useEffect, useState } from "react";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/models/user.model";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageID: string) => {
    setMessages(
      messages.filter((message) => String(message._id) !== messageID)
    );
  };

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(AcceptMessagesSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const response = await axios.get<ApiResponse>("/api/accepting-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages!);
    } catch (error) {
      console.log("fetching message acceptance status error", error);
      toast.error("Failed to fetch message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsSwitchLoading(false);
      setIsLoading(true);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success("Messaged refreshed successfully");
        }
      } catch (error) {
        console.log("Error getting all the messages", error);
        toast.error(`${error}`);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(
        "/api/accepting-messages",
        {
          acceptMessages: !acceptMessages,
        }
      );
      setValue("acceptMessages", !acceptMessages);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("error updating message acceptance status", axiosError);
      toast("Failed to update message settings");
    }
  };

  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    if (!session?.user?.username) return;
    const base = `${window.location.protocol}//${window.location.host}`;
    setProfileUrl(`${base}/u/${session.user.username}`);
  }, [session]);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copied to clipboard");
  };

  return (
    <section className="mt-24 max-w-6xl mx-auto px-4">
      <div className="flex flex-col gap-y-6 md:flex-row md:items-center md:justify-between mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          className="flex gap-2 items-center cursor-pointer w-fit"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <p>Refresh Messages</p>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
        <div className="rounded-2xl border bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-3">Your Anonymous Link</h2>
          <div className="flex items-center gap-2">
            <input
              value={profileUrl || "Loading..."}
              disabled
              className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Share this link to receive anonymous messages.
          </p>
        </div>

        <div className="rounded-2xl border bg-white shadow-sm p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Message Reception</h2>
            <p className="text-sm text-gray-500">
              Turn off to pause incoming messages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              {acceptMessages ? "On" : "Off"}
            </span>
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-20">
            No messages yet — your inbox is peacefully empty.
          </div>
        )}
      </div>
    </section>
  );
};

export default page;
