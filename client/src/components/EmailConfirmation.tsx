import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router"

export const EmailConfirmation = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const code = location.search.split("=")[1]
        if (code) {
            fetch('http://localhost:3003/auth/confirm-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) }).then(() => {
                console.log('Successfully confirmed!')
                navigate('/')
            })
            return
        }
    }, [location, navigate])

    return <>
        <div>
            <p>Confirm Email</p>
        </div>
    </>
}