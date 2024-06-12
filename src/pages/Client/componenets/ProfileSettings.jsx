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
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { toast as sonner } from "sonner";

export const ProfileSettings = () => {
  const { user, dispatch } = useAuthContextProvider();
  const [disabled, setDisabled] = useState(false);
  const { toast } = useToast();

  const updateUserDetails = async (values) => {
    try {
      if (!user) {
        return null;
      }
      const response = await axios.patch(
        `/api/user/updateUserDetails/${user._id}`,
        values
      );

      if (response.status === 200) {
        toast({
          title: "Profile Updated!",
        });
        setDisabled(true);

        dispatch({ type: "UPDATE_DETAILS", payload: response.data.user });
      }
    } catch (err) {
      toast({
        title: "Something went wrong!",
        description: err,
        variant: "destructive",
      });
    }
  };

  return (
    user && (
      <div className="grid gap-4">
        <div class="px-4 sm:px-0">
          <h3 class="text-base font-semibold leading-7 text-gray-900">
            Profile Settings
          </h3>
          <p class="w-fit text-sm leading-6 text-gray-500">Personal details.</p>
        </div>
        <div>
          <UserDetailsForm
            user={user}
            submitForm={updateUserDetails}
            disabled={disabled}
          />
        </div>
        <div>
          <UpdatePassword />
        </div>
      </div>
    )
  );
};

const UpdatePassword = () => {
  const [currentP, setCurrentP] = useState("");
  const [newP, setNewP] = useState("");
  const [confirmNewP, setConfirmNewP] = useState("");
  const [error, setError] = useState("");
  const [toastError, setToastError] = useState("");
  const { user } = useAuthContextProvider();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastError("");

    try {
      const response = await axios.patch(
        `/api/user/updatePassword/${user._id}`,
        {
          password: currentP,
          newPassword: newP,
        }
      );

      if (response.status === 200) {
        sonner(response.data.message, {
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
      if (err.response) {
        if (err.response.status === 400) {
          setToastError(err.response.data.error);
        } else {
          setToastError("An error occurred. Please try again later.");
        }
      } else if (err.request) {
        setToastError(
          "No response received. Please check your internet connection."
        );
      } else {
        setToastError("An error occurred. Please try again later.");
      }
    }
  };
  const checkNewAndCurrect = (e) => {
    const newP = e.target.value;
    setNewP(newP);
    if (newP === currentP) {
      setError("New Password can't be same as current password!");
    } else {
      setError("");
    }
  };
  const handleConfirmPasswordChange = (e) => {
    const confirmP = e.target.value;
    setConfirmNewP(confirmP);

    if (newP !== confirmP) {
      setError("New password and confirm password do not match");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    if (toastError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${toastError}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        position: "center",
      });
    }
  }, [toastError]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label>Current Password</Label>
            <Input
              value={currentP}
              type="password"
              onChange={(e) => setCurrentP(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>New Password</Label>
            <Input type="password" value={newP} onChange={checkNewAndCurrect} />
          </div>
          <div className="grid gap-2">
            <Label>Cofirm Password</Label>
            <Input
              type="password"
              value={confirmNewP}
              onChange={handleConfirmPasswordChange}
            />
            {error && <div className="text-red-500 text-xs">{error}</div>}
          </div>

          <Button
            type="submit"
            disabled={!newP || !currentP || !confirmNewP || error}
          >
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const UserDetailsForm = ({ user, submitForm, disabled }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  const formik = useFormik({
    initialValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required("First Name is required."),
      lastName: Yup.string().trim().required("Last name is required."),
      email: Yup.string()
        .trim()
        .email("Invalid email format")
        .required("Email is required."),
    }),
    onSubmit: (values) => {
      submitForm(values);
      formik.resetForm();
      console.log("Form values:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className="p-10">
        <CardContent className="grid gap-4">
          <div className="flex flex-row justify-start gap-5">
            <div className="grid gap-2">
              <Label>First Name</Label>
              <Input
                {...formik.getFieldProps("firstName")}
                className="w-full"
              />

              {formik.touched.firstName && formik.errors.firstName ? (
                <p className="text-sm text-red-600">
                  {formik.errors.firstName}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label>Last Name</Label>
              <Input {...formik.getFieldProps("lastName")} />
              {formik.touched.lastName && formik.errors.lastName ? (
                <p className="text-sm text-red-600">{formik.errors.lastName}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Email Address</Label>
            <Input {...formik.getFieldProps("email")} />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-sm text-red-600">{formik.errors.email}</p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            type="submit"
            disabled={
              !formik.isValid ||
              !formik.dirty ||
              disabled ||
              formik.isSubmitting
            }
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
