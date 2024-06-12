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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import staffRole from "@/utils/staffRoleList";
import { useStaffContext } from "@/hooks/useStaffContext";

export const AddStaff = () => {
  const [responseG, setResponseG] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useStaffContext();
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  const { toast } = useToast();

  const submitStaff = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("role", data.role);
      formData.append("image", image);

      console.log(formData);
      const response = await axios.post("/api/staff/signup", formData);

      if (response.status === 200) {
        dispatch({ type: "CREATE_STAFF", payload: response.data });
        formik.resetForm();
      }
      setResponseG(response.data);
      setIsLoading(false);
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
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
        action: (
          <ToastAction altText="Try again" onClick={formik.handleSubmit}>
            Try again
          </ToastAction>
        ),
        position: "center",
      });
    }
  }, [error]);

  useEffect(() => {
    if (responseG) {
      toast({
        title: "Staff Account Created!",
        description: `with Username: ${responseG.fullStaff.username} and Password: ${responseG.password}`,
      });
    }
  }, [responseG]);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      role: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().trim().required("Username is required."),
      password: Yup.string().trim().required("Password is required."),
      role: Yup.string().trim().required("Role is required."),
    }),
    onSubmit: (values) => {
      submitStaff(values);
    },
  });

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };
  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <CardHeader>
          <CardTitle className="text-2xl">Add staff</CardTitle>
          <CardDescription>
            Please enter the staff member's details below to create their
            account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="jdoe23"
              {...formik.getFieldProps("username")}
              required
            />

            {formik.touched.username && formik.errors.username && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.username}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...formik.getFieldProps("password")}
              required
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.password}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Select onValueChange={(e) => formik.setFieldValue("role", e)}>
              <SelectTrigger className="w-100">
                <SelectValue
                  {...formik.getFieldProps("role")}
                  placeholder="Select a role"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  {staffRole.map((role, index) => (
                    <SelectItem key={index} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <p className="text-red-600 m-0 text-xs">{formik.errors.role}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="picture">Picture</Label>
            <Input
              type="file"
              onChange={handleImage}
              accept="image/png, image/gif, image/jpeg"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!formik.isValid || !formik.dirty || isLoading}
          >
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              <>Add Staff</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
