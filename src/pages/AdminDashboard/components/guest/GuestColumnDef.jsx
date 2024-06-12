import { Badge } from "@/components/ui/badge";

import { useBookingContext } from "@/hooks/useBookingContext";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircledIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { format, formatDate } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";
import CopyToClipboard from "react-copy-to-clipboard";

export const GuestColumnDef = [
  {
    accessorKey: "fullName",
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    id: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate">
            {row.getValue("email")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    id: "Phone Number",
    header: "Phone Number",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] font-medium truncate">
            {row.getValue("Phone Number")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "_id",
    id: "Bookings",
    header: "Bookings",
    cell: ({ row }) => {
      const { booking } = useBookingContext();

      const bookings =
        booking &&
        booking.filter((t) => t.member._id === row.original._id.toString());

      if (bookings && bookings.length > 0) {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                {bookings.length.toString()} Bookings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0">
              <DialogHeader className="p-5">
                <DialogTitle className="text-2xl">
                  {row.getValue("name")} Bookings ({bookings.length.toString()})
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[500px] px-5">
                {bookings.map((booking) => (
                  <>
                    <div className="w-full">
                      <div className="grid gap-2">
                        <div className="text-md group flex gap-2 font-medium">
                          {booking.bookingId}
                          <CopyToClipboard text={booking.bookingId}>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">Copy Booking ID</span>
                            </Button>
                          </CopyToClipboard>
                        </div>

                        <div className="flex flex-row justify-between">
                          <span>Room Number:</span>
                          <span>{booking.room.roomNumber}</span>
                        </div>
                        <div className="flex flex-row justify-between">
                          <span>Status</span>
                          <Badge>{booking.status}</Badge>
                        </div>
                        <div className="flex flex-row justify-between">
                          <span>Check-in date:</span>
                          <span className="font-semibold">
                            {formatDate(
                              new Date(booking.checkInDate),
                              "MM-yyyy-dd"
                            )}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between">
                          <span>Check-out date:</span>
                          <span className="font-semibold">
                            {formatDate(
                              new Date(booking.checkOutDate),
                              "MM-yyyy-dd"
                            )}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between">
                          <span>Access key</span>
                          <span>{booking.uniqueKey}</span>
                        </div>
                        {booking.serviceOrders &&
                          booking.serviceOrders.length > 0 && (
                            <div className="flex flex-row justify-between">
                              <span>Service Orders</span>
                              <span className="font-semibold">
                                {booking.serviceOrders.length.toString()}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                    <Separator className="my-5" />
                  </>
                ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        );
      } else {
        return <div>No bookings yet.</div>;
      }
    },
  },
  {
    accessorKey: "_id",
    header: "Total Spent",
    cell: ({ row }) => {
      const { booking } = useBookingContext();

      const bookings =
        booking &&
        booking.filter((t) => t.member._id === row.original._id.toString());

      let totalSpent = 0;
      if (bookings) {
        bookings.forEach((booking) => {
          totalSpent += booking.totalCost;
        });
      }

      return <div className="font-semibold text-md">Rs.{totalSpent}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joining Date",
    cell: ({ row }) => {
      return <div>{format(row.getValue("createdAt"), "MM/dd/yyyy")}</div>;
    },
    isVisible: false,
  },
];
