import { useBookingContext } from "@/hooks/useBookingContext";
import OrderSummary from "./OrderSummary";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarOff,
  Plus,
  Upload,
} from "lucide-react";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderService } from "./OrderService";
import { OrderedServices } from "./OrderedServices";
import { useServiceContext } from "@/context/serviceContext";
import { useEffect, useState } from "react";
import { useTransactionContext } from "@/context/transactionContext";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { StayDetails } from "./StayDetails";
import { HouseKeepingService } from "./HousekeepingService";
import { YourRequest } from "./YourRequests";
import WakeUpCallForm from "./WakeUpCallForm";
import { FeedbackModal } from "./FeedbackModal";
import { YourFeedback } from "./YourFeedback";
import { Badge } from "@/components/ui/badge";

export const GuestBookings = () => {
  const { booking, selectedBooking, selectBooking } = useBookingContext();
  const { dispatch, transaction } = useTransactionContext();
  const { user } = useAuthContextProvider();
  const [open, setOpen] = useState(false);
  const { bookingId } = useParams();

  useEffect(() => {
    if (bookingId) {
      selectBooking(bookingId);
    }
  }, [bookingId]);

  useEffect(() => {
    const fetchOrderedServices = async () => {
      try {
        const response = await axios(
          `/api/orderService/get-your-services/${user._id}`
        );

        if (response.status === 200) {
          dispatch({
            type: "SET_TRANSACTIONS",
            payload: response.data.ServiceOrders,
          });
        }
      } catch (err) {}
    };
    if (selectedBooking && user) {
      fetchOrderedServices();
    }
  }, [user, selectedBooking]);

  useEffect(() => {
    if (
      selectedBooking &&
      selectedBooking.status === "checkedOut" &&
      !selectedBooking.feedback
    ) {
      setTimeout(() => {
        setOpen(true);
      }, 3000);
    }
  }, [selectedBooking]);

  const checkedOutStatus =
    selectedBooking && selectedBooking.status === "checkedOut";
  const checkedInStatus =
    selectedBooking && selectedBooking.status === "checkedIn";
  return selectedBooking ? (
    <div className="h-full w-full grid gap-5 scroll-smooth">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-semibold">Bookings</h1>

        <div>
          <Select
            defaultValue={`${
              selectedBooking
                ? selectedBooking.bookingId
                : "You have no bookings"
            }`}
            onValueChange={selectBooking}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select a booking" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bookings</SelectLabel>
                {booking ? (
                  booking.map((booking) => (
                    <SelectItem value={booking.bookingId}>
                      <div className="flex flex-row flex-nowrap gap-2">
                        <span>{booking.bookingId}</span>
                        {booking.status && (
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {booking.status}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-center mx-auto font-semibold">
                    You have no Bookings.
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className={`grid  grid-cols-6 gap-3`}>
        <div className={`grid col-span-4 gap-3 size-fit`}>
          <StayDetails booking={selectedBooking} />
          <YourRequest
            bookingId={selectedBooking._id}
            roomNumber={selectedBooking.room.roomNumber}
          />
          {(checkedInStatus || checkedOutStatus) && <OrderedServices />}
          {!checkedOutStatus && checkedInStatus && <OrderService />}
        </div>
        <div className={`grid col-span-2 size-fit ml-auto gap-5`}>
          {!checkedOutStatus && checkedInStatus ? (
            <>
              <HouseKeepingService booking={selectedBooking} />

              <WakeUpCallForm />
              <div className="mx-auto">

              <OrderSummary />
              </div>
            </>
          ) : (
            <div className="size-full grid gap-3">
              <div className="ml-auto grid gap-10">
                <div className="ml-auto">
                  <OrderSummary />
                </div>
                {!selectedBooking.feedback && checkedOutStatus ? (
                  <FeedbackModal open={open} setOpen={setOpen}>
                    <Button className="w-full flex gap-2">
                      <Plus className="size-4.5" /> Leave A Feedback
                    </Button>
                  </FeedbackModal>
                ) : (
                  <YourFeedback bookingId={selectedBooking._id} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex gap-2 flex-col items-center md:px-20 px-5">
      <CalendarOff className="size-10 text-gray-500" />
      <h1 className="text-2xl font-medium">You Have No Bookings Yet!</h1>
      <p className="">
        It looks like you haven't made any bookings yet. Why not explore our
        options and make your first booking today? We're here to help you with
        any questions you might have. Happy exploring!
      </p>

      <Link to="/rooms">
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <ArrowUpRight className="size-5" />
          Explore Rooms
        </Button>
      </Link>
    </div>
  );
};

export const RoomImages = () => {
  const { selectedBooking } = useBookingContext();
  return (
    <Card className="overflow-hidden size-fit">
      <CardHeader>
        <CardTitle>Room Images</CardTitle>
        <CardDescription>
          Lipsum dolor sit amet, consectetur adipiscing elit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <img
            alt="Product image"
            className="aspect-square w-full rounded-md object-cover"
            height="300"
            src={`/RoomImages/${selectedBooking.room.images[0].filepath}`}
            width="300"
          />
          <div className="grid grid-cols-3 gap-2">
            {selectedBooking.room.images.map((img, index) => (
              <button>
                <img
                  alt="Product image"
                  className="aspect-square w-full rounded-md object-cover"
                  height="84"
                  src={`/RoomImages/${img.filepath}`}
                  width="84"
                />
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
