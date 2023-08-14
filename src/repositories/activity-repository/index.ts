import { prisma } from "@/config";

async function getAllActivities() {
  const countActivities = await prisma.userActivity.groupBy({
    by: ["activityId"],
    _count: {
      activityId: true,
    },
    orderBy: {
      activityId: "asc",
    },
    where: {
      isRemote: false,
    }
  });
  const activities = await prisma.activity.findMany({
    select: {
      id: true,
      name: true,
      local: true,
      capacity: true,
      isRemote: true,
      startedTime: true,
      finishedTime: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  const result = activities.map((e, index) => {
    const activityCount = countActivities[index]?._count?.activityId || 0;
    const object = {
      id: e.id,
      name: e.name,
      local: e.local,
      isRemote: e.isRemote,
      capacity: e.isRemote === true ? 0 : e.capacity - activityCount,
      startedTime: e.startedTime,
      finishedTime: e.finishedTime,
    };
    return object;
  });
  return result;
}

async function getUserActivities(userId: number) {
  return await prisma.userActivity.findMany({
    where: {
      userId: userId,
    },
  });
}

async function createActivity(userId: number, activityId: number, isRemote: boolean) {
  return await prisma.userActivity.create({
    data: {
      userId: userId,
      activityId: activityId,
      isRemote: isRemote,
    },
  });
}

const activityRepository = {
  getAllActivities,
  getUserActivities,
  createActivity,
};

export default activityRepository;
