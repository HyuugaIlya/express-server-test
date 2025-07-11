import { useState } from "react"

import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Button, Input, List, Typography } from "antd"

import { sourcesAPI, TSource } from "../api/sourcesAPI"

export const Sources = () => {
    const [title, setTitle] = useState<string>('')

    const {
        addSource,
        getSources,
    } = sourcesAPI

    const queryClient = useQueryClient()
    const { data: sources = [], isFetching } = useQuery({
        queryKey: ['sources'],
        queryFn: () => getSources(localStorage.getItem('accessToken')),
        refetchOnWindowFocus: false,
        enabled: !!localStorage.getItem('accessToken')
    })
    const mutation = useMutation({
        mutationKey: ['sources'],
        mutationFn: (title: string) => addSource(localStorage.getItem('accessToken'), title),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sources'] })
    })

    const handleAdd = () => {
        mutation.mutate(title)
    }

    return <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Button onClick={handleAdd} disabled={mutation.isPending}>
                Add source
            </Button>
        </div>

        <List
            loading={isFetching}
            bordered
            dataSource={sources}
            renderItem={(source: TSource) => (
                <List.Item>
                    <Typography.Text disabled={mutation.isPending}>
                        <Link to={`${source.id}`} >
                            {source.title}
                        </Link>
                    </Typography.Text>
                </List.Item>
            )}
        />
    </div>
}
