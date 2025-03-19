import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async (req: Request, res: Response) => {
    try{
        const {auth0Id} = req.body;

        const existUser = await User.findOne({auth0Id});

        if(existUser) {
            return res.status(200).send();
        }

        const newUser = new User(req.body);
        await newUser.save();
        
        res.status(201).json(newUser.toObject());
    } catch(error){
        res.status(500).json({
            message: error
        })
    }
}   

const updateCurrentUser = async(req: Request, res: Response) => {
    try{
        const { name, addressLine1, city, country } = req.body;

        console.log("received info: ", req.body);

        console.log(req.userId);
        
        const currentUser = await User.findOne({_id: req.userId});

        if(!currentUser){
            console.log("not found user!!!");
            return res.status(404).json({
                message: "user not found"
            })
        }

        currentUser.name = name;
        currentUser.addressLine1 = addressLine1;
        currentUser.city = city;
        currentUser.country = country;

        await currentUser.save();

        console.log("successfully update the user info!");

        res.status(200).json({
            message: "Successfully updated!",
            updatedUser: currentUser.toObject(),
        })

    } catch(error){
        console.log("found error!");
        res.status(500).json({
            message: error
        })
    }
}

const getCurrentUser = async(req: Request, res: Response) => {
    try{
        console.log("received user id: ", req.userId);
        
        const currentUser = await User.findOne({_id: req.userId});

        if(!currentUser){
            console.log("not found user!!!");
            return res.status(404).json({
                message: "user not found"
            });
        }

        console.log("successfully get the user info: ", currentUser.toObject());

        res.status(200).json(currentUser);

    } catch(error){
        console.log("found error!");
        res.status(500).json({
            message: error
        })
    }
}


export default {
    createCurrentUser: createCurrentUser as any,
    updateCurrentUser: updateCurrentUser as any,
    getCurrentUser: getCurrentUser as any,
}