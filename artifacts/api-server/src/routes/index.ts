import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import bookingsRouter from "./bookings";
import reviewsRouter from "./reviews";
import contactsRouter from "./contacts";
import adminRouter from "./admin";
import chatRouter from "./chat";
import newsletterRouter from "./newsletter";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(bookingsRouter);
router.use(reviewsRouter);
router.use(contactsRouter);
router.use(adminRouter);
router.use(chatRouter);
router.use(newsletterRouter);

export default router;
