import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { PolicyCard } from "./PolicyCard";

export const Policies = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios("/api/policy");

        if (response.status === 200) {
          setPolicies(response.data.policies);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPolicies();
  }, []);
  return (
    <div className="grid gap-6">
      <PolicyForm setPolicies={setPolicies} />

      <div className="grid grid-cols-2 gap-2">
        {policies.length > 0 ? (
          policies.map((p) => (
           <div key={p._id}>
            <PolicyCard p={p}/>
           </div>
          ))
        ) : (
          <div>No policies created yet.</div>
        )}
      </div>
    </div>
  );
};
export const PolicyForm = ({ setPolicies }) => {
  const { user } = useAuthContextProvider();
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      effectiveDate: "",
      category: "",
      status: "",
    },
    validationSchema: yup.object({
      title: yup.string().required("Policy title is required"),
      description: yup.string().required("Description is required"),
      effectiveDate: yup.date().required("Effective date is required"),
      category: yup.string().required("Category is required"),
      status: yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (!user) {
          return null;
        }
        const response = await axios.post(
          `/api/policy/create_policy/${user._id}`,
          values
        );

        if (response.status === 201) {
          setPolicies((e) =>
            e.length > 0 ? [...e, response.data] : [response.data]
          );
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Defined Policies</CardTitle>
        <CardDescription>
          Add or manage hotel policies from here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Policy Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1"
              placeholder="Enter policy title"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm">{formik.errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1"
              placeholder="Enter policy description"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm">
                {formik.errors.description}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="effectiveDate">Effective Date</Label>
            <Input
              id="effectiveDate"
              name="effectiveDate"
              type="date"
              value={formik.values.effectiveDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1"
            />
            {formik.touched.effectiveDate && formik.errors.effectiveDate && (
              <p className="text-red-500 text-sm">
                {formik.errors.effectiveDate}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Policy Category</Label>
            <Select
              name="category"
              value={formik.values.category}
              onValueChange={(value) => formik.setFieldValue("category", value)}
              className="mt-1"
            >
              <SelectTrigger>
                <span>{formik.values.category || "Select category"}</span>
              </SelectTrigger>
              <SelectContent>
                {[
                  "Housekeeping",
                  "Guest Services",
                  "Safety & Security",
                  "Maintenance",
                  "Food & Beverage",
                  "Human Resources",
                  "Front Desk",
                  "Reservations",
                  "IT & Communications",
                  "Sales & Marketing",
                ].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-red-500 text-sm">{formik.errors.category}</p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              value={formik.values.status}
              onValueChange={(value) => formik.setFieldValue("status", value)}
              className="mt-1"
            >
              <SelectTrigger>
                <span>{formik.values.status || "Select status"}</span>
              </SelectTrigger>
              <SelectContent>
                {["Draft", "Active", "Archived"].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.status && formik.errors.status && (
              <p className="text-red-500 text-sm">{formik.errors.status}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Save Policy
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
