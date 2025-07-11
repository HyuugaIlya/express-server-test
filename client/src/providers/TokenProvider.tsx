import { ReactNode, useState } from "react"

import { TokenContext } from "../context/TokenContext"

export const TokenProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null)

    return <TokenContext.Provider value={{ token, setToken }}>
        {children}
    </TokenContext.Provider>
}
