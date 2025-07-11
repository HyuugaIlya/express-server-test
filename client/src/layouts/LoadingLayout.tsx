type TProps = {
    children: React.ReactNode
    isFetching: boolean
}
export function LoadingLayout({
    children,
    isFetching
}: TProps) {
    return !isFetching
        ? <>
            {children}
        </>
        : <div>
            Loading...
        </div>
}