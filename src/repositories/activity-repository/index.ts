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
  });
  const activities = await prisma.activity.findMany({
    select: {
      id: true,
      name: true,
      local: true,
      capacity: true,
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
      name: e.id,
      local: e.local,
      capacity: e.capacity - activityCount,
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

async function createActivity(userId: number, activityId: number) {
  return await prisma.userActivity.create({
    data: {
      userId: userId,
      activityId: activityId,
    },
  });
}

const activityRepository = {
  getAllActivities,
  getUserActivities,
  createActivity,
};

export default activityRepository;
