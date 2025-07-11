import {
    createContext,
    Dispatch,
    SetStateAction
} from "react"

type TTokenContext = {
    token: string | null,
    setToken: Dispatch<SetStateAction<string | null>>
}

export const TokenContext = createContext<TTokenContext>({} as TTokenContext)