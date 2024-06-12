import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RecentBookingItem } from "@/globalComponents/RecentBookingItem";
import { useBookingContext } from "@/hooks/useBookingContext";

export const RecentBookings = () => {
  const { booking,recentBookings } = useBookingContext();
  return (
    <Card className="max-w-[500px] h-fit">
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentBookings && recentBookings.length > 0 ? (
          recentBookings.map((booking) => (
            <>
              <RecentBookingItem booking={booking} />
              <Separator className="my-2" />
            </>
          ))
        ) : (
          <div className="font-semibold size-full">No recent bookings.</div>
        )}
      </CardContent>
    </Card>
  );
};
