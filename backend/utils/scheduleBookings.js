const { formatDate } = require("date-fns");
const { sendEmail } = require("../controllers/emailController");
const {
  sendNotificationToAdmins,
  sendNotificationAllStaff,
  sendNotification,
} = require("../controllers/notificationController");
const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");

const checkInBookings = async (req) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingsToCheckIn = await Booking.find({
      checkInDate: { $eq: today },
      status: "booked",
    }).populate("member");

    if (bookingsToCheckIn.length === 0) {
      return null;
    }

    for (const booking of bookingsToCheckIn) {
      booking.status = "checkedIn";
      await booking.save();

      const room = await Room.findById(booking.room);
      room.status = "occupied";
      await room.save();

      await sendNotificationToAdmins(
        req,
        `Guest checked in to room ${room.roomNumber}.`,
        `Booking status updated to checkedIn and room status updated to occupied.`,
        `/booking/${booking._id}`
      );

      await sendNotificationAllStaff(
        req,
        `Guest checked in to room ${room.roomNumber}.`,
        `Booking status updated to checkedIn and room status updated to occupied.`,
        ""
      );
      await sendNotification(
        req,
        "Booking Status Update: Check-In Successful",
        "Your check-in is complete. Welcome to your stay!",
        `/profile/bookings/${booking._id}`,
        "member",
        booking.member._id
      );
      const checkIn = formatDate(booking.checkInDate, "MM/yyyy/dd");

      setImmediate(async () => {
        const htmlContent = `
          <h1>Check-in successful</h1>
          <p>Check-in details:</p>
          <ul>
            <li>Room Number: ${room.roomNumber}</li>
            <li>Check-In Date: ${checkIn}</li>
          </ul>
          <p>Thank you for staying with us!</p>
        `;

        try {
          await sendEmail(
            booking.member.email,
            "Booking Confirmation!",
            `Booking Details: \n BookingId: ${booking.bookingId} `,
            htmlContent
          );
        } catch (error) {
          console.error("Error sending booking confirmation email:", error);
        }
      });

      const guestIdString = booking.member._id.toString();
      const socketId = req.guestSockets[guestIdString];
      if (socketId) {
        req.io.to(socketId).emit("bookingStatus", booking);
      } else {
        console.log(`Socket ID not found for guest with ID: ${guestIdString}`);
      }
      Object.values(req.staffSockets).forEach((socketId) => {
        req.io.to(socketId).emit("bookingStatus", booking);
      });

      Object.values(req.userSockets).forEach((socketId) => {
        req.io.to(socketId).emit("bookingStatus", booking);
      });

      console.log(
        `Booking status updated to checkedIn for booking ID: ${booking._id}`
      );
    }
  } catch (error) {
    console.error("Error updating bookings to checkedIn:", error);
  }
};
const checkOutBookings = async (req, res) => {
  try {
    const now = new Date();
    console.log(now);

    const pastBookings = await Booking.find({
      checkOutDate: { $eq: now },
      status: "checkedIn",
    })
      .populate("member")
      .populate("room");
    if (pastBookings.length === 0) {
      return null;
    }

    for (const booking of pastBookings) {
      booking.status = "checkedOut";
      await booking.save();

      const room = await Room.findById(booking.room);
      room.status = "cleaning";
      room.availibility = "available";
      const newRoom = await room.save();

      await sendNotificationToAdmins(
        req,
        `A Member checked out of ${room.roomNumber}.`,
        `Room status is updated to ${newRoom.status}!`
      );

      await sendNotificationAllStaff(
        req,
        `A Member checked out of ${room.roomNumber}.`,
        `Room ${newRoom.roomNumber} is ${newRoom.availibility} now and room status is updated to ${newRoom.status}!`
      );
      await sendNotification(
        req,
        "Booking Status Update: Check-Out Complete",
        "Your check-out is complete. We hope you enjoyed your stay!",
        `/profile/bookings/${booking._id}`,
        "member",
        booking.member._id
      );

      const checkIn = formatDate(booking.checkInDate, "MM/yyyy/dd");
      const checkOut = formatDate(booking.checkOutDate, "MM/yyyy/dd");

      setImmediate(async () => {
        const htmlContent = `
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="padding: 0 20rem; display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h3 style="color: #666; font-size: 18px; margin-bottom: 10px;">Dear ${
              booking.member.fullName
            },</h3>
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Check-out successful!</h1>
            <p>We are delighted to inform you that your check-out process has been successfully completed.</p>
            <p><strong>Booking Details:</strong></p>
            <ul>
                <li><strong>Booking ID:</strong> ${booking.bookingId}</li>
                <li><strong>Room:</strong> ${booking.room.name}</li>
                <li><strong>Check-In Date:</strong> ${checkIn}</li>
                <li><strong>Check-Out Date:</strong> ${checkOut}</li>
                <li><strong>Total Duration of Stay:</strong> ${
                  booking.stay
                }</li>
                <li><strong>Total Amount Paid:</strong> ${
                  booking.totalCost
                }</li>
                <li><strong>Total Services Ordered:</strong> ${booking.serviceOrders.length.toLocaleString()}</li>
            </ul>
            <p>We hope you had a pleasant stay with us and that you enjoyed our hospitality. Should you have any further inquiries or require assistance, please do not hesitate to reach out to our reception staff.</p>
            <p>Thank you for choosing to stay with us. We look forward to welcoming you back in the future!</p>
            <p>Best regards,<br>Abdul Saboor<br>saboordevelops@gmail.com<br>Luxury Stay</p>
        </div>
    </div>
</body>
        `;

        try {
          await sendEmail(
            booking.member.email,
            "Check-out successful!",
            "",
            htmlContent
          );
        } catch (error) {
          console.error("Error sending booking confirmation email:", error);
        }
      });

      const guestIdString = booking.member._id.toString();
      const socketId = req.guestSockets[guestIdString];
      if (socketId) {
        req.io.to(socketId).emit("bookingStatus", booking);
      } else {
        console.log(`Socket ID not found for guest with ID: ${guestIdString}`);
      }
      Object.values(req.staffSockets).forEach((socketId) => {
        req.io.to(socketId).emit("bookingStatus", booking);
      });

      Object.values(req.userSockets).forEach((socketId) => {
        req.io.to(socketId).emit("bookingStatus", booking);
      });
    }

    console.log(`Checked and updated ${pastBookings.length} past bookings.`);
  } catch (error) {
    console.error("Error updating bookings after checkout:", error);
  }
};

module.exports = { checkOutBookings, checkInBookings };
