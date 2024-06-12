import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  MoreVertical,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";
import { useBookingContext } from "@/hooks/useBookingContext";
import { formatDate } from "date-fns";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useTransactionContext } from "@/context/transactionContext";
import { useRoomTypeContext } from "@/hooks/useRoomTypeContext";
import { formatPrice } from "@/utils/seperatePrice";
import { useToast } from "@/components/ui/use-toast";

export default function OrderSummary() {
  const { selectedBooking } = useBookingContext();
  const receiptRef = useRef();
  const { transaction } = useTransactionContext();
  const { roomTypes } = useRoomTypeContext();
  const { toast } = useToast();

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });
  const handleCopy = async () => {
    if (!selectedBooking || !selectedBooking.bookingId) {
      console.error("No booking ID to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(selectedBooking.bookingId);
      toast({
        title: "Booking ID copied to clipboard",
      });
    } catch (error) {}
  };

  return (
    <Card ref={receiptRef} className="overflow-hidden size-fit">
      <CardHeader className="flex flex-row gap-10  items-start bg-gray-50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {selectedBooking?.bookingId}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" onClick={handleCopy} />
              <span className="sr-only">Copy Booking ID</span>
            </Button>
          </CardTitle>
          <CardDescription>
            {formatDate(new Date(selectedBooking.createdAt), "MM/dd/yyyy")}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handlePrint}
                className="flex gap-2 items-center flex-row cursor-pointer"
              >
                <File className="h-3.5 w-3.5" />
                Export
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Booking Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {selectedBooking.room.name}
              </span>
              <span>
                Rs.{selectedBooking.room.pricePerNight * selectedBooking.stay}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Duration of stay</span>
              <span>{selectedBooking.stay}</span>
            </li>
          </ul>
          <Separator />

          {selectedBooking.serviceOrders.length > 0 && (
            <>
              <div className="font-semibold">Services</div>
              <ul className="grid gap-3">
                {transaction
                  .filter((t) => selectedBooking.serviceOrders.includes(t._id))
                  .map((transaction) => (
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        <span>
                          {transaction.service.name} x {transaction.quantity}{" "}
                        </span>
                      </span>

                      <span>
                        Rs.
                        {formatPrice(transaction.cost)}
                      </span>
                    </li>
                  ))}{" "}
              </ul>
              <Separator className="my-2" />
            </>
          )}

          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>Rs.{formatPrice(selectedBooking.totalCost)}</span>
            </li>

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>12%</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>Rs.{formatPrice(selectedBooking.totalCost * 1.12)}</span>
            </li>
          </ul>
        </div>

        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Customer Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Customer</dt>
              <dd>{selectedBooking.member.fullName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href="mailto:">{selectedBooking.member.email}</a>
              </dd>
            </div>
          </dl>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Payment Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Visa
              </dt>
              <dd>**** **** **** 4532</dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
