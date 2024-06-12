import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "date-fns";

export const StayDetails = ({ booking }) => {
  return (
    <Card className="size-fit">
      <CardHeader>
        <CardTitle className="text-2xl">Stay Details</CardTitle>

        <CardDescription>
          Details about your current stay, including room number, check-in and
          check-out dates, and room Access Key.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-none grid gap-3 text-sm">
          <li className="flex justify-between">
            <h3 className="font-medium text-md">Room Number:</h3>
            <span className="text-gray-800">{booking.room.roomNumber}</span>
          </li>
          <li className="flex justify-between">
            <h3 className="font-medium text-md">Check-in:</h3>
            <span className="text-gray-800">
              {formatDate(new Date(booking.checkInDate), "MM/dd/yyyy")}
            </span>
          </li>
          <li className="flex justify-between">
            <h3 className="font-medium text-md">Check-out:</h3>
            <span className="text-gray-800">
              {formatDate(new Date(booking.checkOutDate), "MM/dd/yyyy")}
            </span>
          </li>
          <li className="flex justify-between">
            <h3 className="font-medium text-md">Room Access Key:</h3>
            <span className="font-semibold">{booking.uniqueKey}</span>
          </li>
          <li className="flex justify-between">
            <h3 className="font-medium text-md">Current Booking Status:</h3>
            <span className="font-semibold">{booking.status}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
