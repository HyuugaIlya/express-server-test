export type TSource = {
    id: number | string,
    title: string
}
export const sourcesAPI = {
    getSources: async (token: string | null) => {
        return await fetch(`http://localhost:3003/sources`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            return res.json()
        }).then(data => data.data)
    },
    addSource: async (token: string | null, title: string) => {
        return await fetch('http://localhost:3003/sources', {
            method: 'POST',
            headers: {
                'Content-type': 'Application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title })
        })
    },
    getSource: async (token: string | null, id: string | undefined) => {
        return await fetch(`http://localhost:3003/sources/${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json())
    },
    deleteSource: async (token: string | null, id: string | undefined) => {
        return await fetch(`http://localhost:3003/sources/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.json())
    },
    updateSource: async (token: string | null, title: string, id: string | undefined) => {
        return await fetch(`http://localhost:3003/sources/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'Application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title })
        }).then((res) => res.json())
    },
}