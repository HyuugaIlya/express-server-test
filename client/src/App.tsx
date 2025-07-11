import { useEffect } from 'react'

import {
  Navigate,
  Route,
  Routes
} from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import {
  useRefreshMutation,
  useTokenContext,
  useUserQuery
} from './hooks'

import {
  AuthLayout,
  LoadingLayout,
  RedirectLayout
} from './layouts'

import {
  Source,
  Sources,
  EmailConfirmation,
  Header,
  Login,
  Main,
  SignUp
} from './components'

import './App.scss'

function App() {
  const queryClient = useQueryClient()

  const {
    token: accessToken,
    setToken: setAccessToken
  } = useTokenContext()

  const {
    data: user,
    isFetching: isUserFetching,
    isError
  } = useUserQuery(accessToken)

  const refresh = useRefreshMutation()

  useEffect(() => {
    if (isError) {
      refresh.mutate()
      queryClient.refetchQueries({ queryKey: ['user'] })
    }
  }, [refresh, queryClient, isError])

  useEffect(() => {
    if (!accessToken && localStorage.getItem('accessToken')) {
      setAccessToken(localStorage.getItem('accessToken'))
    }

    if (refresh.data) {
      localStorage.setItem('accessToken', refresh.data)
    }
  }, [queryClient, refresh, accessToken, setAccessToken])

  return <>
    <Header user={user} />
    <Routes>
      <Route path='/' element={<Navigate to='/signin' />} />
      <Route
        path='/signin'
        element={
          <RedirectLayout>
            <Login />
          </RedirectLayout>
        }
      />
      <Route
        path='/signup'
        element={
          <RedirectLayout>
            <SignUp />
          </RedirectLayout>
        }
      />
      <Route
        path='/main'
        element={
          <LoadingLayout isFetching={isUserFetching || refresh.isPending}>
            <AuthLayout user={user}>
              <Main />
            </AuthLayout>
          </LoadingLayout>
        }
      />
      <Route
        path='/sources'
        element={
          <LoadingLayout isFetching={isUserFetching || refresh.isPending}>
            <AuthLayout user={user}>
              <Sources />
            </AuthLayout>
          </LoadingLayout>
        }
      />
      <Route
        path='/sources/:id'
        element={
          <LoadingLayout isFetching={isUserFetching || refresh.isPending}>
            <AuthLayout user={user}>
              <Source />
            </AuthLayout>
          </LoadingLayout>
        }
      />
      <Route path='/auth/emailConfirmation' element={<EmailConfirmation />} />
      <Route path='*' element={<div> Not Found!</div>} />
    </Routes>
  </>
}

export default App
