import { useQuery } from "@tanstack/react-query"
import { authAPI } from "../api/authAPI"

export const useUserQuery = (accessToken: string | null) => {
    const {
        fetchUser
    } = authAPI

    const fetchUserCallback = async () => {
        const data = await fetchUser(localStorage.getItem('accessToken'))
        return data
    }

    const query = useQuery({
        queryKey: ['user'],
        queryFn: fetchUserCallback,
        enabled: !!accessToken,
        refetchOnWindowFocus: false
    })

    return query
}