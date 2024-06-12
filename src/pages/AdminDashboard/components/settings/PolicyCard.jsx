import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import axios from "axios";
import { formatDate, formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export const PolicyCard = ({ p, guest }) => {
  const [truncate, setTruncate] = useState(false);
  const { user } = useAuthContextProvider();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/policy/${p._id}`);

      if (response.status === 200) {
        toast("Policy deleted successfully!");
      }
    } catch (err) {
      toast.error("Internal server error.");
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{p.title}</CardTitle>
        <CardDescription
          onClick={() => setTruncate((e) => !e)}
          className={`cursor-pointer ${truncate ? "" : "line-clamp-2"}`}
        >
          {p.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="items-flex-between">
          <Badge>{p.category}</Badge>
          <Badge>{p.status}</Badge>
        </div>

        <div className="items-flex-between">
          <p className="text-xs">
            Created By:{" "}
            <span className="font-medium">{p.createdBy.first_name}</span>
          </p>
          <p className="text-xs">
            Effective Date:{" "}
            <span className="font-medium">
              {formatDate(p.effectiveDate, "MM-yyyy-dd")}
            </span>
          </p>
        </div>

        <div className="ml-auto">
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(p.createdAt, { addSuffix: true })}
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t flex flex-row justify-between items-center px-6 py-4">
        <Button variant="secondary">Update</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </CardFooter>
    </Card>
  );
};
