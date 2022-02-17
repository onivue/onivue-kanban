import React, { useEffect } from 'react'
import useKanbanStore from '@/stores/useKanbanStore'
import useAuthStore from '@/stores/useAuthStore'
import BoardList from '@/components/Kanban/BoardList'
const Boards = () => {
    const boards = useKanbanStore((state) => state.boards)
    const boardsShared = useKanbanStore((state) => state.boardsShared)
    const getBoards = useKanbanStore((state) => state.getBoards)
    const setBoard = useKanbanStore((state) => state.setBoard)
    const user = useAuthStore((state) => state.user)

    useEffect(() => {
        let unsubscribe
        const getSubscribe = async () => {
            unsubscribe = getBoards({ userId: user.uid })
        }
        getSubscribe()
        return () => {
            unsubscribe()
        }
    }, [user.uid])

    return (
        <BoardList
            addNewBoard={(data) => {
                setBoard({
                    type: 'create',
                    data: data,
                    userId: user.uid,
                    boardId: null,
                    taskId: null,
                    columnId: null,
                    tasks: [],
                })
            }}
            boards={boards}
            boardsShared={boardsShared}
            deleteBoard={(boardId) => {
                setBoard({
                    type: 'delete',
                    data: null,
                    userId: user.uid,
                    boardId: boardId,
                    taskId: null,
                    columnId: null,
                    tasks: [],
                })
            }}
            userId={user.uid}
        />
    )
}

export default Boards
