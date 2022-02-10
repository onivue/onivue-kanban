import { useState, useRef } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Task from './Task'
// import { Bin, Exclaim } from './Icons'
// import { debounce } from '../utils'
// import Modal from './Modal'
// import { db, firebase } from '../firebase/fbConfig'

const Column = ({ column, tasks, allData, boardId, userId, filterBy, index }) => {
    const [modal, setModal] = useState(false)
    const [editingCol, setEditing] = useState(false)
    const colInput = useRef(null)

    // const deleteCol = (colId, tasks) => {
    //     db.collection(`users/${userId}/boards/${boardId}/columns`)
    //         .doc('columnOrder')
    //         .update({ order: firebase.firestore.FieldValue.arrayRemove(colId) })

    //     db.collection(`users/${userId}/boards/${boardId}/columns`).doc(colId).delete()

    //     //Extract and delete its tasks
    //     tasks.forEach((t) => {
    //         db.collection(`users/${userId}/boards/${boardId}/tasks`).doc(t).delete()
    //     })
    // }

    // const changeColName = debounce((e, colId) => {
    //     db.collection(`users/${userId}/boards/${boardId}/columns`).doc(colId).update({ title: e.target.value })
    // }, 7000)

    // const moveToInp = () => {
    //     setEditing(true)
    //     setTimeout(() => {
    //         colInput.current.focus()
    //     }, 50)
    // }

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
                                    className={`w-10/12 px-2 text-lg text-primary-700 sm:text-xl ${
                                        editingCol ? '' : 'hidden'
                                    }`}
                                    onBlur={() => setEditing(false)}
                                    type="text"
                                    defaultValue={column.title}
                                    onChange={(e) => changeColName(e, column.id)}
                                />
                                <h2
                                    className={`truncate text-lg text-primary-100 sm:text-lg ${
                                        editingCol ? 'hidden' : ''
                                    }`}
                                    // onClick={moveToInp}
                                >
                                    {column.title}
                                </h2>
                                <div
                                    className="cursor-pointer text-primary-700 hover:text-primary-50"
                                    onClick={() => setModal(true)}
                                >
                                    TRASH
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
                        {/* <Modal modal={modal} setModal={setModal} ariaText="Column Delete confirmation">
                            <div className="md:px-12">
                                <div className="mb-2 text-yellow-600">
                                    <Exclaim />
                                </div>
                                <h2 className="mb-2 text-base text-gray-900 md:text-2xl">
                                    Are you sure you want to delete this column?
                                </h2>
                                <h3 className="text-sm text-red-600 md:text-lg">
                                    This column and its tasks will be permanently deleted and it cannot be undone.
                                </h3>
                                <div className="my-8 flex">
                                    <button
                                        className="mr-4 rounded-sm border border-red-700 px-2 py-1 text-sm text-red-600 md:text-base"
                                        onClick={() => deleteCol(column.id, tasks)}
                                    >
                                        Yes, delete
                                    </button>
                                    <button
                                        className="rounded-sm bg-blue-800 px-2 py-1 text-sm text-gray-100 md:text-base"
                                        onClick={() => setModal(false)}
                                    >
                                        No, go back
                                    </button>
                                </div>
                            </div>
                        </Modal> */}
                    </div>
                )}
            </Draggable>
        </>
    )
}

export default Column
