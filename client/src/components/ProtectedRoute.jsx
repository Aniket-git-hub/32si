import { Navigate, Outlet } from "react-router-dom";

export default function ProctectedRoute( { isSignedIn }) {
    return isSignedIn ? <Outlet /> : <Navigate to='/login' replace/> 
}