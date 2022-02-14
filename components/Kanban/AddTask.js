import useKanbanStore from '@/stores/useKanbanStore'
import { useState } from 'react'

const AddTask = ({ boardId, userId, close, allCols }) => {
    const [description, setDescription] = useState(null)

    const { setTask } = useKanbanStore((state) => ({
        setTask: state.setTask,
    }))

    const addTask = (e) => {
        e.preventDefault()
        const title = e.target.elements.newTaskTitle.value
        const priority = e.target.elements.priority.value
        const column = e.target.elements.column.value

        setTask(
            {
                title,
                priority,
                description,
                todos: [],
            },
            userId,
            boardId,
            null,
            column,
            'add',
        )
        close()
    }

    return (
        <form onSubmit={addTask} autoComplete="off">
            <div className="mt-6 sm:mt-12">
                <div>
                    <label htmlFor="newTaskTitle" className="block ">
                        Title:
                    </label>
                    <input
                        maxLength="45"
                        required
                        type="text"
                        name="newTaskTitle"
                        className="w-3/4 rounded-lg  border-b bg-transparent text-lg font-bold outline-none md:text-2xl"
                    />
                </div>

                <div className="my-6 sm:flex">
                    <div className="">
                        <label htmlFor="priority" className=" block sm:inline">
                            Priority: {''}
                        </label>
                        <select name="priority" defaultValue="low" className="rounded-lg">
                            <option value="high" className="option">
                                High
                            </option>
                            <option value="medium" className="option">
                                Medium
                            </option>
                            <option value="low" className="option">
                                Low
                            </option>
                        </select>
                    </div>

                    <div className="mt-8 sm:mt-0 sm:ml-12">
                        <label className="block sm:inline" htmlFor="column">
                            Select a column: {''}
                        </label>
                        <select name="column" required className="select" className="rounded-lg">
                            {allCols.map((c) => (
                                <option className="option" value={c} key={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="my-6">
                <label htmlFor="newTaskDescription" className="block ">
                    Description (optional):
                </label>
                <textarea
                    name="desc"
                    className="h-32 w-full rounded-lg border  px-4 py-3 outline-none"
                    defaultValue={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <button className="rounded-lg bg-primary-500 px-2 py-1 text-white">Add Task</button>
        </form>
    )
}

export default AddTask
