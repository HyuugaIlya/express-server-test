import { Link } from "react-router-dom"

export const Main = () => {
    return <div className="card">
        <p>Main Page</p>

        <Link to={`/sources`}>
            <p>Sources</p>
        </Link>
    </div>
}
