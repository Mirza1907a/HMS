import { useFeedbackContext } from "@/context/feedbackContext";
import { FeedbackCard } from "@/globalComponents/FeedbackCard";
import { useOneRoomPerType } from "@/hooks/useOneRoomPerType";
import { formatPrice } from "@/utils/seperatePrice";
import { useParams } from "react-router-dom";
import { ClientAddBooking } from "../componenets/ClientAddBooking";


export const BookRoom = () => {
  const { roomPerType: rooms, loading } = useOneRoomPerType();
  const { feedback } = useFeedbackContext();

  const { roomId } = useParams();

  console.log("RoomId", roomId);

  const room = rooms && rooms.find((r) => r.type._id === roomId);

  console.log(room);

  const filteredFeedbacks =
    feedback &&
    feedback.length > 0 &&
    feedback.filter((f) => f.room === roomId);
  return (
    room && (
      <div className="h-screen grid grid-cols-2 py-20 place-items-center">
        <div>
          <ClientAddBooking room={room} title={room.name} />
        </div>

        <div className="grid col-span-1 p-10 gap-3">
          <h1 className="text-3xl font-medium">{room.name}</h1>

          <div className="flex flex-row w-fit overflow-auto gap-5">
            {room.images.length > 0 &&
              room.images.map((img) => (
                <div className="shadow-md">
                  <img
                    className="rounded-md border size-[300px] object-cover"
                    src={`/RoomImages/${img.filepath}`}
                  />
                </div>
              ))}
          </div>
          <p className="text-gray-600 font-normal">{room.description}</p>
          <div className="flex flex-row justify-start gap-2 w-fit items-end">
            <span>Price:</span>
            <span className="font-medium">
              Rs.{formatPrice(room.pricePerNight)}
            </span>
          </div>
          <div className="flex flex-row justify-start gap-2 w-fit items-end">
            <span>Capacity:</span>
            <span className="font-medium">{room.capacity} Person</span>
          </div>
        </div>

        <div>
          {filteredFeedbacks &&
            filteredFeedbacks.length > 0 &&
            filteredFeedbacks.map((feedback) => (
              <div key={feedback._id}>
                <FeedbackCard />
              </div>
            ))}
        </div>
      </div>
    )
  );
};
