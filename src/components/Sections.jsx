import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewTask, deleteTask, updateTask } from '../redux/taskSlice';
import TaskCard from './TaskCard';
import { IoIosAdd } from "react-icons/io";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const bgColors = {
    red: "bg-red-300",
    blue: "bg-blue-300",
    green: "bg-green-300",
}

const scrollColors = {
    red: "[&::-webkit-scrollbar-thumb]:bg-red-200",
    blue: "[&::-webkit-scrollbar-thumb]:bg-blue-200",
    green: "[&::-webkit-scrollbar-thumb]:bg-green-200",
}

const Sections = ({ id, color, sectionName, tasksData }) => {
    const dispatch = useDispatch();
    const { setNodeRef,isOver } = useDroppable({id: id});
    const { tasks, loading, error } = useSelector(state => state.tasks);
    const [newTask, setNewTask] = useState('');
    const [showTaskBox, setShowTaskBox] = useState(false);

    const generateNewId = () => {
        if (tasks.length === 0) return 1;
        let maxId = 0;
        for (let task of tasks) {
            if (task.id > maxId) {
                maxId = task.id
            }
        }

        return maxId + 1
    }

    const handleAddTask = async () => {
        let id = await generateNewId()

        dispatch(addNewTask({ id, title: newTask, status: "todo" }))
        setShowTaskBox(false)
        setNewTask('')
    }

    const handleCancelTask = () => {
        setShowTaskBox(false)
        setNewTask('')
    }

    const handleRemoveTask = (id) => {
        dispatch(deleteTask(id))
    }

    const handleUpdateTask = (id, updatedTask) => {
        dispatch(updateTask({ id, updatedTask }))
    }

    return (
        <div key={id}  className={`${bgColors[color]} p-2 rounded-md`}>
            <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold mb-2'>{sectionName}</h2>
                {
                    id === "todo" && (
                        <>
                            
                            <button className='text-2xl cursor-pointer' onClick={() => setShowTaskBox(true)} disabled={showTaskBox} >
                                <IoIosAdd size={25} />
                            </button>
                        </>
                    )
                }
            </div>

            <div ref={setNodeRef} className={`p-1 h-[75vh] overflow-y-auto 
            [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-none ${scrollColors[color]} ${isOver ? "opacity-50" : ""}`}>
                <SortableContext 
                    items={tasksData.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                {
                    showTaskBox &&
                    <div className='bg-red-200 p-2 rounded-md my-1'>
                        <input type='text' name='newTask' value={newTask} onChange={e => setNewTask(e.target.value)}
                            placeholder='Enter task here'
                            className='border-none rounded-md outline-none w-full bg-red-200 p-1'
                        />
                        <div className='flex justify-end gap-1'>
                            <button className='text-sm bg-red-400 rounded-md py-1 px-2 cursor-pointer' disabled={!newTask} onClick={handleAddTask}>Add</button>
                            <button className='text-sm bg-red-400 rounded-md py-1 px-2 cursor-pointer' onClick={handleCancelTask}>Cancel</button>
                        </div>
                    </div>
                }
                {
                    tasksData?.map(t => (
                        <TaskCard taskData={t} color={color} handleRemoveTask={handleRemoveTask} handleUpdateTask={handleUpdateTask} key={t.id} />
                    ))
                }
                </SortableContext>
            </div>
        </div >
    )
}

export default Sections