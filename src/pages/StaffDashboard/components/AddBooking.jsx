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
import { useToast } from "@/components/ui/use-toast";
import { useAddBooking } from "@/hooks/useAddBooking";
import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useFormik } from "formik";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export function AddBooking({ userType, bookingBy }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const { isLoading, responseG, error, SubmitBooking } = useAddBooking({
    userType,
    bookingBy,

    setCheckIn: setCheckIn,
    setCheckOut: setCheckOut,
  });
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      room: "",
      member: "",
      checkIn: null,
      checkOut: null,
    },

    validationSchema: Yup.object({
      room: Yup.string().trim().required("Room is required!"),
      member: Yup.string().trim().required("Member is required!"),
      checkIn: Yup.date().required("Check-in date is required!"),
      checkOut: Yup.date().required("Check-out date is required!"),
    }),

    onSubmit: (values) => {
      console.log(values);
      SubmitBooking(values);
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
      toast({
        title: "Booking created successfully!",
        description: responseG,
      });
    }
  }, [responseG]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Oops something went wrong",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create a booking</CardTitle>
        <CardDescription>
          Enter the booking details below to book a room for a member.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <Label>Select Room</Label>
            <RoomCombobox
              onSelectedRoomChange={(roomId) => {
                setSelectedRoom(roomId);
                formik.setFieldValue("room", roomId);
              }}
            />
            {formik.touched.room && (
              <p className="text-red-600 text-xs">{formik.errors.room}</p>
            )}
            <p className="text-muted-foreground text-xs">
              Note: You can assign the room to a guest even if it's not
              available. However, you cannot assign the room if it is booked for
              the selected check-in and check-out dates.
            </p>
          </div>
          <div className="grid gap-2">
            <Label>Select Member</Label>
            <MemberCombobox
              onSelectedMemberChange={(memberId) => {
                setSelectedMember(memberId);
                formik.setFieldValue("member", memberId);
              }}
            />
            {formik.touched.member && (
              <p className="text-red-600 text-xs">{formik.errors.member}</p>
            )}
          </div>
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
            {formik.touched.checkOut && (
              <p className="text-red-600 text-xs">{formik.errors.checkOut}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Access key will be provided to you and the member after the
              booking is complete.
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
