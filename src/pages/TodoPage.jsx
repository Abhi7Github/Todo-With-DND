import { useEffect, useMemo, useState } from 'react'
import { fetchAllTasks, setTasks, updateStatus, } from '../redux/taskSlice'
import { useDispatch, useSelector } from 'react-redux'
import Sections from '../components/Sections';
import { closestCorners, defaultDropAnimation, DndContext, DragOverlay } from "@dnd-kit/core";
import TaskCard from '../components/TaskCard';
import { arrayMove } from "@dnd-kit/sortable";
import { persistor } from '../redux/store';
import { BsFillKanbanFill } from "react-icons/bs";
import { TfiReload } from "react-icons/tfi";
import { MdOutlineDarkMode } from "react-icons/md";
import { FiSun } from "react-icons/fi";
import { FaListUl } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";



const sectionsData = [
    { id: "todo", color: "red", sectionName: "Todo", sectionIcon: FaListUl },
    { id: "inprogress", color: "blue", sectionName: "Inprogress", sectionIcon: FaRegClock },
    { id: "done", color: "green", sectionName: "Done", sectionIcon: MdOutlineDone }
]

const colors = {
    todo: "red",
    inprogress: "blue",
    done: "green"
}

const dropAnimation = {
    ...defaultDropAnimation,
    duration: 0, // disables snap-back animation
};

function TodoPage() {
    const dispatch = useDispatch();
    const [activeTask, setActiveTask] = useState(null);

    const { tasks, loading, error } = useSelector(state => state.tasks);

    useEffect(() => {
        async function fetchTasks() {
            if (tasks.length === 0) {
                console.log("calling")
                dispatch(fetchAllTasks())
            }
        }

        fetchTasks()
    }, [])

    const handleReset = async () => {
        await persistor.purge();   // clear persisted data
        dispatch(fetchAllTasks());    // refetch from API
    };

    //sorting the tasks in three columns 
    const groupedTasks = useMemo(() => {
        return {
            todo: tasks?.filter(t => t.status === "todo"),
            inprogress: tasks?.filter(t => t.status === "inprogress"),
            done: tasks?.filter(t => t.status === "done"),
        };
    }, [tasks]);

    const handleDragStart = (event) => {
        const { active } = event;

        const task = tasks.find(t => t.id === active.id);
        setActiveTask(task);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        setActiveTask(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeTaskItem = tasks.find(t => t.id === activeId);
        const overTaskItem = tasks.find(t => t.id === overId);

        // Sorting inside same column
        if (activeTaskItem && overTaskItem && activeTaskItem.status === overTaskItem.status) {

            const columnTasks = tasks.filter(t => t.status === activeTaskItem.status);

            const oldIndex = columnTasks.findIndex(t => t.id === activeId);
            const newIndex = columnTasks.findIndex(t => t.id === overId);

            const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);

            // merge back into full list
            const newTasks = tasks.map(t => {
                if (t.status !== activeTaskItem.status) return t;

                return newColumnTasks.shift();
            });

            dispatch(setTasks(newTasks));
            return;
        }

        // Move to another column
        const newStatus = overTaskItem?.status || over.id;

        dispatch(updateStatus({
            id: activeId,
            updatedStatus: newStatus
        }));
    };

    return (
        <>
            <div className='relative'>

                <header className='flex shadow-lg shadow-gray-300 justify-between items-center md:px-5 px-3 py-4 '>
                    <div className='flex gap-2 '>
                        <BsFillKanbanFill size={35}  color='blue' />
                        <div className='flex flex-col justify-center'>
                            <h1 className='text-md md:text-2xl font-bold mb-0 leading-[1.2rem]'>TODO with DND</h1>
                            <p className='text-[10px] md:text-sm mt-0 '>Organize tasks. Drag, Drop, Done.</p>
                        </div>
                    </div>
                    <div className='flex gap-2 '>
                        <button className='bg-blue-500 text-white flex gap-2 items-center rounded-md px-2 py-1 text-sm cursor-pointer' onClick={handleReset}>
                            <TfiReload /> <span className='hidden md:flex'>Clear and Refetch</span>
                        </button>
                        {/* <button className='p-1 shadow-md shadow-gray-300 cursor-pointer bg-gray-300 rounded-md'>
                            <FiSun size={20}/>
                        </button> */}
                        <button className='p-1 shadow-md shadow-gray-300 cursor-pointer bg-gray-300 rounded-md'>
                            <MdOutlineDarkMode  size={20}/>
                        </button>
                    </div>

                </header>

                {loading && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex md:items-center justify-center z-50">
                        <div className="bg-white px-6 py-3 h-fit rounded-md shadow-md text-lg font-semibold">
                            Loading...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white px-6 py-4 rounded-md shadow-md text-center max-w-sm">
                            <p className="text-red-600 font-semibold mb-2">
                                Something went wrong ⚠️
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                                {error}
                            </p>

                            <button
                                onClick={() => dispatch(fetchAllTasks())}
                                className="bg-red-500 text-white px-4 py-1 rounded-md"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeTask ? (
                            <div className="scale-105">
                                <TaskCard
                                    taskData={activeTask}
                                    color={colors[activeTask.status]}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                    <div className='mx-7  my-5    grid grid-cols-1 md:grid-cols-3 gap-3'>
                        {
                            sectionsData.map((sec) => (
                                <Sections key={sec.id} id={sec.id} color={sec.color} sectionName={sec.sectionName} Icon={sec.sectionIcon} tasksData={groupedTasks?.[sec.id] || []} />
                            ))
                        }
                    </div>
                </DndContext>
            </div>

        </>
    )
}

export default TodoPage
