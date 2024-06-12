import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useBookingContext } from "@/hooks/useBookingContext";

import { RecentBookingItem } from "@/globalComponents/RecentBookingItem";

export const RecentBookings = () => {
  const { recentBookings } = useBookingContext();
  return (
    <Card className="w-full">
      <CardHeader className="font-semibold text-xl">
        <p>Recent Bookings</p>
        <p className="text-muted-foreground text-xs">
          Hover over the bookings for more details.
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4">
            {recentBookings && recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <>
                  <RecentBookingItem booking={booking} />
                  <Separator className="my-2" />
                </>
              ))
            ) : (
              <div className="text-center grid items-center font-semibold text-xl">
                No recent bookings
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
