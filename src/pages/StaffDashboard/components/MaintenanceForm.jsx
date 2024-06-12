import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { Textarea } from "@/components/ui/textarea";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";

export const MaintenanceForm = () => {
  const { staff } = useStaffAuthContext();
  const { toast } = useToast();

  const maintenanceCategories = [
    "General Maintenance",
    "Electrical",
    "HVAC",
    "Appliances",
    "Safety and Security",
    "Exterior Issues",
    "Common Areas",
    "Plumbing Specifics",
    "Miscellaneous",
  ];

  const formik = useFormik({
    initialValues: {
      maintenance: "",
      roomNumber: "",
      issue: "",
      priority: "",
    },
    validationSchema: Yup.object({
      maintenance: Yup.string()
        .trim()
        .required("Type of maintenance is required!"),
      issue: Yup.string().trim().required("Issue is required!"),

      priority: Yup.string().trim().required("Priorty is required!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(`/api/maintenance/${staff._id}`, {
          roomNumber: values.roomNumber,
          maintenance: values.maintenance,
          issue: values.issue,
          priority: values.priority,
        });
        if (response.status === 201) {
          toast({
            title: "Request Submitted!",
            description:
              "Thank you! Your report has been submitted successfully. The management will address it shortly.",
          });
          resetForm();
        }
      } catch (err) {
        toast({
          title: "Oops! something went wrong.",
          description: err.response.message,
          variant: "destructive",
        });
      }
    },
  });
  return (
    <Card className="size-fit">
      <CardHeader>
        <CardTitle className="text-2xl">Report Maintenance Issue</CardTitle>
        <CardDescription>
          Report maintenance issues to management easily using this form.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={formik.handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>
              Maintenance Type: <sup className="text-red-500">*</sup>
            </Label>
            <Select
              onValueChange={(e) => formik.setFieldValue("maintenance", e)}
            >
              <SelectTrigger className="w-100">
                <SelectValue
                  {...formik.getFieldProps("maintenance")}
                  placeholder="Select a type"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  {maintenanceCategories.map((main, index) => (
                    <SelectItem key={index} value={main}>
                      {main}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.maintenance && formik.errors.maintenance && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.maintenance}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>
              Specify Issue: <sup className="text-red-500">*</sup>
            </Label>
            <Textarea
              type="time"
              {...formik.getFieldProps("issue")}
              placeholder="Specify your issue here..."
            />
            {formik.touched.issue && formik.errors.issue && (
              <p className="text-red-600 m-0 text-xs">{formik.errors.issue}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Room Number:</Label>
            <Input
              type="text"
              {...formik.getFieldProps("roomNumber")}
              placeholder="Optional"
            />
          </div>

          <div className="grid gap-2">
            <Label>
              Priority: <sup className="text-red-500">*</sup>
            </Label>
            <Select onValueChange={(e) => formik.setFieldValue("priority", e)}>
              <SelectTrigger className="w-100">
                <SelectValue
                  {...formik.getFieldProps("priority")}
                  placeholder="Select priority"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>

                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Very High">Very High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.priority && formik.errors.priority && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.priority}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
