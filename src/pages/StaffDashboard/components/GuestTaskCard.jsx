import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { useTaskContext } from "@/hooks/useTaskContext";
import axios from "axios";
import { formatDate, formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, CheckCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useToast } from "@/components/ui/use-toast";
import { FaRunning } from "react-icons/fa";

export const GuestTaskCard = ({ task, admin }) => {
  const { dispatch } = useTaskContext();
  const [selected, setSelected] = useState(false);

  const { toast } = useToast();

  const { staff } = useStaffAuthContext();

  const taskId = task._id;

  /*   let bgColorClass;
  switch (task.priority.toLowerCase()) {
    case "low":
      bgColorClass = "bg-green-600";
      break;
    case "medium":
      bgColorClass = "bg-yellow-500";
      break;
    case "high":
      bgColorClass = "bg-orange-500";
      break;
    case "very high":
      bgColorClass = "bg-red-600";
      break;
    default:
      bgColorClass = "bg-gray-400";
      break;
  } */

  const handleOnTheWay = async () => {
    try {
      const response = await axios.post(`/api/guestReq/onTheWay/${task._id}`);

      if (response.status === 200) {
        dispatch({ type: "MARK_ON_THE_WAY", payload: response.data });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const markAsCompleted = async () => {
    try {
      if (!staff) {
        return null;
      }

      const response = await axios.patch(
        `/api/guestReq/${taskId}/mark_as_completed/${staff._id}`
      );

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card
      id={task._id}
      className={`p-4 pb-6 relative grid shadow-md text-nowrap rounded-[0.4rem] w-full hover:bg-gray-100 transition duration-300 gap-2 cursor-pointer  ${
        selected ? "bg-gray-50" : ""
      } `}
    >
      <CardHeader className="grid p-0">
        <div className="justify-between grid items-center grid-cols-2 gap-1">
          <p className="font-semibold text-lg capitalize">
            {task.guestId.fullName}
          </p>
          <p
            className={` ${
              !selected ? "text-muted-foreground" : "text-black"
            }   text-sm ml-auto`}
          >
            {formatDistanceToNow(new Date(task.createdAt), {
              addSuffix: true,
            })}
          </p>
          <p className="m-0 font-medium  text-md capitalize space-y-0-0">
            {task.serviceType}
          </p>
        </div>
      </CardHeader>

      <CardDescription className="line-clamp-[2] text-ellipsis overflow-hidden">
        {task.issue}
      </CardDescription>

      <CardContent className="flex flex-row justify-between items-center p-0">
        <Badge className={`pointer-events-none`}>{task.priority}</Badge>
      </CardContent>

      <CardFooter className="p-0">
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex flex-row gap-1">
            <p>Preferred Time: </p>
            <p className="font-semibold capitalize">{task.preferredTime}</p>
          </div>
          <div className="flex flex-row gap-1">
            <p>Room Number: </p>
            <p className="font-semibold capitalize">{task.roomNumber}</p>
          </div>
        </div>

        {admin && (
          <>
            <div className="flex flex-row ml-auto gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="w-fit h-fit p-2 ml-auto"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </CardFooter>
      <div className="mx-auto flex gap-2">

      <Button
        onClick={handleOnTheWay}
        disabled={task.seen}
        variant="secondary"
        className="flex gap-2 w-fit text-sm"
      >
        On The Way
        <FaRunning className="size-4.5" />
      </Button>
      <Button
        onClick={markAsCompleted}
        disabled={task.completed}
        className="flex gap-2 w-fit text-sm"
      >
        {task.completedBy
          ? `Completed by ${task.completedBy.username}`
          : "Mark as Completed "}{" "}
        <Check className="size-4" />
      </Button>
      </div>

    </Card>
  );
};
