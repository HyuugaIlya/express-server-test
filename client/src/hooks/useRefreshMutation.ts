import { useMutation } from "@tanstack/react-query"
import { authAPI } from "../api/authAPI"

export const useRefreshMutation = () => {
    const {
        fetchRefresh
    } = authAPI

    const fetchRefreshCallback = async () => {
        try {
            const result = await fetchRefresh()
            return result
        } catch (error) {
            console.log(error)
        }
    }

    const mutation = useMutation({
        mutationKey: ['token'],
        mutationFn: fetchRefreshCallback,
    })

    return mutation
}