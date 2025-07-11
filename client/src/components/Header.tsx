import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useLocation } from "react-router"

import { Button } from "antd"

import { authAPI } from "../api/authAPI"

import { TUser } from "../layouts/AuthLayout"

export const Header = ({ user }: { user: TUser | null }) => {
    const location = useLocation()
    const navigate = useNavigate()

    const { fetchLogout } = authAPI

    const logoutCallback = async () => {
        try {
            await fetchLogout()
            localStorage.removeItem('accessToken')
        } catch (error) {
            console.log(error)
            return
        }
        navigate('/')
    }

    const mutation = useMutation({ mutationFn: logoutCallback })

    if (!user?.accountData?.username || !localStorage.getItem('accessToken')) {
        return null
    }

    const handleClick = async () => {
        try {
            mutation.mutate()
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        {location.pathname !== '/main' && <div>
            <Button onClick={() => navigate('/main')}>
                ← Back to main
            </Button>
        </div>}
        <section style={{ display: 'flex', gap: '10px', justifyContent: 'space-evenly' }}>
            <div>
                Current User - {user?.accountData?.username}
            </div>
            <div>
                <Button onClick={handleClick}>Logout</Button>
            </div>
        </section>
    </>
}
