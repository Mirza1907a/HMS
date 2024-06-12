import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MemberCombobox } from "@/components/ui/membercombobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RoomCombobox } from "@/components/ui/roomCombobox";
import { useAddBooking } from "@/hooks/useAddBooking";
import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useFormik } from "formik";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";

export function ClientAddBooking({ title, room }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const { isLoading, responseG, id, error, SubmitBooking } = useAddBooking({
    userType: "guest",
    bookingBy: "guest",
    room: room,
    setCheckIn: setCheckIn,
    setCheckOut: setCheckOut,
  });

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      checkIn: null,
      checkOut: null,
    },
    validationSchema: Yup.object().shape({
      checkIn: Yup.date().required("Check-in date is required!"),
      checkOut: Yup.date()
        .required("Check-out date is required!")
        .min(
          Yup.ref("checkIn"),
          "Check-out date cannot be before check-in date"
        )
        .test(
          "is-different",
          "Check-out date cannot be the same as check-in date",
          function (value) {
            const { checkIn } = this.parent;
            return (
              checkIn &&
              value &&
              new Date(value).getTime() !== new Date(checkIn).getTime()
            );
          }
        ),
    }),

    onSubmit: (values, { resetForm }) => {
      console.log(values);
      SubmitBooking(values, resetForm);
    },
  });

  const handleCheckIn = (selectedDate) => {
    setCheckIn(selectedDate);
    formik.setFieldValue("checkIn", selectedDate);
  };

  const handleCheckOut = (selectedDate) => {
    setCheckOut(selectedDate);
    formik.setFieldValue("checkOut", selectedDate);
  };

  useEffect(() => {
    if (responseG) {
      toast("Booking has been created!", {
        description: responseG.message,
        action: {
          label: "View Booking",
          onClick: () => navigate(`/profile/bookings`),
        },
      });

      console.log("responseId", responseG._id);
    }
  }, [responseG]);

  useEffect(() => {
    if (error) {
      toast.error("Oops something went wrong", {
        description: error,
      });
    }
  }, [error]);

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Book {title}</CardTitle>
        <CardDescription>
          Enter the booking details below to book a room.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <Label>Check In Date:</Label>
            <Popover className="w-full">
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={handleCheckIn}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formik.touched.checkIn && (
              <p className="text-red-600 text-xs">{formik.errors.checkIn}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Check Out Date:</Label>
            <Popover className="w-full">
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? (
                    format(checkOut, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={handleCheckOut}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formik.touched.checkOut && formik.errors.checkOut ? (
              <div className="text-red-500 text-sm">
                {formik.errors.checkOut}
              </div>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label>Capacity:</Label>

            <Input value={room.capacity} disabled />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Access key will be provided to you after the booking is complete.
            </p>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              <>Create Booking</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
