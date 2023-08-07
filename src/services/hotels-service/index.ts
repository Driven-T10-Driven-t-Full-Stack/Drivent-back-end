import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { Booking } from "@prisma/client";
import roomRepository from "../../repositories/room-repository";
import redisClient from "@/utils/redis-utils";

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  //Não tem ticket ou não foi pago
  if (!ticket || ticket.status === "RESERVED") {
    throw cannotListHotelsError();
  }
  //Serviço não oferecido pelo ticket
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError("Service not included.");
  }
}

async function getHotels(userId: number) {
  const cacheKey = "hotels:1";
  const cachedHotels = await redisClient.get(cacheKey);
  if (cachedHotels) {
    const hotels = JSON.parse(cachedHotels);    
    return hotels;
  } else {
    await listHotels(userId);
    const hotels = await hotelRepository.findHotels();

    //new properties
    const hotelIds = hotels.map((hotel) => hotel.id);
    const roomCapacities = await hotelRepository.getTotalCapacitiesByHotelIds(hotelIds);

    const hotelsWithRoomCapacity = hotels.map((hotel) => {
      const capacitySum = roomCapacities.find((capacity) => capacity.hotelId === hotel.id);
      const { Rooms, ...hotelInfo } = hotel;
      const accomodationTypes = countRoomsByCapacity(Rooms);
      const bookedCount = Rooms.reduce((totalBookings, room) => totalBookings + room.Booking.length, 0);
      return {
        ...hotelInfo,
        availableRoomCapacity: capacitySum?._sum?.capacity - bookedCount || 0,
        accomodationTypes,
      };
    });

    await redisClient.set(cacheKey, JSON.stringify(hotelsWithRoomCapacity));
    return hotelsWithRoomCapacity;
  }

  function countRoomsByCapacity(
    rooms: {
      capacity: number;
      Booking: Booking[];
    }[],
  ) {
    let single = false;
    let double = false;
    let triple = false;

    for (const room of rooms) {
      if (room.capacity === 1) {
        single = true;
      } else if (room.capacity === 2) {
        double = true;
      } else if (room.capacity === 3) {
        triple = true;
      }
    }

    return { single, double, triple };
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
    const roomIds = hotel.Rooms.map((room) => room.id);

    //new properties
    const roomCapacities = await roomRepository.roomCapacityByRoomIds(roomIds);

    const mergedRooms = hotel.Rooms.map((room) => {
      const matchingCapacity = roomCapacities.find((capacity) => capacity.roomId === room.id);
      const count = matchingCapacity ? matchingCapacity._count : 0;
      return { ...room, bookings: count };
    });

    await redisClient.set(cacheKey, JSON.stringify({ ...hotel, Rooms: mergedRooms }));
    return { ...hotel, Rooms: mergedRooms };
  }
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;
