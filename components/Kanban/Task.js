import classNames from 'classnames'
import { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import Modal from '../Modal/Modal'
import TaskDetails from './TaskDetails'
import { HiOutlineChatAlt } from 'react-icons/hi'

// import ChecklistProgress from './ChecklistProgress'
// import { extractPriority } from '../utils'
// import Modal from './Modal'
// import TaskDetails from '../screens/TaskDetails'
// import { Description } from './Icons'

const Task = ({ allData, id, index, boardId, userId, columnDetails, filterBy }) => {
    const [modal, setModal] = useState(false)

    const theTask = allData.tasks[id]
    if (!theTask) return <></>

    let matched = ''

    if (filterBy === null) {
        matched = 'all'
    } else {
        matched = theTask.priority === filterBy
    }

    return (
        <div className={`${matched ? '' : 'opacity-10'}`}>
            {/*TODO: MODAL */}

            <TaskDetails
                modal={{
                    onClose: () => setModal(false),
                    onCancel: () => setModal(false),
                    // onSubmit: () => {},
                    title: 'Task Details',
                    type: 'edit',
                    show: modal,
                }}
                taskDetails={theTask}
                closeModal={() => setModal(false)}
                boardId={boardId}
                userId={userId}
                columnDetails={columnDetails}
            />

            <Draggable draggableId={id} index={index}>
                {(provided, snapshot) => (
                    <div
                        onClick={() => setModal(true)}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className={classNames(
                            'relative mb-4 rounded-lg  border px-1.5 py-2.5 shadow transition-shadow duration-300 hover:shadow-lg',
                            snapshot.isDragging
                                ? 'border-primary-400 bg-white'
                                : 'border-primary-100 bg-white',
                            theTask.priority === 'low' && 'border-l-8 border-l-green-400',
                            theTask.priority === 'medium' && 'border-l-8 border-l-amber-300',
                            theTask.priority === 'high' && 'border-l-8 border-l-rose-500',
                        )}
                    >
                        <div className={classNames('flex w-full items-center ')}>
                            <h4 className="text-sm sm:text-base">{theTask.title}</h4>
                        </div>

                        {theTask.description !== null && theTask.description?.length > 0 ? (
                            <div className="text-base text-gray-500 sm:space-x-5">
                                <HiOutlineChatAlt className="" />
                            </div>
                        ) : null}
                        {/* TODO: ICONS */}
                        {/* {theTask.todos.length >= 1 && <ChecklistProgress todos={theTask.todos} />} */}
                    </div>
                )}
            </Draggable>
        </div>
    )
}

export default Task
