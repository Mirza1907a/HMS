import { useEffect, useState } from "react";
import { TopBar } from "../components/TopBar";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, RefreshCcw, Trash } from "lucide-react";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { socket } from "@/socket";

export const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([]);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await axios("/api/maintenance");

        if (response.status === 200) {
          setMaintenance(response.data);
        }
      } catch (err) {}
    };
    fetchMaintenance();
  }, []);

  useEffect(() => {
    const newIssue = (issue) => {
      setMaintenance((e) => (e.length > 0 ? [...e, issue] : [issue]));
    };

    socket.on("newIssue", newIssue);

    return () => {
      socket.off("newIssue", newIssue);
    };
  }, [socket]);

  const handleRefresh = async () => {
    try {
      const response = await axios("/api/maintenance");

      if (response.status === 200) {
        setMaintenance(response.data);
      }
    } catch (err) {}
  };
  return (
    <>
      <TopBar>Maintenance Reports ({maintenance && maintenance.length.toString()})</TopBar>

      <div className="grid relative grid-cols-3 size-full gap-5">
        <div className="absolute right-0">
          <RefreshCcw
            onClick={handleRefresh}
            className="size-4 cursor-pointer"
          />
        </div>
        {maintenance && maintenance.length > 0 ? (
          maintenance.map((m) => (
            <div key={m._id} className="grid col-span-1">
              <MaintenanceCard m={m} setMaintenance={setMaintenance} />
            </div>
          ))
        ) : (
          <div className="text-center mx-auto font-semibold text-2xl">
            Loading please wait...
          </div>
        )}
      </div>
    </>
  );
};

export const MaintenanceCard = ({ m, setMaintenance }) => {
  const [truncate, setTruncate] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/maintenance/${m._id}`);

      if (response.status === 200) {
        toast({
          title: "Report deleted successfully!",
        });
        setMaintenance((prevMaintenance) =>
          prevMaintenance.filter((item) => item._id !== m._id)
        );
      }
    } catch (err) {
      toast({
        title: "An error occurred, please try again later.",
        variant: "destructive",
      });
    }
  };
  const handleUpdateStatus = async () => {
    try {
      const response = await axios.put(`/api/maintenance/${m._id}`, {
        status: "Completed",
      });

      if (response.status === 200) {
        toast({
          title: "Report status marked as completed!",
        });

        setMaintenance((prevMaintenance) =>
          prevMaintenance.map((item) =>
            item._id === response.data._id
              ? { ...item, status: response.data.status }
              : item
          )
        );
      }
    } catch (err) {
      toast({
        title: "An error occurred, please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-xl">{m.category}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <h3
          onClick={() => setTruncate((prev) => !prev)}
          className={`${
            !truncate ? "line-clamp-2 truncate" : ""
          } cursor-pointer`}
        >
          {m.issue}
        </h3>
        <div className="flex flex-row justify-between items-center">
          <Badge>{m.priority}</Badge>
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
            </p>
            <p className="text-xs font-medium">{m.reportedBy.username}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-between items-center">
        <Button
          disabled={m.status === "Completed"}
          className="flex gap-2"
          onClick={handleUpdateStatus}
          variant="secondary"
        >
          {m.status !== "Completed" ? (
            <>
              Resolve
              <QuestionMarkIcon className="size-4" />
            </>
          ) : (
            <>
              Resolved
              <Check className="size-4" />
            </>
          )}
        </Button>
        <Button onClick={handleDelete} className="flex gap-2" variant="outline">
          Delete <Trash className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
