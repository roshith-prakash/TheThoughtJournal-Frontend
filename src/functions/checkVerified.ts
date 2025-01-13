import { useAuth } from "../context/authContext";

// Function to check if user is verified
export const checkVerified = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { currentUser } = useAuth()
    return currentUser ? currentUser.emailVerified : null
}