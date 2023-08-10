import { getCertificate } from "@/controllers"
import { authenticateToken } from "@/middlewares"
import { Router } from "express"

const certificateRouter = Router()

certificateRouter
    .all('/*', authenticateToken)
    .get('/', getCertificate)

export {certificateRouter}