import useAuthStore from '@/stores/useAuthStore'
import useKanbanStore from '@/stores/useKanbanStore'
import { useEffect } from 'react'

// This gets called on every request
export async function getServerSideProps(context) {
    const boardId = context.params.boardId
    return { props: { boardId } }
}

export default function BoardView({ boardId }) {
    const user = useAuthStore((state) => state.user)
    const { getKanbanTasks, getKanbanBoardName, getKanbanColumns, setKanbanData, tasks, columns, boardName } =
        useKanbanStore((state) => ({
            getKanbanTasks: state.getKanbanTasks,
            getKanbanBoardName: state.getKanbanBoardName,
            getKanbanColumns: state.getKanbanColumns,
            tasks: state.tasks,
            columns: state.columns,
            boardName: state.boardName,
            setKanbanData: state.setKanbanData,
        }))

    useEffect(() => {
        const unsubscribe = () => getKanbanTasks(user.uid, boardId)
        return unsubscribe()
    }, [user.uid, boardId])

    useEffect(() => {
        const unsubscribe = () => getKanbanBoardName(user.uid, boardId)
        return unsubscribe()
    }, [user.uid, boardId])

    useEffect(() => {
        const unsubscribe = () => getKanbanColumns(user.uid, boardId)
        return unsubscribe()
    }, [user.uid, boardId])

    // MERGE OBJECT TO FINAL OBJECT
    useEffect(() => {
        if (tasks && columns) {
            const finalObject = {}

            const co = columns.find((c) => c.id === 'columnOrder')
            const cols = columns.filter((c) => c.id !== 'columnOrder')

            finalObject.columnOrder = co?.order
            finalObject.columns = {}
            finalObject.tasks = {}

            tasks.forEach((t) => (finalObject.tasks[t.id] = t))
            cols.forEach((c) => (finalObject.columns[c.id] = c))

            setKanbanData(finalObject)
        }
    }, [tasks, columns])

    return (
        <div className=" ">
            <div className="text-xl text-red-500">SLUG: {boardId}</div>
            <div className="text-xl text-blue-500">SLUG: {boardName}</div>
        </div>
    )
}
