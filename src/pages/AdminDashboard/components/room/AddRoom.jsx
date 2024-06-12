import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

import { useRoomTypeContext } from "@/hooks/useRoomTypeContext";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { useAddRoom } from "@/hooks/useAddRoom";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Check, CheckCheckIcon, Cross, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const AddRoom = ({reMount}) => {
  // Form States
  const [key, setKey] = useState(0);

  const [roomNumberStatus, setRoomNumberStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roomNumber, setRoomNumber] = useState(null);
  const [multipleRooms, setMultipleRooms] = useState(1);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState(null);
  const [pricePerNight, setPricePerNight] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const { toast } = useToast();
  const { roomTypes } = useRoomTypeContext();
  const { user } = useAuthContextProvider();
  const { InsertRoom, isLoading, responseG, error } = useAddRoom({reMount});
  const [blog, setBlog] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [notifyGuests, setNotifyGuests] = useState(false);
  const [author, setAuthor] = useState(null);
  const [blogDetails, setBlogDetails] = useState({
    blogTitle,
    blogDescription,
    notifyGuests,
    author,
  });

  useEffect(() => {
    setBlogDetails({
      blogTitle,
      blogDescription,
      notifyGuests,
      author,
    });
    console.log(blogDetails);
  }, [blogTitle, blogDescription, notifyGuests, author]);

  useEffect(() => {
    if (user) {
      setAuthor(user.fullName);
    }
  }, [user]);
  const [roomData, setRoomData] = useState({
    roomNumber,
    description,
    type,
    capacity,
    pricePerNight,
    multipleRooms,
    amenities,
    images,
    blog,
  });
  useEffect(() => {
    setRoomData({
      roomNumber,
      description,
      type,
      capacity,
      pricePerNight,
      multipleRooms,
      amenities,
      images,
      blog,
    });
    console.log(blogDetails);
  }, [
    roomNumber,
    description,
    type,
    capacity,
    pricePerNight,
    multipleRooms,
    amenities,
    images,
    blog,
  ]);
  // Form States

  const checkAvail = async () => {
    setLoading(null);
    setRoomNumberStatus(null);

    try {
      setLoading(true);
      if (roomNumber.trim() === "") {
        setLoading(false);
        return null;
      }

      const response = await axios.post("/api/room/check_room_number", {
        roomNumber,
      });

      if (response.status === 200) {
        setLoading(false);
        setRoomNumberStatus(response.data);
      }
    } catch (err) {
      setLoading(false);
      setRoomNumberStatus(err.response.data);
    }
  };

  const handleImage = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
  };
  const handleRoomNumber = (e) => {
    setRoomNumber(e.target.value);
    setRoomNumberStatus(null);
  };

  useEffect(() => {
    if (responseG) {
      toast({
        title: responseG,
      });
      roomNumber,
        description,
        type,
        capacity,
        pricePerNight,
        multipleRooms,
        amenities,
        images,
        setRoomData({});
      setRoomNumber(null);
      setDescription("");
      setType(null);
      setCapacity(null);
      setPricePerNight(null);
      setMultipleRooms(null);
      setImages([]);
    }
  }, [responseG]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  }, [error]);

  const remountComponent = () => {
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <Card className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(blogDetails);
          InsertRoom(roomData, blogDetails);
        }}
        encType="multipart/form-data"
      >
        <CardHeader>
          <CardTitle className="text-2xl">Add Room</CardTitle>
          <CardDescription>
            Please enter the room details below to create a room.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Room Number</Label>
            <Input
              required
              type="tel"
              placeholder="401"
              value={roomNumber}
              onChange={(e) => handleRoomNumber(e)}
            />
            <div className="flex flex-row justify-between items-center">
              <p className="text-xs text-gray-600">(Must be unique)</p>

              <Button
                size="xs"
                type="button"
                onClick={checkAvail}
                className={`text-xs text-white p-[0.3rem] ${
                  loading
                    ? "bg-gray-400"
                    : roomNumberStatus
                    ? roomNumberStatus.success
                      ? "bg-green-500"
                      : "bg-red-500"
                    : ""
                }`}
                disabled={loading || roomNumberStatus || !roomNumber}
              >
                {loading ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : roomNumberStatus ? (
                  roomNumberStatus.success ? (
                    <>
                      <Check className="h-4 w-4" />
                      Room Number Available
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      Room Number not available
                    </>
                  )
                ) : (
                  <>Check availability</>
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Room Type</Label>
            <Select onValueChange={(e) => setType(e)}>
              <SelectTrigger className="w-100">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Room Type</SelectLabel>
                  {roomTypes &&
                    roomTypes.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.type}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Room Description</Label>
            <Textarea
              required
              type="text"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Room Capacity</Label>
            <Input
              required
              type="tel"
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Room Price per night</Label>
            <Input
              required
              type="tel"
              onChange={(e) => setPricePerNight(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Room Images</Label>
            <Input
              required
              type="file"
              multiple
              accept="image/*"
              onChange={handleImage}
            />

            {images.length !== 0 && (
              <ScrollArea className="flex flex-row overflow-auto gap-4 h-52 mt-5 whitespace-nowrap rounded-md border">
                <div className="flex w-max space-x-4 p-4 border">
                  {images.map((image, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(image)}
                      className="size-cover object-cover rounded-md"
                      alt={`Image ${i}`}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Create Multiple Rooms:</Label>
            <Input
              type="number"
              value={multipleRooms}
              onChange={(e) => setMultipleRooms(e.target.value)}
            />
            <p className="text-muted-foreground text-sm">
              If you want to create multiple rooms, please enter the number of
              rooms you wish to create. Rooms will be created starting from the
              specified room number up to the number of rooms entered.
              Otherwise, leave the number of rooms field blank to create a
              single room.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex flex-row gap-2">
              <Checkbox
                defaultChecked={blog}
                onCheckedChange={() => setBlog((e) => !e)}
              />
              <Label>Add blog post about the room?</Label>
            </div>

            {blog && (
              <Card>
                <CardHeader>
                  <CardTitle>Blog</CardTitle>
                  <CardDescription>Blog Details</CardDescription>
                </CardHeader>
                <CardContent className=" grid gap-4">
                  <div className="grid gap-2">
                    <Label>Blog Title:</Label>
                    <Input
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Blog Content: </Label>
                    <Textarea
                      rows="8"
                      value={blogDescription}
                      onChange={(e) => setBlogDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Author: </Label>
                    <Input rows="8" value={author} disabled />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Checkbox
                      defaultChecked={notifyGuests}
                      onCheckedChange={(e) => setNotifyGuests((e) => !e)}
                    />
                    <Label>Notify Guests About this blog? </Label>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={
              !roomNumber ||
              !description ||
              !capacity ||
              isLoading ||
              multipleRooms === 0
            }
            className="w-full"
          >
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              <>Add Room</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
