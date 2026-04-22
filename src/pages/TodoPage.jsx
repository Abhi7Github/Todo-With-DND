import { useEffect, useMemo, useState } from 'react'
import { fetchAllTasks, setTasks, updateStatus, } from '../redux/taskSlice'
import { useDispatch, useSelector } from 'react-redux'
import Sections from '../components/Sections';
import { closestCorners, defaultDropAnimation, DndContext, DragOverlay } from "@dnd-kit/core";
import TaskCard from '../components/TaskCard';
import { arrayMove } from "@dnd-kit/sortable";
import { persistor } from '../redux/store';

const sectionsData = [
    { id: "todo", color: "red", sectionName: "Todo" },
    { id: "inprogress", color: "blue", sectionName: "Inprogress" },
    { id: "done", color: "green", sectionName: "Done" }
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
            <div className='relative m-2'>

                {loading && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white px-6 py-3 rounded-md shadow-md text-lg font-semibold">
                            Loading...
                        </div>
                    </div>
                )}
                <div className='flex flex-col md:flex-row justify-between items-center mx-10'>
                    <div></div>
                    <h1 className='text-3xl text-center font-semibold mt-2'>TODO with DND</h1>
                    <button className='bg-gray-300 rounded-md px-2 py-1 text-sm cursor-pointer' onClick={handleReset}>Clear and Refetch data</button>
                </div>

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
                    <div className='my-5 mx-10  grid grid-cols-1 md:grid-cols-3 gap-3'>
                        {
                            sectionsData.map((sec) => (
                                <Sections key={sec.id} id={sec.id} color={sec.color} sectionName={sec.sectionName} tasksData={groupedTasks?.[sec.id] || []} />
                            ))
                        }
                    </div>
                </DndContext>
            </div>

        </>
    )
}

export default TodoPage
