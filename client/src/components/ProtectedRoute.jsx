import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute( { isSignedIn }) {
    return isSignedIn ? <Outlet /> : <Navigate to='/login' replace/> 
}