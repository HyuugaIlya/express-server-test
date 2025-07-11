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

export type TSignupForm = {
    username: string,
    email: string,
    password: string
}
export const SignUp = () => {
    const { setToken } = useTokenContext()

    const [error, setError] = useState<unknown>(null)

    const [form] = Form.useForm()

    const { fetchSignup } = authAPI

    const fetchSignUpCallback = async (data: TSignupForm) => {
        try {
            const result = await fetchSignup(data)
            localStorage.setItem('accessToken', result)
            setToken(result)
        } catch (error) {
            console.log(error)
            setError(error)
        }
    }
    const mutation = useMutation({
        mutationKey: ['token'],
        mutationFn: (data: TSignupForm) => fetchSignUpCallback(data)
    })

    const onSubmit: FormProps<TSignupForm>['onFinish'] = async (data) => {
        mutation.mutate(data)
    }

    const onFinishFailed: FormProps<TSignupForm>['onFinishFailed'] = (errorInfo) => {
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
            <Form.Item<TSignupForm>
                label={'Username'}
                name={'username'}
                rules={[{ required: true, message: `Please input username!` }]}
            >
                <Input minLength={3} maxLength={20} placeholder="Username or Email" />
            </Form.Item>

            <Form.Item<TSignupForm>
                label={'Email'}
                name={'email'}
                rules={[{ required: true, message: `Please input correct email!`, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ }]}
            >
                <Input minLength={5} maxLength={40} placeholder="example@mail.com" />
            </Form.Item>

            <Form.Item<TSignupForm>
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
                    SignUp
                </Button>
            </Form.Item>
        </Form>
        {!!error && <Typography.Text>
            Incorrect Data
        </Typography.Text>}
        <p>or</p>
        <Link to='/signin'>
            <h1>SignIn</h1>
        </Link>
    </div>
}
