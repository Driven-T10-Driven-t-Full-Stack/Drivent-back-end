import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import activityService from "@/services/activity-service";

export async function getAllActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const activities = await activityService.getAllActivities(userId);
    res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "PaymentRequired") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send({
        message: error.message,
      });
    }
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send({
        message: "Enrollment doesn't exist!",
      });
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getUserActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const activities = await activityService.getUserActivities(userId);
    res.status(httpStatus.OK).send(activities);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function createActivity(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const activityId = Number(req.body.activityId);
  try {
    await activityService.createUserActivity(userId, activityId);
    res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
