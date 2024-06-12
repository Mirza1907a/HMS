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
import { useServiceContext } from "@/context/serviceContext";

export function AddServiceCategory() {
  const { category, dispatch } = useServiceContext();
  const [name, setName] = useState('');
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
      const response = await axios.post("/api/serviceCategory/insert", {
        name: name,
      });

      if (response.status === 201) {
        setName("");
        dispatch({
          type: "CREATE_CATEGORY",
          payload: response.data.ServiceCategory,
        });
        setResponseG(response.data.message);
      }
    } catch (err) {
      setError(err.response.data.error);
      setIsLoading(false);
    }
  };

  const DeleteCategory = async (id) => {
    setResponseG(null);
    setError(null);
    try {
      const response = await axios.delete("/api/serviceCategory/delete/" + id);

      if (response.status === 200) {
        dispatch({ type: "DELETE_TYPE", payload: response.data });
        setResponseG(response.data.message);
      }
    } catch (err) {
      setError(err.response.data.error);
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
          <CardTitle className="text-xl">Add Service Category</CardTitle>
        </CardHeader>
        <form onSubmit={AddType}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Service Category</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Beverages"
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
          <h4 className="mb-4 text-sm font-medium leading-none">
            Service Categories
          </h4>
          {category.length > 0 &&
            category.map((type) => (
              <>
                <div
                  key={type._id}
                  className="text-sm flex flex-row items-center justify-between"
                >
                  {type.name}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Deleting this service
                          category will remove all associated services. Are you
                          sure you want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => DeleteCategory(type._id)}
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
