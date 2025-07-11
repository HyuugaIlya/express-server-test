import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useTokenContext } from "../hooks"

type TProps = {
    children: React.ReactNode
}
export function RedirectLayout({
    children
}: TProps) {
    const navigate = useNavigate()

    const { token } = useTokenContext()

    useEffect(() => {
        if (token && localStorage.getItem('accessToken')) {
            navigate('/main')
            return
        }
    }, [navigate, token])

    return children
}