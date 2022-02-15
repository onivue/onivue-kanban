import useKanbanStore from '@/stores/useKanbanStore'
import { useState, useRef } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { HiOutlineTrash } from 'react-icons/hi'
import Modal from '../Modal/Modal'
import Task from './Task'
// import { Bin, Exclaim } from './Icons'
// import { debounce } from '../utils'
// import Modal from './Modal'
// import { db, firebase } from '../firebase/fbConfig'

const Column = ({ column, tasks, allData, boardId, userId, filterBy, index }) => {
    const setColumn = useKanbanStore((state) => state.setColumn)
    const [modal, setModal] = useState(false)
    const [editingCol, setEditing] = useState(false)
    const colInput = useRef(null)
    const focusInput = () => {
        setEditing(true)
        setTimeout(() => {
            colInput.current.focus()
        }, 50)
    }

    return (
        <>
            <Draggable draggableId={column.id} index={index} key={column.id}>
                {(provided) => (
                    <div {...provided.draggableProps} ref={provided.innerRef} className="mr-5">
                        <div className="bg-primary-50">
                            <div
                                {...provided.dragHandleProps}
                                className="flex items-center justify-between rounded-sm bg-primary-400 bg-gradient-to-r px-4 py-1"
                            >
                                <input
                                    ref={colInput}
                                    className={` w-10/12 px-2 text-lg text-primary-700 ${
                                        editingCol ? '' : 'hidden'
                                    }`}
                                    type="text"
                                    onBlur={() => setEditing(false)}
                                    value={column.title}
                                    onChange={(e) =>
                                        setColumn({
                                            type: 'update',
                                            data: { title: e.target.value },
                                            userId: userId,
                                            boardId: boardId,
                                            columnId: column.id,
                                        })
                                    }
                                />
                                <h2
                                    className={`truncate text-lg text-primary-100  ${
                                        editingCol ? 'hidden' : ''
                                    }`}
                                    onClick={focusInput}
                                >
                                    {column.title}
                                </h2>
                                <div
                                    className="cursor-pointer text-primary-700 hover:text-primary-50"
                                    onClick={() => setModal(true)}
                                >
                                    <HiOutlineTrash />
                                </div>
                            </div>
                            <Droppable droppableId={column.id} type="task">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`h-full py-4 px-2 shadow-sm ${
                                            snapshot.isDraggingOver ? 'bg-green-100 ' : ''
                                        }`}
                                    >
                                        {tasks.map((t, i) => (
                                            <Task
                                                allData={allData}
                                                id={t}
                                                index={i}
                                                key={t}
                                                boardId={boardId}
                                                userId={userId}
                                                columnDetails={column}
                                                filterBy={filterBy}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <Modal
                            show={modal}
                            onClose={() => setModal(false)}
                            onCancel={() => setModal(false)}
                            onSubmit={() => {
                                setColumn({
                                    type: 'delete',
                                    userId: userId,
                                    boardId: boardId,
                                    columnId: column.id,
                                    tasks: tasks,
                                })
                            }}
                            title="Board Delete confirmation"
                            type="warning"
                        >
                            <h2 className="mb-2 text-xl text-gray-900 ">
                                Are you sure you want to delete this column?
                            </h2>
                            <h3 className="text-base text-red-600 ">
                                This column and its tasks will be permanently deleted and it cannot be undone.
                            </h3>
                        </Modal>
                    </div>
                )}
            </Draggable>
        </>
    )
}

export default Column
