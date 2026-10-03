import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/** Sends signed-out visitors to the login page, remembering where they wanted to go. */
export default function RequireAuth({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
    return children;
}

/** For /login and /register: once signed in, continue to the page that asked for it. */
export function RedirectIfAuthenticated({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    if (isAuthenticated) {
        const from = location.state?.from;
        return <Navigate to={from ? `${from.pathname}${from.search ?? ""}` : "/"} replace />;
    }
    return children;
}
