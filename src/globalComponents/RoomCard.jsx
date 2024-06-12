import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";


export function RoomCard({ className, room, ...props }) {
  
  return (
    room && (
      <Card className={cn("w-[380px]", className)} {...props}>
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-2xl">Room: {room.name}</CardTitle>
          <CardDescription>
            <Badge className="uppercase font-bold">{room.status}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Carousel className="w-full">
            <CarouselContent>
              {room.images &&
                room.images.length > 0 &&
                room.images.map((img) => (
                  <CarouselItem key={img._id}>
                    <div className="p-0">
                      <Card>
                        <CardContent className="flex w-100 items-center justify-center p-1">
                          <img
                            src={`/RoomImages/${img.filepath}`}
                            className="rounded-md object-fill"
                            alt=""
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>

          <div
            style={{ rowGap: "0.5rem" }}
            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1 max">
              <p className="text-sm font-medium leading-none">
                Room description
              </p>
              <p className="text-sm text-muted-foreground max-h-[10rem] line-clamp-[3] text-ellipsis overflow-hidden">
                {room.description}
              </p>
            </div>
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1 max">
              <p className="text-sm font-medium leading-none ">Room Capacity</p>
              <p className="text-sm text-muted-foreground max-h-[10rem] line-clamp-[3] text-ellipsis overflow-hidden">
                {room.capacity}
              </p>
            </div>
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1 max grid grid-col-2 gap-1">
              <p className="text-sm grid font-medium leading-none ">
                Room Status
              </p>
              <Select
                onValueChange={(value) =>
                  updateRoomStatus({
                    data: { id: room._id, status: value },
                  })
                }
                defaultValue={room.status}
              >
                <SelectTrigger className="w-100">
                  <SelectValue className="bg-black" placeholder={room.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>

                    {statusRoom.map((role, index) => (
                      <SelectItem key={index} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        {user && user.role === "admin" && (
          <CardFooter>
            <Button onClick={deleteRoom} size="icon">
              <TrashIcon className="size-3" />
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  );
}

export const statusRoom = ["cleaning", "occupied", "maintenance", "vacant"];
