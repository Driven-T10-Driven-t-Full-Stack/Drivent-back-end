import { Request, Response } from "express";
import httpStatus from "http-status";
import { loginUserWithGitHub } from "../services/auth-service";

export async function login(req: Request, res: Response) {
  const code = req.body.code as string;
  try {
    const token = await loginUserWithGitHub(code);
    res.send({ token });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Something went wrong");
  }
}
