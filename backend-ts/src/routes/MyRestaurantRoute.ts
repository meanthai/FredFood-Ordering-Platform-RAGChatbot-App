import express, {Request, Response} from "express";
import multer from "multer";
import MyRestaurantController from "../Controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../../middleware/auth";
import { validateMyRestaurantRequest } from "../../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // 5 Mb
    }
})

router.get("/order", jwtCheck, jwtParse as any, MyRestaurantController.getMyRestaurantOrders);

router.patch("/order", jwtCheck, jwtParse as any, MyRestaurantController.updateMyRestaurantOrdersStatus);

// /api/my/restaurant
router.post(
    "/",
    upload.single("imageFile"),
    jwtCheck,
    jwtParse as any,
    validateMyRestaurantRequest,
    MyRestaurantController.createMyRestaurant
);
  
router.get("/", jwtCheck, jwtParse as any, MyRestaurantController.getMyRestaurant);

router.put("/",  jwtCheck, jwtParse as any, upload.single("imageFile"), validateMyRestaurantRequest, MyRestaurantController.updateMyRestaurant);


export default router;