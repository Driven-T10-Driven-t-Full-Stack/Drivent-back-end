import Joi from "joi";

export const activitySchema = Joi.object({
  activityId: Joi.number().integer().required(),
  isRemote: Joi.boolean().required(),
});
