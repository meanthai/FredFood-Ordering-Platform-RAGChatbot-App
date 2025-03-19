import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi"
import UserProfileUpdateForm from "@/forms/user-profile-form/UserProfileUpdateForm"

const UserProfilePage = () => {
    const  { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();

    const {currentUser, isLoading: isGetLoading} = useGetMyUser();

    if(isGetLoading){
        return <span>Loading...</span>
    }

    if(!currentUser){
        return <span>Unable to load user profile</span>
    }
    
    return (
        <UserProfileUpdateForm currentUser={currentUser} onsave={updateUser} isLoading={isUpdateLoading}/>
    )
}

export default UserProfilePage