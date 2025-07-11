import { useState } from "react"

import { Link } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"

import {
    Button,
    Form,
    FormProps,
    Input,
    Typography
} from "antd"

import { authAPI } from "../api/authAPI"
import { useTokenContext } from "../hooks"

export type TForm = {
    usernameOrEmail: string,
    password: string
}
export const Login = () => {
    const { setToken } = useTokenContext()

    const [error, setError] = useState<unknown>(null)

    const [form] = Form.useForm()

    const { fetchLogin } = authAPI

    const fetchSignInCallback = async (data: TForm) => {
        try {
            const result = await fetchLogin(data)
            localStorage.setItem('accessToken', result)
            setToken(result)
        } catch (error) {
            console.log(error)
            setError(error)
        }
    }
    const mutation = useMutation({
        mutationKey: ['token'],
        mutationFn: (data: TForm) => fetchSignInCallback(data)
    })

    const onSubmit: FormProps<TForm>['onFinish'] = async (data) => {
        mutation.mutate(data)
    }

    const onFinishFailed: FormProps<TForm>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    return <div className="card">
        <h1>SignIn page</h1>
        <Form
            form={form}
            name="basic"
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            disabled={mutation.isPending}
            onFocus={() => setError(null)}
        >
            <Form.Item<TForm>
                label={'Login'}
                name={'usernameOrEmail'}
                rules={[{ required: true, message: `Please input username or email!` }]}
            >
                <Input minLength={3} maxLength={20} placeholder="Username or Email" />
            </Form.Item>

            <Form.Item<TForm>
                label={'Password'}
                name={'password'}
                rules={[{ required: true, message: `Please input password!` }]}
            >
                <Input.Password minLength={5} maxLength={40} placeholder="Password" autoComplete="false" />
            </Form.Item>

            <Form.Item label={null}>
                <Button
                    type="primary"
                    htmlType="submit"
                >
                    SignIn
                </Button>
            </Form.Item>
        </Form>
        {!!error && <Typography.Text>
            Incorrect Credentials
        </Typography.Text>}
        <p>or</p>
        <Link to='/signup'>
            <h1>SignUp</h1>
        </Link>
    </div>
}
