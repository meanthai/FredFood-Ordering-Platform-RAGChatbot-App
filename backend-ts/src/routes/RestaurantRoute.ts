import express from "express"
import { param } from "express-validator";
import Restaurant from "../models/restaurant";
import MyRestaurantController from "../Controllers/MyRestaurantController";
import RestaurantController from "../Controllers/RestaurantController";

const router = express.Router();

router.get("/search/:city", param("city").isString().trim().notEmpty().withMessage("City param must be a valid string!"), RestaurantController.searchRestaurants);

router.get("/:restaurantId", param("restaurantId").isString().trim().notEmpty().withMessage("restaurant ID param must be a valid string!"), RestaurantController.getRestaurants);
export default router;