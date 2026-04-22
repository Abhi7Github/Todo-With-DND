import React, { useState } from 'react'
import { MdModeEdit } from "react-icons/md";
import { IoIosRemove } from "react-icons/io";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";


const bgColors = {
    red: "bg-red-200",
    blue: "bg-blue-200",
    green: "bg-green-200",
  };

  const buttonColors = {
    red: "bg-red-400",
    blue: "bg-blue-400",
    green: "bg-green-400",
  };


const TaskCard = ({ taskData, color, handleRemoveTask, handleUpdateTask }) => {
    const [showUpadteBox, setShowUpdateBox] = useState(false)
    const [updatedTask,setUpdatedTask]=useState(taskData.title)
    const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: taskData.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0  : 1,
    };

    const handleUpdateClick=(e)=>{
        e.stopPropagation();
        setShowUpdateBox(true)
    }

    const handleRemoveClick=(e,id)=>{
        e.stopPropagation();
        handleRemoveTask(id)
    }

  
    const handleUpdate=()=>{
        handleUpdateTask(taskData.id, updatedTask);
        setShowUpdateBox(false)
    }

    return (
        <div  key={taskData.id} ref={setNodeRef} style={style}  {...attributes} 
            className={`${bgColors[color]} p-2 my-1 rounded-md`} >
            <div className='flex justify-end gap-2  '   >
                <MdModeEdit size={13} className='cursor-pointer' onClick={handleUpdateClick}/>
                <IoIosRemove size={15} className='cursor-pointer' onClick={(e) => handleRemoveClick(e,taskData.id)} />
            </div>
            {
                showUpadteBox ? (
                    <div className={`${bgColors[color]}  my-1`}>
                        <input type='text' name='newTask' value={updatedTask} onChange={e => setUpdatedTask(e.target.value)}
                            className={`border-none rounded-md outline-none w-full ${bgColors[color]} p-1`}
                        />
                        <div className='flex justify-end gap-1'>
                            <button className={`text-sm ${buttonColors[color]} rounded-md py-1 px-2 cursor-pointer`} onClick={handleUpdate}>Update</button>
                            <button className={`text-sm ${buttonColors[color]} rounded-md py-1 px-2 cursor-pointer`} onClick={()=>setShowUpdateBox(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <p className='cursor-grab active:cursor-grabbing' {...listeners}>{taskData.title}</p>
                )
            }
            
        </div>
    )
}

export default TaskCard