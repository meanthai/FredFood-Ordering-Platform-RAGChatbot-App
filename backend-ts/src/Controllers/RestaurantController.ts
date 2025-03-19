import { Request, Response } from "express"
import Restaurant from "../models/restaurant";

const getRestaurants = async(req: Request, res: Response) => {
    try {
        const restaurantId = req.params.restaurantId;

        const restaurant = await Restaurant.findOne({_id: restaurantId});
        
        if(!restaurant){
            return res.status(404).json({
                message: "restaurant not found!",
            });
        }

        res.json(restaurant);
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "error while Getting restaurants id while searching!"});
    }
}

const searchRestaurants = async (req: Request, res: Response) => {
    try {
        console.log("request search params: ", req.params);
        const city = req.params.city;

        console.log("search city: ", city);

        const searchQuery = (req.query.searchQuery as string) || "";
        const selectedCuisines = (req.query.selectedCuisines as string) || "";
        const sortOption = (req.query.sortOption as string) || "lastUpdated";
        const page = parseInt(req.query.page as string) || 1;

        let query: any = {}
        query["city"] = new RegExp(city, "i");

        const numberResults = await Restaurant.countDocuments(query);

        if(!numberResults){
            return res.status(404).json({
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pages: 1,
                }
            });
        }

        if(selectedCuisines) {
            const cuisineArray = selectedCuisines.split(",").map((cuisine) => new RegExp(cuisine, "i"));
            
            query["cuisines"] = {$all: cuisineArray};
        }

        if (searchQuery) {
            const searchRegex = new RegExp(searchQuery, "i");
            query["$or"] = [
              { restaurantName: searchRegex },
              { cuisines: { $in: [searchRegex] } },
            ];
          }

        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const restaurants = await Restaurant.find(query).sort({ [sortOption]: 1}).skip(skip).limit(pageSize).lean();

        const total = await Restaurant.countDocuments(query);

        const response = {
            data: restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / pageSize),
            }
        }

        res.json(response);
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "error while searching for restaurants!"});
    }
}

export default {
    searchRestaurants: searchRestaurants as any,
    getRestaurants: getRestaurants as any,
}