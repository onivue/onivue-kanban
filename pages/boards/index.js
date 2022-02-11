import React, { useEffect } from 'react'
import useKanbanStore from '@/stores/useKanbanStore'
import useAuthStore from '@/stores/useAuthStore'
import BoardList from '@/components/Kanban/BoardList'
const Boards = () => {
    const boards = useKanbanStore((state) => state.boards)
    const getBoards = useKanbanStore((state) => state.getBoards)
    const setBoard = useKanbanStore((state) => state.setBoard)

    const deleteBoard = useKanbanStore((state) => state.deleteBoard)
    const user = useAuthStore((state) => state.user)

    useEffect(() => {
        let unsubscribe
        const getSubscribe = async () => {
            unsubscribe = getBoards(user.uid)
        }
        getSubscribe()
        return () => {
            unsubscribe()
        }
    }, [user.uid])

    const addNewBoard = (boardName, boardId) => {
        setBoard(boardName, null, user.uid, true)
    }

    return (
        <div className="max-w-screen-xl flex-1">
            {boards.map((item, index) => {
                return <div key={item.id}>{item.id}</div>
            })}

            <button
                onClick={() => setBoard({ name: new Date().valueOf() }, null, user.uid)}
                className="rounded-lg bg-blue-700 px-3 py-2 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                ADD BOARD
            </button>
            <BoardList addNewBoard={addNewBoard} boards={boards} deleteBoard={deleteBoard} userId={user.uid} />
        </div>
    )
}

export default Boards
