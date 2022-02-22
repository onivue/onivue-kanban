import { useState } from 'react'
// import Checklist from '../components/Checklist'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import useKanbanStore from '@/stores/useKanbanStore'
import Modal from '../Modal/Modal'
import { HiOutlineTrash } from 'react-icons/hi'
import Button from '../Button/Button'
import classNames from 'classnames'

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
            title={modal.title}
            type={modal.type}
        >
            <div className="">
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
                    <div className="rounded-lg bg-gray-100 p-4">
                        <input
                            maxLength="45"
                            type="text"
                            name="title"
                            className="block w-full bg-transparent text-xl outline-none md:text-2xl"
                            defaultValue={taskDetails.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1  gap-6 lg:grid-cols-3">
                        <section className="col-span-2 grid grid-cols-1 gap-6">
                            <div>
                                <label
                                    className="block text-xs uppercase tracking-wide text-gray-500  sm:text-sm"
                                    htmlFor="desc"
                                >
                                    Description:
                                </label>
                                <div
                                    onClick={() => setEditing(true)}
                                    className={classNames(
                                        editing ? 'hidden' : '',
                                        'w-full cursor-pointer border',
                                    )}
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[gfm]}
                                        className="prose h-48 max-w-none overflow-y-auto rounded-lg  p-3 text-sm text-primary-500"
                                        children={
                                            taskDetails.description === '' || taskDetails.description === null
                                                ? '*No description yet, type here to add*'
                                                : formData.description
                                        }
                                    />
                                </div>
                                <div className={`${editing ? '' : ' hidden'} relative flex`}>
                                    <textarea
                                        name="desc"
                                        className="h-48 w-full  rounded-lg border border-gray-300 px-4 py-3 outline-none  "
                                        defaultValue={taskDetails.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                    />

                                    <Button
                                        style={'secondary'}
                                        onClick={() => setEditing(false)}
                                        type="button"
                                        className="absolute right-2 bottom-2"
                                    >
                                        Preview
                                    </Button>
                                </div>
                            </div>

                            {/* <div>
                                <label className="block text-xs uppercase tracking-wide text-gray-500  sm:text-sm">
                                    Checklist:
                                </label>
                                <Checklist
                                todos={taskDetails.todos}
                                taskId={taskDetails.id}
                                boardId={boardId}
                                userId={userId}
                            />
                            </div> */}
                        </section>
                        <section className="grid grid-cols-2 justify-items-center gap-6 lg:grid-cols-1 lg:justify-items-start">
                            <div>
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
                            <div>
                                <label
                                    className="block  text-xs uppercase tracking-wide  text-gray-500 sm:text-sm"
                                    htmlFor="title"
                                >
                                    Status:
                                </label>
                                <h4 className="inline-block  rounded-lg bg-primary-400 px-2 py-1 text-sm text-white">
                                    {columnDetails.title}
                                </h4>
                            </div>

                            {taskDetails.dateAdded ? (
                                <div>
                                    <label
                                        className="block text-xs uppercase tracking-wide text-gray-500  sm:text-sm"
                                        htmlFor="desc"
                                    >
                                        Added:
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
                            <div>
                                <HiOutlineTrash
                                    onClick={() => setDeletionModal(true)}
                                    className="h-5 w-5  cursor-pointer text-red-600"
                                />
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default TaskDetails
