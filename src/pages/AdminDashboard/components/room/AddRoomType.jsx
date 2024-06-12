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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useRoomTypeContext } from "@/hooks/useRoomTypeContext";
import { ToastAction } from "@radix-ui/react-toast";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AddRoomType() {
  const { roomTypes, dispatch } = useRoomTypeContext();
  const [type, setType] = useState(null);
  const [error, setError] = useState(null);
  const [responseG, setResponseG] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const AddType = async (e) => {
    setError(null);

    setResponseG(null);
    setIsLoading(false);
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post("/api/roomType/insert", {
        type: type,
      });

      if (response.status === 201) {
        setType("");
        dispatch({ type: "CREATE_TYPE", payload: response.data });
        setResponseG(response.data.message);
      }
    } catch (err) {
      setError(err.response.data.error)
      setIsLoading(false);
    }
  };

  const DeleteRoomType = async (id) => {
    setResponseG(null)
    setError(null);
    try {
      const response = await axios.delete("/api/roomType/delete/" + id);

      if (response.status === 200) {
        dispatch({ type: "DELETE_TYPE", payload: response.data });
        setResponseG(response.data.message)
      }
    } catch (err) {
      setError(err.response.data.error)
    }
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
        title: `${responseG}!`,
      });
    }
  }, [responseG]);

  return (
    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
      <Card className="w-full grid max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Add Room Type</CardTitle>
        </CardHeader>
        <form onSubmit={AddType}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Room Type</Label>
              <Input
                value={type}
                onChange={(e) => setType(e.target.value)}
                type="text"
                placeholder="Suite"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Add</Button>
          </CardFooter>
        </form>
      </Card>

      <ScrollArea className="h-52 w-full rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Room Types</h4>
          {roomTypes &&
            roomTypes.map((type) => (
              <>
                <div
                  key={type._id}
                  className="text-sm flex flex-row items-center justify-between"
                >
                  {type.type}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        {" "}
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Deleting this room type
                          will remove all associated rooms. Are you sure you
                          want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => DeleteRoomType(type._id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Separator className="my-2" />
              </>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
