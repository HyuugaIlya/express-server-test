import {
    ChangeEvent,
    useEffect,
    useState
} from "react"

import { useParams, useNavigate } from 'react-router'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { sourcesAPI } from "../api/sourcesAPI"
import { Button } from "antd"

export const Source = () => {
    const params = useParams()
    const navigate = useNavigate()

    const {
        getSource,
        deleteSource,
        updateSource
    } = sourcesAPI

    const [isInput, setIsInput] = useState(false)
    const [title, setTitle] = useState<string>('')

    const queryClient = useQueryClient()
    const { data: source, isFetching } = useQuery({
        queryKey: ['source', params.id],
        queryFn: () => getSource(localStorage.getItem('accessToken'), params.id),
        refetchOnWindowFocus: false
    })

    const editSource = useMutation({
        mutationKey: ['source'],
        mutationFn: () => updateSource(localStorage.getItem('accessToken'), title, params.id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['source'] })
    })

    const removeSource = useMutation({
        mutationKey: ['source'],
        mutationFn: () => deleteSource(localStorage.getItem('accessToken'), params.id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['source'] })
    })

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/')
            return
        }
    }, [navigate])

    useEffect(() => {
        if (source) setTitle(source.title)
    }, [source])

    const onClose = () => {
        setIsInput(false)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }
    const handleBlur = async () => {
        if (title !== source?.title) {
            editSource.mutate()
        }
        setIsInput(false)
    }

    const handleDelete = async () => {
        navigate('/sources')
        removeSource.mutate()
    }

    const handleClick = () => {
        setIsInput(true)
    }

    if (isFetching) {
        return <h3>Loading...</h3>
    }

    if (!source) {
        return <h2>No Data</h2>
    }

    return <>
        <div>
            <Button onClick={() => navigate('/sources')}>Back</Button>
            {isInput ? <>
                <input type="text" value={title} onChange={handleChange} onBlur={handleBlur} />
                <Button onClick={onClose}>close</Button>
            </> : <p style={{ 'cursor': 'pointer' }} onClick={handleClick}>
                {source.title}
            </p>}
        </div>
        <Button onClick={handleDelete}>delete</Button>
    </>
}
