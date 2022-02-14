// import { Link } from 'react-router-dom'
import { useState } from 'react'
import Link from 'next/link'

import Modal from '@/components/Modal/Modal'
import { HiOutlineTrash } from 'react-icons/hi'

const BoardList = ({ boards, addNewBoard, deleteBoard }) => {
    const [modal, setModal] = useState(false)
    const [idToBeDeleted, setId] = useState(null)

    const removeBoard = (boardId) => {
        setModal(false)
        deleteBoard(boardId)
    }
    const openDeleteModal = (boardId) => {
        setId(boardId)
        setModal(true)
    }
    const onSubmitAddNewBoard = (e) => {
        e.preventDefault()
        addNewBoard({ name: e.target.elements.boardName.value, columnOrder: [] })
        e.target.elements.boardName.value = ''
    }

    return (
        <div className="h-screen bg-primary-100 px-6 py-4">
            <Modal
                show={modal}
                onClose={() => setModal(false)}
                onCancel={() => setModal(false)}
                onSubmit={() => {
                    removeBoard(idToBeDeleted)
                }}
                title="Board Delete confirmation"
                type="warning"
            >
                <h2 className="mb-2 text-xl text-gray-900 ">Are you sure you want to delete this Board?</h2>
                <h3 className="text-base text-red-600 ">
                    All of it's data will be permanently deleted and it cannot be undone.
                </h3>
            </Modal>
            <div className="my-2 flex flex-col">
                <div className="my-6">
                    <h1 className="text-xl text-blue-900">Your Boards</h1>
                    <div className="mt-2 flex flex-wrap">
                        {boards.map((b) => (
                            <div
                                className="mb-3 mr-4 flex w-full items-center justify-between rounded-lg bg-white py-4 px-6 shadow-md sm:w-auto"
                                key={b.id}
                            >
                                <Link href={`/boards/${b.id}`}>
                                    <a className="flex items-center justify-between ">
                                        <h2 className="text-lg text-gray-700 hover:text-gray-900 sm:text-2xl">
                                            {b.name}
                                        </h2>
                                    </a>
                                </Link>
                                <button
                                    onClick={() => openDeleteModal(b.id)}
                                    className="ml-6 cursor-pointer text-red-500 hover:text-red-700"
                                >
                                    <HiOutlineTrash />
                                </button>
                            </div>
                        ))}
                        {boards.length === 0 ? <h1 className="text-gray-700">Create a new board</h1> : null}
                    </div>
                </div>
            </div>
            <form onSubmit={onSubmitAddNewBoard} autoComplete="off" className="my-4 sm:my-8">
                <label htmlFor="boardName" className="block text-xl text-blue-900">
                    Make a new board
                </label>
                <div className="mt-2 flex items-center">
                    <input
                        required
                        type="text"
                        name="boardName"
                        className="rounded-sm border border-gray-500 bg-transparent px-2 py-1 placeholder-gray-700"
                        placeholder="Enter a board name"
                    />
                    <button
                        type="submit"
                        className="rounded-sm bg-green-600 px-2  py-1.5 text-green-50 hover:bg-green-900"
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}

export default BoardList
