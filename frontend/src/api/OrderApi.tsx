import { Order } from "@/types";
import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL;

export type CheckoutSessionRequestType = {
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: string;
    }[];

    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string;
    };

    restaurantId: string;
};

export const useCreateCheckoutSession = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createCheckoutSessionRequest = async (checkoutSessionRequest: CheckoutSessionRequestType) => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/order/checkout/create-checkout-session`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(checkoutSessionRequest)
        })

        if(!response.ok){
            throw new Error("Unable to create new checkout Session from Frontend!");
        }

        return response.json();
    }

    const {
        mutateAsync: createCheckoutSession,
        isLoading,
        error,
        reset,
    } = useMutation(createCheckoutSessionRequest);

    if(error){
        toast.error(error.toString());
        reset();
    }

    return { createCheckoutSession, isLoading }
}

export const useGetMyOrders = () => {
    const {getAccessTokenSilently} = useAuth0();

    const getMyOrdersRequest = async(): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/order`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if(!response.ok) {
            throw new Error("Failed to get your orders from frontend!");
        }

        return response.json();
    }

    const {
        data: orders,
        isLoading,
    } = useQuery("fetchMyOrders", getMyOrdersRequest, {
        refetchInterval: 3000,
    });

    return {orders, isLoading}
}