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

export const TaskCard = ({ task, admin }) => {
  const { dispatch } = useTaskContext();
  const [selected, setSelected] = useState(false);
  const [truncate, setTruncate] = useState(false);

  const { toast } = useToast();

  const { staff } = useStaffAuthContext();

  const { user } = useAuthContextProvider();

  const taskId = task._id;

  let bgColorClass;
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
  }

  const handleDeleteTask = async (id) => {
    try {
      if (user && user.role !== "admin") {
        toast({
          title: "Unauthorized!",
          variant: "destructive",
        });
      }
      const response = await axios.delete("/api/task/delete/" + id);

      if (response.status === 200) {
        dispatch({ type: "DELETE_TASK", payload: response.data });
        console.log("task deleted successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const markTaskAsSeen = async () => {
    try {
      if (!staff) {
        return null;
      }
      const response = await axios.post(
        `/api/task/${taskId}/seenBy/${staff._id}`
      );
      if (response.status === 200) {
        console.log("Task Seen!");
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
        `/api/task/${taskId}/mark_as_completed/${staff._id}`
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
      onClick={markTaskAsSeen}
      id={task._id}
      className={`p-4 pb-6 relative grid shadow-md h-fit text-nowrap rounded-[0.4rem] w-full hover:bg-gray-100 transition duration-300 gap-2 cursor-pointer  ${
        selected || task.completedBy ? "bg-gray-50" : ""
      } `}
    >
      <CardHeader className="grid p-0">
        <div className="justify-between grid items-center grid-cols-2 gap-1">
          <p className="font-semibold text-lg capitalize">
            {task.createdBy.fullName}
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
            {task.title}
          </p>
        </div>
      </CardHeader>

      <CardDescription
        onClick={() => setTruncate((e) => !e)}
        className={` ${
          !truncate ? "line-clamp-[2]" : ""
        } truncate text-ellipsis overflow-hidden`}
      >
        {task.description}
      </CardDescription>

      <CardContent className="flex flex-row justify-between items-center p-0">
        <Badge>{task.status}</Badge>
        <Badge className={`pointer-events-none ${bgColorClass}`}>
          {task.priority}
        </Badge>
      </CardContent>

      <CardFooter className="p-0">
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex flex-row gap-1">
            <p>Deadline Date: </p>
            <p className="font-semibold capitalize">
              {formatDistanceToNow(new Date(task.deadlineDate), {
                addSuffix: true,
              })}
            </p>
          </div>

          <div className="flex flex-row gap-1">
            <p>Deadline Time:</p>
            <p className="font-semibold">{task.deadlineTime}</p>
          </div>
        </div>
        <div className="absolute flex flex-row justify-between bottom-[2px] gap-1 w-full text-xs overflow-hidden pr-4">
          <p className="text-xs italic">
            {formatDate(new Date(task.deadlineDate), "MM/dd/yyyy")}
          </p>

          {admin && (
            <div className="flex gap-1">
              {task.seenBy.length > 0 && (
                <>
                  <p className="font-semibold">Seen By: </p>

                  {task.seenBy.map((seen, index) => (
                    <p key={index} className="flex flex-row items-center ">
                      {seen.username}
                      <CheckCheck className="h-3.5 w-3.h-3.5 text-blue-600" />
                      {index !== task.seenBy.length - 1 && ", "}
                    </p>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </CardFooter>
      <Button
        onClick={markAsCompleted}
        disabled={task.completedBy}
        className="flex gap-2 text-sm"
      >
        {task.completedBy
          ? `Completed by ${task.completedBy.username}`
          : "Mark as Completed "}{" "}
        <Check className="h-5 w-5" />
      </Button>
    </Card>
  );
};
