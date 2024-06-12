import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import CountdownToast from "@/globalComponents/CountDownToast";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { useStaffContext } from "@/hooks/useStaffContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const StaffProfileSettings = () => {
  const { staff, LogoutStaff } = useStaffAuthContext();
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [details, setDetails] = useState({
    username: staff && staff.username,
  });

  useEffect(() => {
    if (details.password && details.confirmPassword) {
      if (details.password !== details.confirmPassword) {
        setError("Passwords do not match");
      } else {
        setError(null);
      }
    }
  }, [details]);

  const { dispatch } = useStaffContext();

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
        toast("Profile updated successfully!", {
          action: (
            <CountdownToast
              initialCount={5}
              onCountdownEnd={() => {
                LogoutStaff();
              }}
            />
          ),
        });
        setTimeout(() => {
          LogoutStaff();
        }, 5000);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="grid size-full">
      <div className="flex flex-col">
        <h1 className="text-lg font-medium">Profile</h1>
        <p className="text-muted-foreground text-sm">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator className="my-5" />
      <div>
        <form
          onChange={() => setIsValid(true)}
          className="grid gap-6"
          onSubmit={(e) => UpdateStaff(details, e)}
        >
          <div className="grid">
            <Label htmlFor="username" className="font-medium">
              Username
            </Label>
            <Input
              id="username"
              value={details.username}
              onChange={(e) =>
                setDetails({ ...details, username: e.target.value })
              }
              className="mt-2"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              This is your public display name. It can be your real name or a
              pseudonym.
            </p>
          </div>

          <div className="grid gap-4">
            <Label htmlFor="name">New Password</Label>
            <Input
              id="name"
              onChange={(e) =>
                setDetails({ ...details, password: e.target.value })
              }
              type="password"
              className="col-span-3"
            />
          </div>

          <div className="grid gap-4">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={details.confirmPassword}
              onChange={(e) =>
                setDetails({
                  ...details,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>
          {error && <p className="text-xs text-red-500">{error} </p>}
          <div className="flex flex-col gap-2">
            <Button
              disabled={error || !isValid}
              type="submit"
              className="size-fit"
            >
              Update profile
            </Button>
            <p className="text-muted-foreground text-xs">
              You would have to log in again if you make any changes.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
