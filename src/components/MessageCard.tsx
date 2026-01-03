"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import axios from "axios";
import { Message } from "@/models/user.model";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success("Message deleted successfully");
      onMessageDelete(String(message._id));
    } catch (error) {
      console.log("error deleting message", error);
      toast.error("Error deleting message");
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold ">
          {message.content}
        </CardTitle>
        <CardDescription>
          {message.createdAt.toString().slice(0, 10).split("-").reverse().join("-")}
        </CardDescription>
        <CardAction>
          <Dialog>
              <DialogTrigger asChild>
                <Button className="" size={"icon-sm"}>
                  <X />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                  <DialogTitle>Delete message</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this message? This action is
                    irreversible
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleDeleteConfirm} variant={"destructive"}>Delete</Button>
                </DialogFooter>
              </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
