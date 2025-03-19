import { Order, Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL;

export const useCreateMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createMyRestaurantRequest = async (restaurantFormData: FormData): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();

        console.log(restaurantFormData.entries());
        console.log(Array.from(restaurantFormData.entries()).length);

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: restaurantFormData
        })

        if(!response.ok) {
            throw new Error("Failted to create Restaurant");
        }

        return response.json();
    }

    const {
        mutate: createRestaurant,
        isLoading,
        isSuccess,
        error
    } = useMutation(createMyRestaurantRequest);

    if(isSuccess){
        toast.success("Restaurant created!");
    }

    if(error){
        toast.error("Unable to create restaurant!");
    }

    return {
        createRestaurant, isLoading
    }
}

export const useGetMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyRestaurantRequest = async (): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                // "Content-Type": "application/json",
            },
        });

        if(!response.ok) {
            throw new Error("Cannot get my restaurant!");
        }

        return await response.json();
    }

    const {
        data: myRestaurant,
        isLoading
    } = useQuery("fetchMyRestaurant", getMyRestaurantRequest);

    return { myRestaurant, isLoading }
}

export const useUpdateMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyRestaurantRequest = async(restaurantFormData: FormData): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();

        console.log("body before fetch update restaurant: ", restaurantFormData);

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                // "Content-Type": "application/json",
            },
            body: restaurantFormData,
        })

        if(!response.ok) {
            throw new Error("Cannot update my restaurant!");
        }

        return response.json();
    }

    const {
        mutate: updateRestaurant,
        isLoading,
        isSuccess,
        error
    } = useMutation(updateMyRestaurantRequest);

    if(isSuccess){
        toast.success("Restaurant updated!");
    }

    if(error){
        toast.error("Unable to update restaurant!");
    }

    return { updateRestaurant, isLoading }
}

export const useGetMyRestaurantOrders = () => {
    const {getAccessTokenSilently} = useAuth0();

    const getMyRestaurantOrdersRequest = async(): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            }
        });

        if(!response.ok){
            throw new Error("Fail to fetch to get your restaurant orders from the customers!");
        }

        return response.json();
    }

    const {
        data: orders,
        isLoading
    } = useQuery("fetchMyRestaurantOrders", getMyRestaurantOrdersRequest);

    return { orders, isLoading }
}

type updateOrderStatusRequest = {
    orderId: string,
    status: string,
}

export const useUpdateMyRestaurantOrder = () => {
    const {getAccessTokenSilently} = useAuth0();

    const updateMyRestaurantOrder = async (updateStatusOrderRequest: updateOrderStatusRequest) => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order/${updateStatusOrderRequest.orderId}/status`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: updateStatusOrderRequest })
        });

        if(!response.ok){
            throw new Error("Failed to update of the status order!");
        }

        return response.json();
    }

    const {
        mutateAsync: updateRestaurantStatus,
        isLoading,
        isError,
        isSuccess,
        reset,
    } = useMutation(updateMyRestaurantOrder);

    if(isSuccess){
        toast.success("Order status updated!");
    }

    if(isError){
        toast.error("Error while updating the status of the order!");
        reset();
    }

    return { updateRestaurantStatus, isLoading }
 }