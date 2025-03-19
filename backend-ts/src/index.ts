import express, {Response, Request} from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import myUserRoute from './routes/MyUserRoute';
import { v2 as cloudinary} from "cloudinary";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";

async function DBInitialization() {
    const client = new MongoClient(String(process.env.MONGODB_CONNECTION_STRING));
    
    try {
        const ok = await client.connect();
        console.log(ok)

        const moviesCollection = client.db("sample_mflix").collection("movies");
        
        console.log("successfully connect to the Mongo database!");

        return moviesCollection;
    } catch (e) {
        console.error(e);
    }
}
const app = express();
app.use(cors());
app.use("api/order/checkout/webhook", express.raw({type: "*/*"}));
app.use(express.json());

app.use('/api/my/restaurant', myRestaurantRoute)
app.use('/api/restaurant', restaurantRoute);
app.use('/api/my/user', myUserRoute);
app.use('/health', async(req: Request, res: Response) => {
    res.send({ message: "OK!"});
})
app.use('/api/order', orderRoute);

mongoose.connect(String(process.env.MONGODB_CONNECTION_STRING))
.then(() => {
    console.log("Successfully connect to the MongoDB database");
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(4046, () => {
    console.log("Backend server started on the port 4046");
})