import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useStaffContext } from "@/hooks/useStaffContext";
import { UpdateIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useState } from "react";
import * as Yup from "yup";

export const EditStaff = ({ staff }) => {
  const [details, setDetails] = useState({
    username: staff.username,
  });

  const { dispatch } = useStaffContext();
  const { toast } = useToast();

  const UpdateStaff = async (data, e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "/api/staff/update_details/" + staff._id,
        {
          username: data.username,
          password: data.password,
        }
      );

      if (response.status === 200) {
        dispatch({ type: "UPDATE_STAFF_DETAILS", payload: response.data });

        toast({
          description: "Updated!",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <UpdateIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to the staff profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => UpdateStaff(details, e)}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={details.username}
              onChange={(e) =>
                setDetails({ ...details, username: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right  text-pretty">
                New Password
              </Label>
              <Input
                id="name"
                onChange={(e) =>
                  setDetails({ ...details, password: e.target.value })
                }
                type="password"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right ">Confirm Password</Label>
              <Input
                type="password"
                onChange={(e) =>
                  SetConfirmPassword({
                    ...details,
                    confirmPassword: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
