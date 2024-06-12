import { socket } from "@/socket";
import axios from "axios";
import { isToday } from "date-fns";
import { useEffect, createContext, useReducer } from "react";

export const BookingContext = createContext();

export const BookingReducer = (state, action) => {
  switch (action.type) {
    case "SET_BOOKINGS":
      const todayBookings = action.payload.filter((booking) =>
        isToday(new Date(booking.createdAt))
      );
      return {
        booking: action.payload,
        recentBookings: todayBookings,
        selectedBooking: action.payload.length > 0 ? action.payload[0] : null,
      };
    case "NEW_BOOKING":
      const isTodayBooking = isToday(new Date(action.payload.createdAt));
      return {
        booking: state.booking
          ? [action.payload, ...state.booking]
          : [action.payload],
        recentBookings: isTodayBooking
          ? state.recentBookings
            ? [action.payload, ...state.recentBookings]
            : [action.payload]
          : state.recentBookings,
        selectedBooking: action.payload,
      };
    case "UPDATE_BOOKING_STATUS":
      const updatedStatus = state.booking.map((booking) => {
        if (booking._id === action.payload._id) {
          return {
            ...booking,
            status: action.payload.status,
          };
        }
        return booking;
      });
      const updatedRecentBookingStatus = state.recentBookings.map((booking) => {
        if (booking._id === action.payload._id) {
          return {
            ...booking,
            status: action.payload.status,
          };
        }
        return booking;
      });
      return {
        ...state,
        booking: updatedStatus,
        recentBookings: updatedRecentBookingStatus,
        selectedBooking:
          state.selectedBooking?._id === action.payload._id
            ? {
                ...state.selectedBooking,
                status: action.payload.status,
              }
            : state.selectedBooking,
      };
    case "UPDATE_FEEDBACK_AND_PAID":
      const updatedFeedbackandPaid = state.booking.map((booking) => {
        if (booking._id === action.payload._id) {
          return {
            ...booking,
            feedback: action.payload.feedback,
            paid: action.payload.paid,
          };
        }
        return booking;
      });
      return {
        ...state,
        booking: updatedFeedbackandPaid,

        selectedBooking:
          state.selectedBooking?._id === action.payload._id
            ? {
                ...state.selectedBooking,
                paid: action.payload.paid,
                feedback: action.payload.feedback,
              }
            : state.selectedBooking,
      };
    case "UPDATE_BOOKING_SERVICE_ORDERS":
      const updatedBookings = state.booking.map((booking) => {
        if (booking._id === action.payload._id) {
          return {
            ...booking,
            serviceOrders: action.payload.serviceOrders,
            serviceCost: action.payload.serviceCost,
            totalCost: action.payload.totalCost,
          };
        }
        return booking;
      });

      const updatedRecentBookings = state.recentBookings.map((booking) => {
        if (booking._id === action.payload._id) {
          return {
            ...booking,
            serviceOrders: action.payload.serviceOrders,
            serviceCost: action.payload.serviceCost,
            totalCost: action.payload.totalCost,
          };
        }
        return booking;
      });

      return {
        ...state,
        booking: updatedBookings,
        recentBookings: updatedRecentBookings,
        selectedBooking:
          state.selectedBooking?._id === action.payload._id
            ? {
                ...state.selectedBooking,
                serviceOrders: action.payload.serviceOrders,
                serviceCost: action.payload.serviceCost,
                totalCost: action.payload.totalCost,
              }
            : state.selectedBooking,
      };
    case "DELETE_BOOKING":
      return {
        booking: state.booking
          ? state.booking.filter((w) => !action.payload.includes(w._id))
          : [],
        recentBookings: state.recentBookings
          ? state.recentBookings.filter((w) => !action.payload.includes(w._id))
          : [],
      };

    case "CLEAR_BOOKING":
      return {
        booking: null,
      };
    case "SELECT_BOOKING":
      return {
        ...state,
        selectedBooking: action.payload,
      };
    default:
      return state;
  }
};
export const BookingContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BookingReducer, {
    booking: null,
    recentBookings: null,
    selectedBooking: null,
  });

  const selectBooking = (bookingId) => {
    const selectedBooking = state.booking.find(
      (b) => b.bookingId === bookingId
    );
    dispatch({ type: "SELECT_BOOKING", payload: selectedBooking });
  };

  useEffect(() => {
    const newBooking = (booking) => {
      dispatch({ type: "NEW_BOOKING", payload: booking });
    };

    const deleteBooking = (booking) => {
      dispatch({ type: "DELETE_BOOKING", payload: booking });
      console.log("booking delete", booking);
    };
    const updateBookingServices = (booking) => {
      dispatch({ type: "UPDATE_BOOKING_SERVICE_ORDERS", payload: booking });
    };

    const bookingStatus = (booking) => {
      dispatch({ type: "UPDATE_BOOKING_STATUS", payload: booking });
    };

    socket.on("bookingStatus", bookingStatus);
    socket.on("newBooking", newBooking);
    socket.on("bookingDelete", deleteBooking);
    socket.on("updateBookingService", updateBookingServices);

    return () => {
      socket.off("newBooking", newBooking);
      socket.off("bookingDelete", deleteBooking);
      socket.off("updateBookingService", updateBookingServices);
      socket.off("bookingStatus", bookingStatus);
    };
  }, [socket, dispatch]);

  console.log("BookingContext state: ", state);
  return (
    <BookingContext.Provider value={{ ...state, dispatch, selectBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
