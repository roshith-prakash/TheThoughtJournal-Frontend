import { useAuth } from "../context/authContext";

// Function to check if user is verified
export const checkVerified = () => {
    const { currentUser } = useAuth()
    return currentUser ? currentUser.emailVerified : null
}