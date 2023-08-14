import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { createActivity, getAllActivities, getUserActivities } from "@/controllers/activity-controller";
import { activitySchema } from "@/schemas/activities-schemas";

const activitiesRouter = Router();

activitiesRouter.use(authenticateToken);
activitiesRouter.get("/", getAllActivities);
activitiesRouter.get("/user", getUserActivities);
activitiesRouter.post("/", validateBody(activitySchema), createActivity);

export { activitiesRouter };
