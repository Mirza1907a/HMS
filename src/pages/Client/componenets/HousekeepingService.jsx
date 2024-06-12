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

export const HouseKeepingService = ({ booking }) => {
  const { user } = useAuthContextProvider();
  const { toast } = useToast();

  const housekeepingService = [
    "Extra Towels",
    "Room cleaning",
    "Maintenance issues",
    "Other",
  ];

  const formik = useFormik({
    initialValues: {
      serviceType: "",
      issue: "",
      preferredTime: "",
      priority: "",
    },
    validationSchema: Yup.object({
      serviceType: Yup.string().trim().required("Type of service is required!"),
      issue: Yup.string().trim().required("Issue is required!"),
      preferredTime: Yup.string()
        .trim()
        .required("Preffered time is required!"),
      priority: Yup.string().trim().required("Priorty is required!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          `/api/guestReq/create-req/${user._id}`,
          {
            roomNumber: booking.room.roomNumber,
            bookingId: booking._id,
            serviceType: values.serviceType,
            priority: values.priority,
            issue: values.issue,
            preferredTime: values.preferredTime,
          }
        );
        if (response.status === 201) {
          toast({
            title: "Request Submitted!",
            description:
              "Thank you! Your request has been submitted successfully. Our team will address it shortly.",
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
        <CardTitle className="text-2xl">Housekeeping Service</CardTitle>
        <CardDescription>
          Request extra towels, room cleaning, or maintenance services easily
          using this form.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={formik.handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>
              Service Type: <sup className="text-red-500">*</sup>
            </Label>
            <Select
              onValueChange={(e) => formik.setFieldValue("serviceType", e)}
            >
              <SelectTrigger className="w-100">
                <SelectValue
                  {...formik.getFieldProps("serviceType")}
                  placeholder="Select a type"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  {housekeepingService.map((service, index) => (
                    <SelectItem key={index} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.serviceType && formik.errors.serviceType && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.serviceType}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>
              Specific Issue: <sup className="text-red-500">*</sup>
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
            <Label>
              Preffered Time: <sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="time"
              {...formik.getFieldProps("preferredTime")}
              placeholder="Specify your issue here..."
            />
            {formik.touched.preferredTime && formik.errors.preferredTime && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.preferredTime}
              </p>
            )}
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

          <div className="gap-2 grid">
            <Label>Room Number:</Label>
            <Input value={booking.room.roomNumber} disabled />
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
