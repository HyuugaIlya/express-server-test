import { useNavigate } from "react-router-dom"

import { Button } from "antd"

export type TUser = {
    id: number | string,
    accountData: {
        username: string,
        email: string
    },
    emailConfirmation: {
        code: string,
        isConfirmed: boolean,
        expirationDate: Date
    }
}
type TProps = {
    children: React.ReactNode
    user: TUser | null
}
export function AuthLayout({
    children,
    user
}: TProps) {
    const navigate = useNavigate()

    return user
        ? user?.emailConfirmation?.isConfirmed
            ? <>
                {children}
            </>
            : <div>
                <p>Need to confirm your email first. Checkout your email.</p>
            </div>
        : <div>
            <p>To proceed you need to login</p>
            <Button onClick={() => navigate('/signin')}>Go to Login Page</Button>
        </div>
}