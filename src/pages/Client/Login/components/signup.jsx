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
import { useSignup } from "@/hooks/useSignup";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormik } from "formik";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

export function SignupForm() {
  const { toast } = useToast();

  const { signup, isLoading, error, responseG } = useSignup();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required("Name is required."),
      lastName: Yup.string().trim().required("Last name is required"),

      email: Yup.string()
        .trim()
        .email("Invalid email format")
        .required("Email is required."),
      phoneNumber: Yup.string()
        .matches(/^(\+92)?(0)?3[0-9]{9}$/, "Invalid phone number")
        .required("Phone number is required"),
      password: Yup.string()
        .trim()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        )
        .required("Password is required."),
      confirmPassword: Yup.string()
        .trim()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password."),
    }),
    onSubmit: async (values) => {
      await signup(values);
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
        title: "Account Created!",
        description: `Please Login!`,
      });
    }
  }, [responseG]);

  return (
    <Card className="max-w-md mt-12">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                {...formik.getFieldProps("firstName")}
                placeholder="Max"
                required
              />

              {formik.touched.firstName && (
                <p className="text-red-600 m-0 text-xs">
                  {formik.errors.firstName}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Robinson"
                {...formik.getFieldProps("lastName")}
                required
              />
              {formik.touched.lastName && (
                <p className="text-red-600 text-xs">{formik.errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...formik.getFieldProps("email")}
              required
            />
            {formik.touched.email && (
              <p className="text-red-600 text-xs">{formik.errors.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact">Phone number</Label>
            <Input
              id="contact"
              type="tel"
              placeholder="0311255009"
              {...formik.getFieldProps("phoneNumber")}
              required
            />
            {formik.touched.phoneNumber && (
              <p className="text-red-600 text-xs">
                {formik.errors.phoneNumber}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && (
              <p className="text-red-600 text-xs">{formik.errors.password}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="Confirmpassword">Confirm password</Label>
            <Input
              id="Confirmpassword"
              type="password"
              {...formik.getFieldProps("confirmPassword")}
            />
            {formik.touched.confirmPassword && (
              <p className="text-red-600 text-xs">
                {formik.errors.confirmPassword}
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
                Please wait...
              </>
            ) : (
              <>Create an account</>
            )}
          </Button>
         
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link className="underline" to="/login">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
