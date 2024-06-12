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

import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useSendNotification } from "@/hooks/useSendNotification";
import { Switch } from "@/components/ui/switch";
import { StaffCombobox } from "@/components/ui/combobox";

export const SendNotificationToStaffs = () => {
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
    reciever: "staff",
    sendAll,
  });
  useEffect(() => {
    setNotiData({
      title,
      description,
      selectedRecipients,
      reciever: "staff",
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
        title: "Notifications sent to staff(s)!",
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
            Send Notification To Staffs.
          </CardTitle>
          <CardDescription>
            Please enter the notification details below to send notification to
            staffs.
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
            <StaffCombobox
              disabled={sendAll}
              onSelectedStaffsChange={handleselectedRecipientsChange}
            />
            <div className="flex flex-row items-center gap-2">
              <Switch
                checked={sendAll}
                onCheckedChange={() => setsendAll((p) => !p)}
              />
              <Label>Send to every staff?</Label>
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
