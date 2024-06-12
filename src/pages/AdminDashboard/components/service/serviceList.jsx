import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useServiceContext } from "@/context/serviceContext";

export default function ServiceList() {
  const [isLoading, setIsLoading] = useState(false);
  const [responseG, setResponseG] = useState(null);
  const [error, setError] = useState(null);
  const { service, category, dispatch } = useServiceContext();
  const { toast } = useToast();

  const updateServiceStatus = async ({ data }) => {
    setError(null);
    setResponseG(null);
    setIsLoading(true);
    try {
      const response = await axios.patch("/api/staff/update_role/" + data.id, {
        role: data.role,
      });

      if (response.status === 200) {
        dispatch({ type: "UPDATE_SERVICE_STATUS", payload: response.data });
        setResponseG(response.data);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (err.request) {
        setError(
          "No response received. Please check your internet connection."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    setIsLoading(false);
  };

  const deleteService = async (id) => {
    setResponseG(null);
    setIsLoading(true);
    setError(null);
    try {
      setIsLoading(false);
      const response = await axios.delete("/api/service/delete/" + id);

      if (response.status === 200) {
        dispatch({ type: "DELETE_SERVICE", payload: response.data.service });
        setResponseG(response.data.message);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (err.request) {
        setError(
          "No response received. Please check your internet connection."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        description: `${error}`,
      });
    }
  }, [error]);

  useEffect(() => {
    if (responseG) {
      toast({
        title: responseG,
      });
    }
  }, [responseG]);
  return (
    <div className="grid gap-2">
      <Card>
        <CardHeader className="px-7">
          <CardTitle className="text-2xl">Services</CardTitle>
          <CardDescription>
            View and manage room servies effortlessly in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  CreatedAt
                </TableHead>
                <TableHead className="hidden md:table-cell">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {service ? (
                service.map((service) => (
                  <TableRow className="bg-accent">
                    <TableCell className="drop-shadow-md">
                      <img
                        className="object-contain rounded-lg max-w-[70px] h-1/3"
                        src={`/ServiceImages/${service.image}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{service.name}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {category.find((w) => w._id === service.category).name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        className="text-xs capitalize"
                        variant={service.available ? "secondary" : "primary"}
                      >
                        {service.available.toString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden truncate max-w-[200px] sm:table-cell">
                      {service.description}
                    </TableCell>
                    <TableCell className="hidden line-clamp-1 sm:table-cell">
                      {service.price.toString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(service.createdAt, "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell className="text-left hidden md:table-cell">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => deleteService(service._id)}
                              variant="outline"
                              size="icon"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Service</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <div className="grid p-5 place-items-center w-full font-semibold text-2xl">
                  No Service Added
                </div>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
