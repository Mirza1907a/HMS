import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useBookingContext } from "@/hooks/useBookingContext";
import { formatDate } from "date-fns";

const WakeUpCallForm = () => {
  const { toast } = useToast();
  const { selectedBooking } = useBookingContext();

  const checkIn = formatDate(
    new Date(selectedBooking.checkInDate),
    "MM/dd/yyyy"
  );
  const checkOut = formatDate(
    new Date(selectedBooking.checkOutDate),
    "MM/dd/yyyy"
  );

  const formik = useFormik({
    initialValues: {
      guestName: "",
      bookingId: "",
      guestId: "",
      roomNumber: '',
      wakeUpDate: "",
      wakeUpTime: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      guestName: Yup.string().required("Guest name is required"),
      guestId: Yup.string().required("Guest id is required"),
      roomNumber: Yup.string().required("Room number is required"),
      wakeUpDate: Yup.date()
        .required("Wake-up date is required")
        .min(new Date(checkIn), `Date cannot be before ${checkIn}`)
        .max(new Date(checkOut), `Date cannot be after ${checkOut}`),
      wakeUpTime: Yup.string().required("Wake-up time is required"),
      phoneNumber: Yup.string().matches(
        /^(\+92)?(0)?3[0-9]{9}$/,
        "Invalid phone number"
      ),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await axios.post("/api/wakeUp/schedule-wake-up-call", values);
        toast({
          title: "Wake-up call scheduled successfully",
        });
        resetForm();
      } catch (error) {
        toast({
          title: "Error scheduling wake-up call",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("guestName", selectedBooking.member.fullName);
    formik.setFieldValue("roomNumber", selectedBooking.room.roomNumber);
    formik.setFieldValue("guestId", selectedBooking.member._id);
    formik.setFieldValue("bookingId",selectedBooking._id)
  }, [selectedBooking, formik.resetForm]);

  return (
    <Card className="w-full">
      <form onSubmit={formik.handleSubmit}>
        <CardHeader>
          <CardTitle>Wake-Up Call Request</CardTitle>
          <CardDescription>
            Schedule a wake-up call.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="wakeUpDate">Wake-up Date</Label>
            <Input
              id="wakeUpDate"
              name="wakeUpDate"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.wakeUpDate}
              min={checkIn}
              max={checkOut}
              className={
                formik.touched.wakeUpDate && formik.errors.wakeUpDate
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.wakeUpDate && formik.errors.wakeUpDate ? (
              <div className="text-red-500 text-sm">
                {formik.errors.wakeUpDate}
              </div>
            ) : null}
          </div>
          <div>
            <Label htmlFor="wakeUpTime">Wake-up Time</Label>
            <Input
              id="wakeUpTime"
              name="wakeUpTime"
              type="time"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.wakeUpTime}
              className={
                formik.touched.wakeUpTime && formik.errors.wakeUpTime
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.wakeUpTime && formik.errors.wakeUpTime ? (
              <div className="text-red-500 text-sm">
                {formik.errors.wakeUpTime}
              </div>
            ) : null}
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number (optional)</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
              className={
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
              <div className="text-red-500 text-sm">
                {formik.errors.phoneNumber}
              </div>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Schedule Wake-up Call
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WakeUpCallForm;
