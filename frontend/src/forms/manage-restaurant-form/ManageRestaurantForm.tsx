import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z.object({
    restaurantName: z.string({
        required_error: "Restaurant name is required",
    }),
    city: z.string({
        required_error: "city is required",
    }),
    country: z.string({
        required_error: "country is required",
    }),
    deliveryPrice: z.coerce.number({
        required_error: "delivery price is required",
        invalid_type_error: "must be a valid number",
    }),
    estimatedDeliveryTime: z.coerce.number({
        required_error: "estimated delivery time is required",
        invalid_type_error: "must be a valid number",
    }),
    cuisines: z.array(z.string()).nonempty({
        message: "please select at least one item",
    }),
    menuItems: z.array(z.object({
            name: z.string().min(1, "name is required"),
            price: z.coerce.number().min(1, "price is required"),
            description: z.string().min(1, "description of menu item must be required"),
        })
    ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "image is required" }).optional(),
})
.refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image URL or image File must be provided",
    path: ["imageFile"],
  });

type RestaurantFormData = z.infer<typeof formSchema>

type Props = {
    onsave: (restaurantFormData: FormData) => void;
    isLoading: boolean,
    myRestaurant?: Restaurant,
}

const ManageRestaurantForm = ({myRestaurant, onsave , isLoading}: Props) => {
    const form = useForm<RestaurantFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            restaurantName: "",
            city: "",
            country: "",
            deliveryPrice: 0,
            estimatedDeliveryTime: 0,
            cuisines: [],
            menuItems: [{
                name: "",
                price: 0,
                description: "",
            }],
            imageUrl: "",
            imageFile: undefined,
        }
    });

    useEffect(() => {
        if(!myRestaurant){
            return;
        }      

        const deliveryPriceFormatted = parseInt((myRestaurant.deliveryPrice / 100).toFixed(2));

        const menuItemsFormatted = myRestaurant.menuItems.map((item) => ({
            ...item,
            price: parseInt((item.price / 100).toFixed(2)),
        }));

        const updatedRestaurant = {
            ...myRestaurant,
            deliveryPrice: deliveryPriceFormatted,
            menuItems: menuItemsFormatted
        }

        form.reset(updatedRestaurant);
        
    }, []);

    const onsubmit = (formDataJson: RestaurantFormData) => {
        const formData = new FormData();

        formData.append("restaurantName", formDataJson.restaurantName);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);

        formData.append("deliveryPrice", (formDataJson.deliveryPrice * 100).toString());
        formData.append("estimatedDeliveryTime", formDataJson.estimatedDeliveryTime.toString());

        formDataJson.cuisines.forEach((cuisine, index) => {
            formData.append(`cuisines[${index}]`, cuisine);
        });

        formDataJson.menuItems.forEach((menuItem, index) => {
            formData.append(`menuItems[${index}][name]`, menuItem.name);
            formData.append(`menuItems[${index}][price]`, (menuItem.price * 100).toString());
            formData.append(`menuItems[${index}][description]`, menuItem.description);
        });

        if(formDataJson.imageFile){
            formData.append("imageFile", formDataJson.imageFile);
        }

        console.log("formDataJson before fetch update restaurant: ", formDataJson);

        onsave(formData);
    }

    return (
        <Form {...form}>
            <form onSubmit={(e) => {
                e.preventDefault(); // Prevent default browser behavior
                form.handleSubmit(onsubmit)(e); // Use React Hook Form's submission handler
            }} 
            className="space-y-8 bg-gray-50 p-10 rounded-lg">
                <DetailsSection/>
                <Separator/>
                <CuisinesSection/>
                <Separator/>
                <MenuSection/>
                <Separator/>
                <ImageSection/>
                {
                    isLoading ? (<LoadingButton/>) : (<Button type="submit" className="bg-orange-500">Submit</Button>)
                }
            </form>
        </Form>
    );
}

export default ManageRestaurantForm;