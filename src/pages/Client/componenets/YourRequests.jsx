import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useTaskContext } from "@/hooks/useTaskContext";
import axios from "axios";
import { formatDate, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

export const YourRequest = ({ roomNumber, bookingId }) => {
  const { user } = useAuthContextProvider();
  const { guestTasks, dispatch, wakeUpCalls } = useTaskContext();
  const [selected, setSelected] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    const fetchYourRequest = async () => {
      try {
        const response = await axios(
          `/api/guestReq/get_guest_requests/${user._id}`
        );
        if (response.status === 200) {
          dispatch({
            type: "SET_GUEST_TASKS",
            payload: response.data.GuestRequests,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    const fetchWakeUpCalls = async () => {
      try {
        const response = await axios(
          `/api/wakeUp/get_wakeup_calls/${user._id}`
        );
        if (response.status === 200) {
          dispatch({
            type: "SET_WAKEUP_CALLS",
            payload: response.data.wakeUpCalls,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (user) {
      fetchWakeUpCalls();
      fetchYourRequest();
    }
  }, [user]);

  const handleSelect = () => {
    setSelected(!selected);
  };
  const cancelWakeUpCall = async (id) => {
    try {
      const response = await axios.put(`/api/wakeUp/cancel-wake-up-call/${id}`);
      if (response.status === 200) {
        toast({
          title: "Wake-up call canceled!",
        });
      }
    } catch (err) {
      toast({
        title: "Error cancelling wake-up call",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const filteredWakeUpCalls =
    wakeUpCalls &&
    wakeUpCalls.length > 0 &&
    wakeUpCalls.filter((t) => t.bookingId === bookingId);

  const filteredTasks =
    guestTasks &&
    guestTasks.length > 0 &&
    guestTasks.filter((t) => t.bookingId === bookingId);
  return (
    ((filteredTasks && filteredTasks.length > 0) ||
      (filteredWakeUpCalls && filteredWakeUpCalls.length > 0)) && (
      <Card className="h-fit w-full">
        <CardHeader>
          <CardTitle>Your Requests</CardTitle>
          <CardDescription>
            View previous room requests and their status from here.
          </CardDescription>
          <div className="flex flex-row justify-between items-center">
            <Button
              onClick={handleSelect}
              disabled={selected || !filteredWakeUpCalls.length > 0}
              className={`p-1 py-1 text-xs h-fit`}
            >
              Wake-up Calls
            </Button>
            <Button
              onClick={handleSelect}
              disabled={!selected || !filteredTasks.length > 0}
              className={`p-1 py-1 text-xs h-fit`}
            >
              Requests
            </Button>
          </div>
        </CardHeader>

        <ScrollArea className="h-[300px] rounded-md border">
          <CardContent className="flex p-2 pb-0 flex-col gap-4">
            {selected ? (
              filteredWakeUpCalls && filteredWakeUpCalls.length > 0 ? (
                filteredWakeUpCalls.map((req) => (
                  <>
                    <li key={req._id} className="grid gap-5 border-0 p-3">
                      <div className="flex flex-row justify-between items-center">
                        <h1 className="font-medium">{req.wakeUpTime}</h1>

                        {req.status === "completed" ? (
                          <Badge variant="secondary">Request Completed!</Badge>
                        ) : (
                          req.status === "pending" && (
                            <Badge className="text-nowrap">Pending</Badge>
                          )
                        )}
                      </div>
                      <div className="text-gray-600 text-sm line-clamp-2">
                        {formatDate(new Date(req.wakeUpDate), "MM/dd/yyyy")}
                      </div>
                      <div className="flex flex-row justify-between items-center text-xs">
                        {req.status !== "completed" && (
                          <Button
                            variant="secondary"
                            onClick={() => cancelWakeUpCall(req._id)}
                          >
                            Cancel
                          </Button>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(req.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </li>
                    <Separator />
                  </>
                ))
              ) : (
                <p>No wake-up calls available</p>
              )
            ) : filteredTasks && filteredTasks.length > 0 ? (
              filteredTasks.map((req) => (
                <>
                  <li key={req._id} className="grid gap-2 border-0 p-3">
                    <div className="font-medium">{req.serviceType}</div>
                    <div className="text-gray-600 text-sm line-clamp-2">
                      {req.issue}
                    </div>
                    <div className=" flex flex-row justify-between text-xs">
                      {req.completed ? (
                        <Badge variant="secondary">Request Completed!</Badge>
                      ) : req.seen ? (
                        <Badge className="text-nowrap">Staff On The Way</Badge>
                      ) : (
                        <Badge variant="outline">Reviewing</Badge>
                      )}

                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(req.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </li>
                  <Separator />
                </>
              ))
            ) : (
              <p>No guest requests available</p>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    )
  );
};
