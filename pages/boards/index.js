import React, { useEffect } from 'react'
import useKanbanStore from '@/stores/useKanbanStore'
import useAuthStore from '@/stores/useAuthStore'
import BoardList from '@/components/Kanban/BoardList'
const Boards = () => {
    const boards = useKanbanStore((state) => state.boards)
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
        <div className="max-w-screen-xl flex-1">
            {/* {boards.map((item, index) => {
                return <div key={item.id}>{item.id}</div>
            })}

            <button
                onClick={() => setBoard({ name: new Date().valueOf() }, user.uid)}
                className="rounded-lg bg-blue-700 px-3 py-2 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                ADD BOARD
            </button> */}
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
        </div>
    )
}

export default Boards
