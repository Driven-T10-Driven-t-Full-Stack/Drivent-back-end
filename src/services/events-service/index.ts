import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import dayjs from "dayjs";
import redisClient from "@/utils/redis-utils";

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const cacheKey = "event:1";
  const cachedEvent = await redisClient.get(cacheKey);
  if (cachedEvent) {
    const event = JSON.parse(cachedEvent);
    delete event.createdAt;
    delete event.updatedAt;
    return event;
  } else {
    const event = await eventRepository.findFirst();
    if (!event) throw notFoundError();
    await redisClient.set(cacheKey, JSON.stringify(event));
    return exclude(event, "createdAt", "updatedAt");
  }
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
