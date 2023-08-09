import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { createActivity, getAllActivities, getUserActivities } from "@/controllers/activity-controller";

const activitiesRouter = Router();

activitiesRouter.use(authenticateToken);
activitiesRouter.get("/", getAllActivities);
activitiesRouter.get("/user", getUserActivities);
activitiesRouter.post("/", createActivity);

export { activitiesRouter };
