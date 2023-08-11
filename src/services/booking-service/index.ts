import { cannotBookingError, notFoundError } from "@/errors";
import roomRepository from "@/repositories/room-repository";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import tikectRepository from "@/repositories/ticket-repository";

async function checkEnrollmentTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotBookingError();
  }
  const ticket = await tikectRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotBookingError();
  }
}

async function checkValidBooking(roomId: number) {
  const room = await roomRepository.findById(roomId); // ROOM CONTÉM HOTELID!!!!! usar embaixo
  const bookings = await bookingRepository.findByRoomId(roomId);

  if (!room) {
    throw notFoundError();
  }
  if (room.capacity <= bookings.length) {
    throw cannotBookingError();
  }
  return bookings;
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.findByUserId(userId);
  const totalBookings = await bookingRepository.findByRoomId(booking.Room.id);
  if (!booking) {
    throw notFoundError();
  }

  return { ...booking,  totalBookings:totalBookings.length};
}

async function bookingRoomById(userId: number, roomId: number) {
  await checkEnrollmentTicket(userId);
  const bookings = await checkValidBooking(roomId);
  //receber o hotelId de alguma forma e alterar variáveis armazenadas no redis (3 variáveis?????)
  return bookingRepository.create({ roomId, userId });
}

async function changeBookingRoomById(userId: number, roomId: number) {
  await checkValidBooking(roomId);
  const booking = await bookingRepository.findByUserId(userId);

  if (!booking || booking.userId !== userId) {
    throw cannotBookingError();
  }

  return bookingRepository.upsertBooking({
    id: booking.id,
    roomId,
    userId
  });
}

const bookingService = {
  bookingRoomById,
  getBooking,
  changeBookingRoomById,
};

export default bookingService;
