import express, { RequestHandler } from "express";
import MyUserController from "../Controllers/MyUserController";
import { jwtCheck, jwtParse } from "../../middleware/auth";
import { validateMyUserRequest } from "../../middleware/validation";

const router = express.Router();

router.post("/", jwtCheck, MyUserController.createCurrentUser);
router.put("/", jwtCheck, jwtParse as RequestHandler, validateMyUserRequest,  MyUserController.updateCurrentUser);
router.get("/", jwtCheck, jwtParse as RequestHandler, MyUserController.getCurrentUser);


export default router;