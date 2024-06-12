import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useLogin } from "@/hooks/useLogin";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormik } from "formik";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

export function StaffLogin() {
  const { toast } = useToast();

  const { Login, isLoading, error, responseG } = useLogin();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().trim().required("Username is required."),

      password: Yup.string().trim().required("Password is required."),
    }),
    onSubmit: async (values) => {
      await Login(values, "staff");
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        position: "center",
      });
    }
  }, [error]);

  useEffect(() => {
    if (responseG) {
      toast({
        title: "Logged in!",
        description: `Welcome ${responseG.username}`,
      });
    }
  }, [responseG]);

  return (
    <div className="grid h-screen place-items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your staff details below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Username</Label>
                <Input
                  type="text"
                  {...formik.getFieldProps("username")}
                  placeholder="jdoe20"
                />
                {formik.touched.username && (
                  <p className="text-red-600 text-xs">
                    {formik.errors.username}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  {...formik.getFieldProps("password")}
                  type="password"
                />
                {formik.touched.password && (
                  <p className="text-red-600 text-xs">
                    {formik.errors.password}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!formik.isValid || !formik.dirty || isLoading}
              >
                {isLoading ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>Login</>
                )}
              </Button>

              <Link to="/user/login">
                <Button variant="secondary" className="w-full">Guest Login</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
