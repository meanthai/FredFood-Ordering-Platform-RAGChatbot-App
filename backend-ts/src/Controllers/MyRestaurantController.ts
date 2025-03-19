import { Request, Response } from "express"
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/order";

const UploadImage = async(file: Express.Multer.File) => {
    const image = file

    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    return uploadResponse.url;
}

const createMyRestaurant = async (req: Request, res: Response) => {
    try {
        console.log("Request body in the createMyRestaurant: ", req.body);

        const existingRestaurant = await Restaurant.findOne({user: req.userId});

        if(existingRestaurant){
            return res.status(409).json({ message: "user restaurant already existed!" });
        }

        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = await UploadImage(req.file as Express.Multer.File);
        restaurant.user = new mongoose.Types.ObjectId(req.userId);
        restaurant.lastUpdated = new Date();

        console.log("restaurant after updated:", restaurant);

        console.log("Final");

        await restaurant.save();

        res.status(201).send(restaurant);
    } catch (error) {
        console.log("Error creating restaurant: ", error);
        res.status(500).json({ message: "Failed to create your restaurant" });
    
    }
}

const getMyRestaurant = async (req: Request, res: Response) => {
    try {
        console.log("received 'get' restaurant request!");

        const myRestaurant = await Restaurant.findOne({user: req.userId});

        console.log(myRestaurant);

        if(!myRestaurant){
            console.log("not found restaurant!!!");
            return res.status(404).json({ message: "User's restaurant info not found" });
        }

        res.status(200).json(myRestaurant);

    } catch (error) {
        console.log("Error getting restaurant: ", error);
        res.status(500).json({ message: "Failed to get your restaurant" });
    
    }
}

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
      console.log("Received body: ", req.body);
      console.log("Received file: ", req.file);

      const restaurant = await Restaurant.findOne({
          user: req.userId,
      });

      if (!restaurant) {
          return res.status(404).json({ message: "Restaurant not found" });
      }

      console.log("existing restaurant!");

      restaurant.restaurantName = req.body.restaurantName;
      restaurant.city = req.body.city;
      restaurant.country = req.body.country;
      restaurant.deliveryPrice = parseInt(req.body.deliveryPrice, 10);
      restaurant.estimatedDeliveryTime = parseInt(req.body.estimatedDeliveryTime, 10);
      restaurant.cuisines = req.body.cuisines; // Already an array
      restaurant.menuItems = req.body.menuItems; // Already an array of objects
      restaurant.lastUpdated = new Date();

      if (req.file) {
          const imageUrl = await UploadImage(req.file);
          restaurant.imageUrl = imageUrl;
      }

      await restaurant.save();
      res.status(200).json(restaurant);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyRestaurantOrders = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({user: req.userId});

        if(!restaurant){
            res.status(404).json({
                message: "Cannot get your customer's orders cuz your restaurant not found!"
            })
        }

        const orders = await Order.find({
            restaurant: restaurant?._id
        }).populate("restaurant").populate("user");

        res.json(orders);
    } catch(error) {    
        console.log(error);
        res.status(500).json({
            message: "Cannot get your restaurants orders from the custormers!"
        })
    }
}

const updateMyRestaurantOrdersStatus = async (req: Request, res: Response) => {
    try {
        const {orderId} = req.params;

        const {status} = req.body;

        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({
                message: "order not found while trying to update your customers orders status!"
            });
        }

        const restaurant = await Restaurant.findById(order.restaurant?._id);

        if(restaurant?.user?._id.toString() !== req.userId){
            return res.status(401).send(); // not authorized!
        }

        order.status = status;

        await order.save();

        res.status(200).json(order);

    } catch(error) {    
        console.log(error);
        res.status(500).json({
            message: "Cannot update your custormers orders status!"
        })
    } 
}

export default {
    createMyRestaurant: createMyRestaurant as any,
    getMyRestaurant: getMyRestaurant as any,
    updateMyRestaurant: updateMyRestaurant as any,
    getMyRestaurantOrders: getMyRestaurantOrders as any,
    updateMyRestaurantOrdersStatus: updateMyRestaurantOrdersStatus as any,
}