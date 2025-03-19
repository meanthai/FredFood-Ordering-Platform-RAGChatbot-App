import { useCreateCheckoutSession } from "@/api/OrderApi";
import { useGetRestaurants } from "@/api/RestaurantApi";
import CheckoutButton from "@/components/CheckoutButton";
import MenuItemCard from "@/components/MenuItemCard";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { Card, CardFooter } from "@/components/ui/card";
import { UserFormData } from "@/forms/user-profile-form/UserProfileUpdateForm";
import { MenuItem } from "@/types";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type CartItem = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

const DetailPage = () => {
    const {restaurantId} = useParams();
    const {restaurant , isLoading} = useGetRestaurants(restaurantId);

    const { createCheckoutSession, isLoading: isCreateCheckoutSessionLoading } = useCreateCheckoutSession();

    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);

        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });

    const addToCart = (menuItem: MenuItem) => {
        setCartItems((prevCartItems) => {
            const existingCartItem = prevCartItems.find((cartItem) => cartItem._id === menuItem._id);

            let updatedCartItems; 

            if(existingCartItem) {
                updatedCartItems = prevCartItems.map((cartItem) => 
                    cartItem._id === menuItem._id ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem)
            }
            else {
                updatedCartItems = [
                    ...prevCartItems,
                    {
                        _id: menuItem._id,
                        name: menuItem.name,
                        price: menuItem.price,
                        quantity: 1,
                    }
                ]
            }

            sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(updatedCartItems));

            return updatedCartItems;
        });
    }

    const removeCartItem = (CartItem: CartItem) => {
        setCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems.filter((item) => CartItem._id != item._id);

            sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(updatedCartItems));

            return updatedCartItems;
        });
    }

    const onCheckout = async (userFormData: UserFormData) => {
        console.log("userFormData: ", userFormData);

        if(!restaurantId) {
            return;
        }

        const checkoutData = {
            cartItems: cartItems.map((cartItem) => ({
                menuItemId: cartItem._id,
                name: cartItem.name,
                quantity: cartItem.quantity.toString(),
            })),
            deliveryDetails: {
                email: userFormData.email as string,
                name: userFormData.name,
                addressLine1: userFormData.addressLine1,
                city: userFormData.city,
            },
            restaurantId: restaurantId,
        }

        const checkoutResponse = await createCheckoutSession(checkoutData);

        window.location.href = checkoutResponse.url;
    }

    if(isLoading) {
        return <span>Loading...</span>
    }

    if(!restaurant){
        return <span>Restaurant not found!</span>
    }

    console.log("Restaurant detail page: ", restaurant);

    console.log("cart items length: ", cartItems.length);

    return (
        <div className="flex flex-col gap-10">
            <AspectRatio ratio={16/5}>
                <img src={restaurant.imageUrl} className="rounded-md object-cover h-full w-full"/>
            </AspectRatio>

            <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">

                <div className="flex flex-col gap-4">
                    <RestaurantInfo restaurant={restaurant}/>    

                    <span className="text-2xl font-bold tracking-tight">
                        Menu
                    </span>

                    {
                        restaurant.menuItems.map((menuItem) => (
                            <MenuItemCard menuItem={menuItem} addToCart={() => addToCart(menuItem)} />
                        ))
                    }
                </div>

                <div>
                    <Card>
                        <OrderSummary restaurant={restaurant} cartItems={cartItems} removeFromCart={removeCartItem}/>
                        
                        <CardFooter>
                            <CheckoutButton disabled={!cartItems.length} onCheckout={onCheckout} isLoading={isCreateCheckoutSessionLoading}/>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DetailPage;