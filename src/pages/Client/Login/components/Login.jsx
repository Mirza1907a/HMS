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
import { useLogin } from "@/hooks/useLogin";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormik } from "formik";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

export function LoginForm() {
  const { toast } = useToast();

  const { Login, isLoading, error, responseG } = useLogin();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Invalid email format")
        .required("Email is required."),

      password: Yup.string().trim().required("Password is required."),
    }),
    onSubmit: async (data) => {
      await Login(data, "user");
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
        description: `Welcome ${responseG.first_name} ${responseG.last_name}`,
      });
    }
  }, [responseG]);

  return (
    <Card className="mx-auto mt-10 size-fit">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...formik.getFieldProps("email")}
                placeholder="m@example.com"
              />
              {formik.touched.email && (
                <p className="text-red-600 text-xs">{formik.errors.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                {...formik.getFieldProps("password")}
                type="password"
              />
              {formik.touched.password && (
                <p className="text-red-600 text-xs">{formik.errors.password}</p>
              )}
              <Link to="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
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
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/user/signup" className="underline">
            Sign up
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
          <Link to="/staffLogin" className="w-full">
            <Button variant="secondary" className="w-full">
              Staff Login
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
