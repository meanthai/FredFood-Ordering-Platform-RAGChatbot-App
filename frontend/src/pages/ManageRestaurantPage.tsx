import { useCreateMyRestaurant, useGetMyRestaurant, useGetMyRestaurantOrders, useUpdateMyRestaurant } from "@/api/MyRestaurantAPI";
import OrderItemCard from "@/components/OrderItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";

const ManageRestaurantPage = () => {
    const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();

    const { myRestaurant, isLoading: isGetLoading} = useGetMyRestaurant();

    const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();

    const {orders, isLoading} = useGetMyRestaurantOrders();

    console.log("my restaurant from page: ", myRestaurant);

    if(isGetLoading){
        return <span>...Loading</span>
    }

    if(!myRestaurant){
        return <span>Unable to get your current restaurant Info</span>
    }

    console.log("myRestaurant info: ", myRestaurant);

    const isEditing = !!myRestaurant; // Check if the restaurant already existed

    console.log("isEditting? : ", isEditing);

    return (
        <Tabs defaultValue="orders">
            <TabsList>
                <TabsTrigger value="orders">
                    Orders
                </TabsTrigger>

                <TabsTrigger value="manage-restaurant">
                    Manage Restaurant
                </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-5 bg-gray-50 pg-10 rounded-lg">
                <h2 className="text-2xl font-bold">{orders?.length} active orders!</h2>
                {
                    orders?.map(order => (
                        <OrderItemCard order={order}/>
                    ))
                }
            </TabsContent>

            <TabsContent value="manage-restaurant">
                <ManageRestaurantForm
                    myRestaurant={myRestaurant} 
                    onsave={isEditing ? updateRestaurant : createRestaurant} 
                    isLoading={isCreateLoading || isUpdateLoading}
                />
            </TabsContent>
        </Tabs>
    )
}

export default ManageRestaurantPage;