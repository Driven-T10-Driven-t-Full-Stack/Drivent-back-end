import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany({ include: { Rooms: { select: { capacity:true, Booking: true } } } });
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

async function getTotalCapacitiesByHotelIds(hotelIds: number[]) {
  return prisma.room.groupBy({
    where: { hotelId: { in: hotelIds } },
    by: ['hotelId'],
    _sum: { capacity: true },
  });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  getTotalCapacitiesByHotelIds,
};

export default hotelRepository;
