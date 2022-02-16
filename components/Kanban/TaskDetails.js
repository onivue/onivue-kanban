import { useState } from 'react'
// import Checklist from '../components/Checklist'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import useKanbanStore from '@/stores/useKanbanStore'
import Modal from '../Modal/Modal'

const TaskDetails = ({ taskDetails, boardId, userId, columnDetails, modal }) => {
    const setTask = useKanbanStore((state) => state.setTask)
    const [deletionModal, setDeletionModal] = useState(false)
    const [editing, setEditing] = useState(false)
    const initFormData = {
        title: taskDetails.title,
        priority: taskDetails.priority,
        description: taskDetails.description,
    }
    const [formData, setFormData] = useState(initFormData)

    const deleteTask = () => {
        setDeletionModal(false)
        modal.onClose()
        setTask({
            type: 'delete',
            userId: userId,
            boardId: boardId,
            taskId: taskDetails.id,
            columnId: columnDetails.id,
        })
    }

    return (
        <Modal
            show={modal.show}
            onClose={() => {
                modal.onClose()
                setFormData(initFormData)
            }}
            onCancel={() => {
                modal.onCancel()
                setFormData(initFormData)
            }}
            onSubmit={
                (taskDetails.description !== formData.description ||
                    taskDetails.title !== formData.title ||
                    taskDetails.priority !== formData.priority) &&
                (() => {
                    modal.onClose()
                    setTask({
                        type: 'update',
                        data: {
                            title: formData.title,
                            priority: formData.priority,
                            description: formData.description,
                        },
                        userId: userId,
                        boardId: boardId,
                        taskId: taskDetails.id,
                    })
                })
            }
            title="Task Delete confirmation"
            type={modal.type}
        >
            <div className="text-sm md:px-12 md:text-base">
                <Modal
                    show={deletionModal}
                    onClose={() => setDeletionModal(false)}
                    onCancel={() => setDeletionModal(false)}
                    onSubmit={deleteTask}
                    title="Task Delete confirmation"
                    type="warning"
                >
                    <div className="">
                        <h2 className="text-base text-gray-900 md:text-2xl">
                            Are you sure you want to delete this task?
                        </h2>
                        <h3 className="text-sm text-red-600 ">This cannot be undone.</h3>
                    </div>
                </Modal>

                <form autoComplete="off">
                    <div>
                        <label
                            className="block text-xs uppercase tracking-wide text-gray-500  sm:text-sm"
                            htmlFor="title"
                        >
                            Title:
                        </label>
                        <input
                            maxLength="45"
                            type="text"
                            name="title"
                            className="block w-full text-xl outline-none md:text-2xl"
                            defaultValue={taskDetails.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="w-full gap-x-20 lg:grid lg:grid-cols-8">
                        {/* First column */}
                        <div className="col-span-6 mt-12">
                            <div>
                                <label className="block text-xs uppercase tracking-wide text-gray-500  sm:text-sm">
                                    Checklist:
                                </label>
                                {/* <Checklist
                                todos={taskDetails.todos}
                                taskId={taskDetails.id}
                                boardId={boardId}
                                userId={userId}
                            /> */}
                            </div>

                            <div className="mt-12 w-full">
                                <div className={`${editing ? '' : 'hidden'}`}>
                                    <div className="">
                                        <label
                                            className="block text-xs uppercase tracking-wide text-gray-500  sm:text-sm"
                                            htmlFor="desc"
                                        >
                                            Description:
                                        </label>
                                        <textarea
                                            name="desc"
                                            className="h-56 w-full  border border-gray-300 px-4 py-3 outline-none"
                                            defaultValue={taskDetails.description}
                                            onChange={(e) =>
                                                setFormData({ ...formData, description: e.target.value })
                                            }
                                        />
                                        <div>
                                            <div
                                                onClick={() => setEditing(false)}
                                                className="inline-block cursor-pointer rounded-sm bg-gray-300 px-2 py-0.5 text-gray-700"
                                            >
                                                Cancel
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label
                                            className="block text-xs uppercase tracking-wide text-gray-500 sm:text-sm"
                                            htmlFor="desc"
                                        >
                                            Live Preview:
                                        </label>
                                        <ReactMarkdown
                                            remarkPlugins={[gfm]}
                                            className="prose overflow-y-auto border border-gray-200 px-2 py-3  text-sm  sm:text-base"
                                        >
                                            {formData.description}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                <div
                                    className={`${editing ? 'hidden' : ''}`}
                                    onClick={() => setEditing(true)}
                                >
                                    <label
                                        className="block text-xs uppercase tracking-wide text-gray-500  sm:text-sm"
                                        htmlFor="desc"
                                    >
                                        Description:
                                    </label>
                                    <ReactMarkdown
                                        remarkPlugins={[gfm]}
                                        className="prose overflow-y-auto border border-gray-200 bg-gray-50 px-2 py-3 text-sm leading-normal text-gray-900  sm:text-base"
                                    >
                                        {taskDetails.description === '' || taskDetails.description === null
                                            ? '*No description yet, type here to add*'
                                            : formData.description}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Second column */}
                        <div className="col-span-2 mt-12">
                            <div className="">
                                <label
                                    className="block text-xs uppercase tracking-wide text-gray-500  sm:text-sm"
                                    htmlFor="title"
                                >
                                    Priority:
                                </label>
                                <div className="flex items-center">
                                    <select
                                        name="priority"
                                        defaultValue={taskDetails.priority}
                                        className="select"
                                        onChange={(e) =>
                                            setFormData({ ...formData, priority: e.target.value })
                                        }
                                    >
                                        <option className="option" value="high">
                                            High
                                        </option>
                                        <option className="option" value="medium">
                                            Medium
                                        </option>
                                        <option className="option" value="low">
                                            Low
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-12">
                                <label
                                    className="block text-xs uppercase tracking-wide text-gray-500  sm:text-sm"
                                    htmlFor="title"
                                >
                                    Status:
                                </label>
                                <h4 className="inline-block rounded-sm bg-gray-600 px-2 py-1 text-white">
                                    {columnDetails.title}
                                </h4>
                            </div>

                            {taskDetails.dateAdded ? (
                                <div className="mt-12">
                                    <label
                                        className="block text-xs uppercase tracking-wide text-gray-500  sm:text-sm"
                                        htmlFor="desc"
                                    >
                                        Date Added:
                                    </label>
                                    <h4 className="tracking-wide">
                                        {
                                            new Date(taskDetails.dateAdded.seconds * 1000)
                                                .toLocaleString()
                                                .split(',')[0]
                                        }
                                    </h4>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default TaskDetails
