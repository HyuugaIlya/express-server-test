import { useContext } from "react"
import { TokenContext } from "../context/TokenContext"

export const useTokenContext = () => {
    return useContext(TokenContext)
}