import { useAuth } from "./AuthContext";

export default function useMe() {
  const { user, isLoadingAuth } = useAuth();
  
  return {
    data: user,
    isLoading: isLoadingAuth,
  };
}