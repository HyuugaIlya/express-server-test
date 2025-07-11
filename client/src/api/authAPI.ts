import { TForm } from "../components/Login";
import { TSignupForm } from "../components/Signup";

export type TSource = {
    id: number | string,
    title: string
}

export const authAPI = {
    fetchUser: async (token: string | null) => {
        return await fetch('http://localhost:3003/auth/get-user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) throw new Error(data.message)
                return data
            })
    },
    fetchLogin: async (data: TForm) => {
        return await fetch('http://localhost:3003/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: data.usernameOrEmail,
                email: data.usernameOrEmail,
                password: data.password
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.tokens) throw new Error(data.message)
                return data.tokens.accessToken
            })
    },
    fetchSignup: async (data: TSignupForm) => {
        return await fetch('http://localhost:3003/auth/signup', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password
            })
        })
            .then((res) => res.json())
            .then((data) => data.tokens.accessToken)
    },
    fetchRefresh: async () => {
        return await fetch('http://localhost:3003/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => data.tokens.accessToken)
    },
    fetchLogout: async () => {
        return await fetch('http://localhost:3003/auth/logout', {
            method: 'POST',
            credentials: 'include',
        })
    }
}