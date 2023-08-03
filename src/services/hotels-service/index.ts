import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import redisClient from "@/utils/redis-utils";

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getHotels(userId: number) {
  const cacheKey = "hotels:1";
  const cachedHotels = await redisClient.get(cacheKey);
  if (cachedHotels) {
    const hotels = JSON.parse(cachedHotels);
    if (typeof hotels === "object") return [];
    return hotels;
  } else {
    await listHotels(userId);
    const hotels = await hotelRepository.findHotels();
    await redisClient.set(cacheKey, JSON.stringify(cachedHotels));
    return hotels;
  }
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  const cacheKey = `hotel:${hotelId}`;
  const cachedHotel = await redisClient.get(cacheKey);
  if (cachedHotel) {
    return JSON.parse(cachedHotel);
  } else {
    await listHotels(userId);
    const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

    if (!hotel) throw notFoundError();
    await redisClient.set(cacheKey, JSON.stringify(hotel));
    return hotel;
  }
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;
