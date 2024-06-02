import { useAuth } from "../context/authContext";

export const checkVerified = () => {
    const { currentUser } = useAuth()
    return currentUser ? currentUser.emailVerified : null
}