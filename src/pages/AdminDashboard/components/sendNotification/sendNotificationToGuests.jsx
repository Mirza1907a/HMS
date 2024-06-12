import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

import { useRoomTypeContext } from "@/hooks/useRoomTypeContext";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { useAddRoom } from "@/hooks/useAddRoom";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Check, CheckCheckIcon, Cross, X } from "lucide-react";
import { MemberCombobox } from "@/components/ui/membercombobox";
import { useSendNotification } from "@/hooks/useSendNotification";
import { Switch } from "@/components/ui/switch";
import { MultipleMemberCombobox } from "@/components/multipleMemberCombobox";

export const SendNotificationToGuests = () => {
  // Form States

  const [selectedRecipients, setSelecteRecipients] = useState([]);
  const [sendAll, setsendAll] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { sendNotification, isLoading, responseG, error } =
    useSendNotification();

  const { toast } = useToast();

  const [notiData, setNotiData] = useState({
    title,
    description,
    selectedRecipients,
    reciever: "guest",
    sendAll,
  });
  useEffect(() => {
    setNotiData({
      title,
      description,
      selectedRecipients,
      reciever: "guest",
      sendAll,
    });
  }, [title, selectedRecipients, sendAll, description]);

  const handleselectedRecipientsChange = (ids) => {
    setSelecteRecipients(ids);
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  }, [error]);

  useEffect(() => {
    if (responseG) {
      toast({
        title: "Notifications sent to guest(s)!",
        description: responseG.data.message,
      });

      setTitle("");
      setSelecteRecipients([]);
      setDescription("");
      setsendAll(false);
    }
  }, [responseG]);

  return (
    <Card className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendNotification(notiData);
        }}
      >
        <CardHeader>
          <CardTitle className="text-2xl">
            Send Notification To Guests.
          </CardTitle>
          <CardDescription>
            Please enter the notification details below to send notification to
            guests.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input
              required
              type="text"
              placeholder="Hello!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              required
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Select Guest</Label>
            <MultipleMemberCombobox
              disabled={sendAll}
              onSelectedMemberChange={handleselectedRecipientsChange}
            />
            <div className="flex flex-row items-center gap-2">
              <Switch
                checked={sendAll}
                onCheckedChange={() => setsendAll((p) => !p)}
              />
              <Label>Send to every guest?</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              !title ||
              !description ||
              (selectedRecipients.length === 0 && !sendAll)
            }
          >
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              <>Send Notification</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
