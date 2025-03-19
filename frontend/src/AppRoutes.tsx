import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./layouts/layout"
import HomePage from "./pages/HomePage"
import AuthCallbackPage from "./pages/AuthCallbackPage"
import UserProfilePage from "./pages/UserProfilePage"
import ProtectedRoute from "./Auth/ProtectedRoute"
import ManageRestaurantPage from "./pages/ManageRestaurantPage"
import SearchPage from "./pages/SearchPage"
import DetailPage from "./pages/DetailPage"
import OrderStatusPage from "./pages/OrderStatusPage"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout showBgImage={true}><HomePage/></Layout>}/>

            <Route path="/auth-callback" element={<AuthCallbackPage/>}/>

            <Route path="/search/:city" element={<Layout showBgImage={false}><SearchPage/></Layout>}/>

            <Route path="/detail/:restaurantId" element={<Layout showBgImage={false}><DetailPage/></Layout>}/>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute/>}>
                <Route path="/order-status" element={<Layout showBgImage={false}><OrderStatusPage/></Layout>}/> 

                <Route path="/user-profile" element={<Layout showBgImage={false}><UserProfilePage/></Layout>}/> 
                
                <Route path="/manage-restaurant" element={<Layout showBgImage={false}><ManageRestaurantPage/></Layout>}/> 
            </Route>

            <Route path="*" element={<Navigate to="/"/>}/>

        </Routes>
    )
}

export default AppRoutes