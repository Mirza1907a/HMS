import { useBookingContext } from "@/hooks/useBookingContext";
import { BookingTable } from "./BookingTable";

export const AllBookings = ({user}) => {
  const { booking } = useBookingContext();
  return (
    <div className="grid gap-5 rounded-md border border-slate-100 shadow-sm p-5 overflow-x-auto">
      <div>
        <h1 className="text-2xl font-semibold">All Bookings</h1>
        <p className="text-muted-foreground">
          View and manage all the bookings effortlessly from here.
        </p>
      </div>

      {booking && <BookingTable user={user} />}
    </div>
  );
};
