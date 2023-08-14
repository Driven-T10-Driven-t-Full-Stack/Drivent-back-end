import activityRepository from "@/repositories/activity-repository";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError, paymentRequiredError } from "@/errors";

async function getAllActivities(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.status !== "PAID") {
    throw paymentRequiredError();
  }
  const activities = await activityRepository.getAllActivities();
  return activities;
}

async function getUserActivities(userId: number) {
  const activities = await activityRepository.getUserActivities(userId);
  return activities;
}

async function createUserActivity(userId: number, activityId: number, isRemote: boolean) {
  await activityRepository.createActivity(userId, activityId, isRemote);
  return;
}

const activityService = {
  getAllActivities,
  getUserActivities,
  createUserActivity,
};

export default activityService;
