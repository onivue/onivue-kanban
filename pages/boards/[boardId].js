import Column from '@/components/Kanban/Column'
import useAuthStore from '@/stores/useAuthStore'
import useKanbanStore from '@/stores/useKanbanStore'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { DragDropContext } from 'react-beautiful-dnd'

// This gets called on every request
export async function getServerSideProps(context) {
    const boardId = context.params.boardId
    return { props: { boardId } }
}

export default function BoardView({ boardId }) {
    const [modal, setModal] = useState(false)
    const [filter, setFilter] = useState(null)
    const filters = ['high', 'medium', 'low']

    const user = useAuthStore((state) => state.user)
    const {
        getKanbanTasks,
        kanbanData,
        getKanbanBoardName,
        getKanbanColumns,
        setKanbanData,
        tasks,
        columns,
        boardName,
        setBoardName,
        setColumn,
    } = useKanbanStore((state) => ({
        getKanbanTasks: state.getKanbanTasks,
        getKanbanBoardName: state.getKanbanBoardName,
        getKanbanColumns: state.getKanbanColumns,
        tasks: state.tasks,
        columns: state.columns,
        boardName: state.boardName,
        setKanbanData: state.setKanbanData,
        kanbanData: state.kanbanData,
        setBoardName: state.setBoardName,
        setColumn: state.setColumn,
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
            const kanbanData = {}

            const co = columns.find((c) => c.id === 'columnOrder')
            const cols = columns.filter((c) => c.id !== 'columnOrder')

            kanbanData.columnOrder = co?.order || []
            kanbanData.columns = {}
            kanbanData.tasks = {}

            tasks.forEach((t) => (kanbanData.tasks[t.id] = t))
            cols.forEach((c) => (kanbanData.columns[c.id] = c))

            setKanbanData(kanbanData)
        }
    }, [tasks, columns])

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result

        if (!destination) return

        if (result.type === 'task') {
            const startColumn = kanbanData.columns[source.droppableId]
            const endColumn = kanbanData.columns[destination.droppableId]

            if (startColumn === endColumn) {
                const newTaskIds = Array.from(endColumn.taskIds)

                newTaskIds.splice(source.index, 1)
                newTaskIds.splice(destination.index, 0, draggableId)

                const newColumn = {
                    ...endColumn,
                    taskIds: newTaskIds,
                }

                const newState = {
                    ...kanbanData,
                    columns: { ...kanbanData.columns, [endColumn.id]: newColumn },
                }

                setKanbanData(newState)
                setColumn({ taskIds: newTaskIds }, user.uid, boardId, startColumn.id)
                return
            }

            const startTaskIDs = Array.from(startColumn.taskIds)
            startTaskIDs.splice(source.index, 1)
            const newStart = {
                ...startColumn,
                taskIds: startTaskIDs,
            }

            const finishTaskIDs = Array.from(endColumn.taskIds)
            finishTaskIDs.splice(destination.index, 0, draggableId)
            const newFinish = {
                ...endColumn,
                taskIds: finishTaskIDs,
            }

            const newState = {
                ...kanbanData,
                columns: {
                    ...kanbanData.columns,
                    [startColumn.id]: newStart,
                    [endColumn.id]: newFinish,
                },
            }

            setKanbanData(newState)

            setColumn({ taskIds: startTaskIDs }, user.uid, boardId, newStart.id)
            setColumn({ taskIds: finishTaskIDs }, user.uid, boardId, newFinish.id)
        } else {
            const newColumnOrder = Array.from(kanbanData.columnOrder)
            newColumnOrder.splice(source.index, 1)
            newColumnOrder.splice(destination.index, 0, draggableId)
            setKanbanData({ ...kanbanData, columnOrder: newColumnOrder })

            setColumn({ order: newColumnOrder }, user.uid, boardId, 'columnOrder')
        }
    }

    return (
        <div className=" ">
            <>
                {/* <Modal modal={modal} setModal={setModal} ariaText="Add a new task">
                    <AddTask
                        boardId={boardId}
                        userId={user.uid}
                        allCols={kanbanData.columnOrder}
                        close={() => setModal(false)}
                    />
                </Modal> */}

                <div>
                    <div className=" bg-white py-5 text-sm ">
                        <div className="flex flex-wrap items-center justify-between">
                            <span className="text-xl">
                                <Link href="/" className="text-primary-800 hover:text-primary-500">
                                    Boards
                                </Link>
                                <span className="">/</span>
                                <input
                                    type="text"
                                    defaultValue={boardName}
                                    className="ml-2 w-1/2 truncate"
                                    onChange={(e) => setBoardName({ name: e.target.value }, user.uid, boardId)}
                                />
                            </span>
                            <div className="flex flex-wrap items-center sm:space-x-9">
                                <div className="mt-2 flex items-center sm:mt-0 ">
                                    <h3 className="mr-2">Show Priority: </h3>
                                    <div className="flex space-x-1 rounded-sm bg-primary-50 text-primary-900">
                                        {filters.map((f) => (
                                            <div
                                                key={f}
                                                className={`cursor-pointer  border-black px-3 py-1 capitalize hover:bg-primary-600 hover:text-primary-50 ${
                                                    filter === f ? 'bg-primary-600 text-primary-50' : ''
                                                }`}
                                                onClick={() => setFilter(f === 'all' ? null : f)}
                                            >
                                                {f}
                                            </div>
                                        ))}
                                        {filter ? (
                                            <div
                                                className="cursor-pointer rounded-sm px-2 py-1 hover:text-primary-700"
                                                onClick={() => setFilter(null)}
                                            >
                                                All
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div
                                    className="from-primary to-primary-primary  bottom-6 right-6 transform rounded-full bg-gradient-to-br via-primary-600 p-2 transition-all duration-300 hover:scale-110 "
                                    onClick={() => setModal(true)}
                                >
                                    ADDICON
                                </div>
                            </div>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="allCols" type="column" direction="horizontal">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="auto-cols-220 md:auto-cols-270 mx-1 grid h-full grid-flow-col items-start overflow-x-auto pt-3 md:mx-6 md:pt-2"
                                    style={{ height: '90%' }}
                                >
                                    {kanbanData?.columnOrder.map((col, i) => {
                                        const column = kanbanData?.columns[col]
                                        if (column) {
                                            const tasks = column?.taskIds.map((t) => t)
                                            return (
                                                <Column
                                                    column={column}
                                                    tasks={tasks}
                                                    allData={kanbanData}
                                                    key={column.id}
                                                    boardId={boardId}
                                                    userId={user.uid}
                                                    filterBy={filter}
                                                    index={i}
                                                />
                                            )
                                        }
                                    })}
                                    {provided.placeholder}
                                    <form onSubmit={() => {}} autoComplete="off" className="ml-2">
                                        <input
                                            maxLength="20"
                                            className="truncate rounded-sm bg-transparent bg-indigo-50 px-2 py-1 text-indigo-800 placeholder-indigo-500 outline-none ring-2 focus:ring-indigo-500"
                                            type="text"
                                            name="newCol"
                                            placeholder="Add a new column"
                                        />
                                    </form>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <div className=" my-8 font-mono">
                    <div className="text-xl text-red-500">SLUG: {boardId}</div>
                    <div className="text-xl text-blue-500">NAME: {boardName}</div>
                    <pre className=" text-sm text-green-500">OBJECT: {JSON.stringify(kanbanData, null, 4)}</pre>
                </div>
            </>
        </div>
    )
}
