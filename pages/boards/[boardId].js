import AddTask from '@/components/Kanban/AddTask'
import Column from '@/components/Kanban/Column'
import Modal from '@/components/Modal/Modal'
import useAuthStore from '@/stores/useAuthStore'
import useKanbanStore from '@/stores/useKanbanStore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { DragDropContext } from 'react-beautiful-dnd'
import { HiPlus } from 'react-icons/hi'

// This gets called on every request
// export async function getServerSideProps(context) {
//     const boardId = context.params.boardId
//     return { props: { boardId } }
// }

export default function BoardView() {
    const router = useRouter()
    const { boardId } = router.query
    const [modal, setModal] = useState(false)
    const [filter, setFilter] = useState(null)
    const filters = ['high', 'medium', 'low']
    const [clientKanbanData, setClientKanbanData] = useState(null)

    const user = useAuthStore((state) => state.user)
    const { kanbanData, setBoard, setColumn, getKanbanData } = useKanbanStore((state) => ({
        getKanbanData: state.getKanbanData,
        kanbanData: state.kanbanData,
        setColumn: state.setColumn,
        setBoard: state.setBoard,
    }))

    useEffect(() => {
        let unsubscribe
        const getSubscribe = async () => {
            unsubscribe = getKanbanData({
                userId: user.uid,
                boardId: boardId,
            })
        }
        getSubscribe()
        return () => {
            unsubscribe()
        }
    }, [user.uid, boardId])

    useEffect(() => {
        //MINI DEBOUNCE FOR FIXING WEIRD HANDLING
        const handler = setTimeout(() => {
            setClientKanbanData(kanbanData)
        }, 10)
        return () => {
            clearTimeout(handler)
        }
    }, [kanbanData])

    const onDragEnd = ({ destination, source, draggableId, type }) => {
        //DROPPED OUTSIDE ZONE
        if (!destination) return

        // TASK DROP HANDLE
        if (type === 'task') {
            const sourceColumn = clientKanbanData.columns[source.droppableId]
            const destinationColumn = clientKanbanData.columns[destination.droppableId]

            if (sourceColumn === destinationColumn) {
                const newTaskIds = Array.from(destinationColumn.taskIds)

                newTaskIds.splice(source.index, 1)
                newTaskIds.splice(destination.index, 0, draggableId)

                const updatetColumn = {
                    ...destinationColumn,
                    taskIds: newTaskIds,
                }
                const newState = {
                    ...clientKanbanData,
                    columns: {
                        ...clientKanbanData.columns,
                        [destinationColumn.id]: updatetColumn,
                    },
                }
                setClientKanbanData(newState)
                setColumn({
                    type: 'update',
                    data: { taskIds: newTaskIds },
                    userId: user.uid,
                    boardId: boardId,
                    columnId: sourceColumn.id,
                })
                return
            }

            const startTaskIDs = Array.from(sourceColumn.taskIds)
            startTaskIDs.splice(source.index, 1)
            const newStart = {
                ...sourceColumn,
                taskIds: startTaskIDs,
            }

            const finishTaskIDs = Array.from(destinationColumn.taskIds)
            finishTaskIDs.splice(destination.index, 0, draggableId)
            const newFinish = {
                ...destinationColumn,
                taskIds: finishTaskIDs,
            }

            const newState = {
                ...clientKanbanData,
                columns: {
                    ...clientKanbanData.columns,
                    [sourceColumn.id]: newStart,
                    [destinationColumn.id]: newFinish,
                },
            }
            setClientKanbanData(newState)
            setColumn({
                type: 'update',
                data: { taskIds: startTaskIDs },
                userId: user.uid,
                boardId: boardId,
                columnId: newStart.id,
            })
            setColumn({
                type: 'update',
                data: { taskIds: finishTaskIDs },
                userId: user.uid,
                boardId: boardId,
                columnId: newFinish.id,
            })

            return
        }

        // COLUMN TASK DROP HANDLE
        const newColumnOrder = Array.from(clientKanbanData.columnOrder)
        newColumnOrder.splice(source.index, 1)
        newColumnOrder.splice(destination.index, 0, draggableId)
        setClientKanbanData({ ...clientKanbanData, columnOrder: newColumnOrder })
        setBoard({
            type: 'update',
            data: { columnOrder: newColumnOrder },
            userId: user.uid,
            boardId: boardId,
            taskId: null,
            columnId: null,
            tasks: [],
        })
    }

    return (
        <div className="flex  h-full flex-1  flex-col justify-center">
            <Modal
                modal={modal}
                ariaText="Add a new task"
                show={modal}
                onClose={() => setModal(false)}
                onCancel={() => setModal(false)}
                // onSubmit={() => {
                //     removeBoard(idToBeDeleted, userId)
                // }}
                title="Add a new task"
                type="edit"
            >
                <AddTask
                    boardId={boardId}
                    userId={user.uid}
                    allCols={kanbanData.columnOrder}
                    close={() => setModal(false)}
                />
            </Modal>

            <div className="flex-1 rounded-lg bg-white p-4 py-5 text-sm shadow">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex text-xl text-primary-500">
                        <Link href="/boards" className="text-primary-800 hover:text-primary-500">
                            Boards
                        </Link>
                        <span className="">/</span>

                        <input
                            type="text"
                            defaultValue={clientKanbanData?.boardData.title}
                            className=" w-full truncate bg-inherit"
                            onChange={(e) =>
                                setBoard({
                                    type: 'update',
                                    data: { title: e.target.value },
                                    userId: user.uid,
                                    boardId: boardId,
                                    taskId: null,
                                    columnId: null,
                                    tasks: [],
                                })
                            }
                        />
                    </div>

                    <div className="flex flex-wrap items-center sm:space-x-9">
                        <div className="mt-2 flex items-center sm:mt-0 ">
                            <h3 className="mr-2">Filter Priority: </h3>
                            <div className="flex space-x-1 rounded-sm bg-primary-50 text-primary-900">
                                {filters.map((f) => (
                                    <div
                                        key={f}
                                        className={`cursor-pointer  border-black px-3 py-1 capitalize hover:bg-primary-600 hover:text-primary-50 ${
                                            filter === f ? 'bg-primary-600 text-primary-50' : ''
                                        }`}
                                        onClick={() =>
                                            f === 'all' || filter === f ? setFilter(null) : setFilter(f)
                                        }
                                    >
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex rounded-full pt-8">
                    <div
                        onClick={() => setModal(true)}
                        className="cursor-pointer transition-all duration-150 hover:text-primary-400"
                    >
                        <HiPlus className="inline h-6 w-6 " />
                        Add Task
                    </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="allCols" type="column" direction="horizontal">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="grid auto-cols-[320px] grid-flow-col items-start overflow-x-auto  py-8 px-1  "
                            >
                                {clientKanbanData?.columnOrder.map((col, i) => {
                                    const column = clientKanbanData?.columns[col]
                                    if (column) {
                                        const tasks = column?.taskIds
                                        return (
                                            <Column
                                                column={column}
                                                tasks={tasks}
                                                allData={clientKanbanData}
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
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        const newColumn = e.target.elements.newCol.value
                                        setColumn({
                                            type: 'update',
                                            data: { title: newColumn, taskIds: [] },
                                            userId: user.uid,
                                            boardId: boardId,
                                            columnId: newColumn,
                                            tasks: [],
                                        })
                                        setBoard({
                                            type: 'update',
                                            data: { columnOrder: newColumn },
                                            userId: user.uid,
                                            boardId: boardId,
                                        })
                                        e.target.elements.newCol.value = ''
                                    }}
                                    autoComplete="off"
                                    className="ml-2"
                                >
                                    <input
                                        maxLength="20"
                                        className="cursor-pointer truncate rounded-sm bg-transparent bg-primary-50 px-2 py-1 text-primary-800 placeholder-primary-500  outline-none focus:ring-primary-500"
                                        type="text"
                                        name="newCol"
                                        placeholder="add column"
                                    />
                                </form>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            {/* <div className=" my-8 flex flex-col overflow-auto font-mono">
                <div className="text-lg text-primary-500">NAME: {clientKanbanData?.boardData.title}</div>
                <div className="text-lg text-primary-500">BOARD ID: {boardId}</div>
                <pre className=" text-sm text-primary-500">
                    OBJECT: {JSON.stringify(clientKanbanData, null, 4)}
                </pre>
            </div> */}
        </div>
    )
}
