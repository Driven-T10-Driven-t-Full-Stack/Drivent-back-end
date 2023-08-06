import { prisma } from '@/config';

async function findAllByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
  });
}

async function findById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function roomCapacityByRoomIds(roomIds: number[]) {
  return prisma.booking.groupBy({
    where: { roomId: { in: roomIds } },
    by: ['roomId'],
    _count: true,
  });
}

const roomRepository = {
  findAllByHotelId,
  findById,
  roomCapacityByRoomIds
};

export default roomRepository;
