import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import CountdownToast from "@/globalComponents/CountDownToast";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { useStaffContext } from "@/hooks/useStaffContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const AdminProfile = () => {
  const { user, logout } = useAuthContextProvider();
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [details, setDetails] = useState({
    first_name: user && user.first_name,
    last_name: user && user.last_name,
    email: user && user.email,
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

  const UpdateAdmin = async (data, e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "/api/user/updateUserDetails/" + user._id,
        {
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          password: data.password,
        }
      );

      if (response.status === 200) {
        toast("Profile updated successfully!", {
          action: (
            <CountdownToast
              initialCount={5}
              onCountdownEnd={() => {
                logout();
              }}
            />
          ),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="grid size-full border rounded-lg shadow-md p-7">
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
          onSubmit={(e) => UpdateAdmin(details, e)}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="grid col-span-1 gap-2">
              <Label htmlFor="username" className="font-medium">
                First Name
              </Label>
              <Input
                id="username"
                value={details.first_name}
                onChange={(e) =>
                  setDetails({ ...details, first_name: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <div className="grid col-span-1 gap-2">
              <Label htmlFor="username" className="font-medium">
                Last Name
              </Label>
              <Input
                id="username"
                value={details.last_name}
                onChange={(e) =>
                  setDetails({ ...details, last_name: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              This is your public display name. It can be your real name or a
              pseudonym.
            </p>
          </div>

          <div className="grid gap-4">
            <Label htmlFor="name">Email</Label>
            <Input
              id="name"
              value={details.email}
              onChange={(e) =>
                setDetails({ ...details, email: e.target.value })
              }
              type="email"
            />
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
