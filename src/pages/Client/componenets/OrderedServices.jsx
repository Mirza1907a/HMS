import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTransactionContext } from "@/context/transactionContext";
import { useBookingContext } from "@/hooks/useBookingContext";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

export const OrderedServices = () => {
  const { transaction } = useTransactionContext();
  const { selectedBooking } = useBookingContext();

  return (
    <Card className="text-black h-fit w-full place-content-start">
      <CardHeader>
        <CardTitle className="text-2xl">Ordered Services</CardTitle>
        <CardDescription>
          Here you can see your ordered services.
        </CardDescription>
      </CardHeader>

      {selectedBooking.serviceOrders.length > 0 ? (
        <CardContent className="grid grid-cols-3 gap-5">
          {transaction
            .filter((t) => selectedBooking.serviceOrders.includes(t._id))
            .map((transaction) => (
              <div
                className="grid col-span-1 relative rounded-sm shadow-xl"
                key={transaction._id}
              >
                <img
                  src={`/ServiceImages/${transaction.service.image}`}
                  className="object-cover rounded-lg"
                />
                <div className="absolute text-center flex items-center justify-center text-white inset-0 bg-overlay">
                  <h1 className="text-xl">
                    {transaction.quantity} x {transaction.service.name}
                  </h1>
                </div>
              </div>
            ))}
        </CardContent>
      ) : (
        <CardContent className="size-full text-center grid gap-2 place-items-center">
          <p className="text-md font-medium">
            {selectedBooking.status === "checkedOut" &&
            !selectedBooking.serviceOrders.length > 0 ? (
              <>Your didn't order any services for this booking.</>
            ) : (
              <>You haven't ordered any services yet.</>
            )}
          </p>

          {selectedBooking.status !== "checkedOut" && (
            <>
              <a href="#services" className="scroll-smooth">
                <Button className="bg-indigo-600 w-fit">Order Service</Button>
              </a>
              <ArrowDown className="animate-bounce size-4" />
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};
