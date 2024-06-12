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
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useAuthContextProvider } from "@/hooks/useAuthContext";

export const RoomStatusSelect = ({ status,id }) => {
  const [error, setError] = useState(null);
  const [responseG, setResponseG] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { staff } = useStaffAuthContext();
  const { user } = useAuthContextProvider();
  const { toast } = useToast();

  const updateRoomStatus = async ({ data }) => {
    setError(null);
    setResponseG(null);
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `/api/room/${staff._id}/update_status/${data.id}`,
        {
          status: data.status,
        }
      );

      if (response.status === 200) {
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
        title: responseG.message,
      });
    }
  }, [responseG]);

  const statusRoom = ["cleaning", "occupied", "maintenance", "vacant"];
  return (
    <Select
      onValueChange={(value) =>
        updateRoomStatus({
          data: { id: id, status: value },
        })
      }
      defaultValue={status}
    >
      <SelectTrigger className="w-100">
        <SelectValue className="bg-black" placeholder={status} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>

          {statusRoom.map((role, index) => (
            <SelectItem key={index} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
