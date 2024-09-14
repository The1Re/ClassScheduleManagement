import { useContext, useEffect, useState } from "react";
import { defaultEditingDetails, EditingDetails, ScheduleItem } from "../models";
import { IMyContext, MyContext } from "../pages/TeacherPage";
import { createId, getAllSchedule, getCollision, sortScheduleByTime, timeToCol, updateSchedule } from "../utils";
import { orderedDate } from "../utils/constant";
import Swal from "sweetalert2";

interface EditPopupProps {
    selectedSlot: ScheduleItem | null,
    callback: () => void
}

function EditPopup({ selectedSlot, callback } : EditPopupProps) {
    const { teacher, setSchedules } = useContext(MyContext) as IMyContext
    const [ editingDetails, setEditingDetails ] = useState<EditingDetails>(defaultEditingDetails);

    useEffect(() => {
        if (selectedSlot) 
            setEditingDetails({...selectedSlot})
    }, [selectedSlot])

    const isFormValid = (edit: EditingDetails) => {
        if (timeToCol(edit.timeEnd) < timeToCol(edit.timeStart)){
            alert(`
               Input error: timeStart and timeEnd is not valid!
            `);
            return false;
        }else if (!orderedDate.includes(edit.day)) {
            alert(`
                Input error: day must be ${orderedDate.toString()}
            `)
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (!isFormValid(editingDetails))
            return;

        let schedules = getAllSchedule();
        const newSchedule:ScheduleItem = {
            ...editingDetails,
            teacher: teacher,
            id: selectedSlot ? selectedSlot.id : createId()
        }

        if (selectedSlot) {
            const isEqual = schedules.some(schedule => (
                schedule.day === editingDetails.day &&
                schedule.group === editingDetails.group &&
                schedule.subject === editingDetails.subject &&
                schedule.teacher === teacher &&
                schedule.timeEnd === editingDetails.timeEnd &&
                schedule.timeStart === editingDetails.timeStart &&
                schedule.room === editingDetails.room
            ));
            if (isEqual) {
                callback();
                return;
            };
        }

        const collision = getCollision(newSchedule, schedules);

        if (!collision || (collision.subject === selectedSlot?.subject)) {
            if (selectedSlot) {
                const index = schedules.findIndex(schedule => schedule.id === selectedSlot.id);
                if (index !== -1)
                    schedules[index] = newSchedule
            } else {
                schedules = [ ...schedules, newSchedule ]
            }
    
            updateSchedule(sortScheduleByTime(schedules));
            setSchedules(schedules.filter((schedule) => schedule.teacher === teacher));
            callback();
            Swal.fire({
                title: (selectedSlot) ? 'Edit Success!' : 'Add Success!',
                icon: 'success'
            });
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Collision Detected!',
                html: `
                    <div style="text-align: left; padding-left: 30%;">
                        <p><strong>Collision by: </strong> ${collision.teacher !== newSchedule.teacher ? 'group' : 'teacher'}</p>
                        <p><strong>Subject: </strong> ${collision.subject}</p>
                        <p><strong>Day: </strong> ${collision.day}</p>
                        <p><strong>Time: </strong> ${collision.timeStart} - ${collision.timeEnd}</p>
                        <p><strong>Teacher: </strong> ${collision.teacher}</p>
                        <p><strong>Group: </strong> ${collision.group}</p>
                        <p><strong>Room: </strong> ${collision.room}</p>
                    </div>
                `,
                confirmButtonText: 'Ok'
              });
        }
    };

    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                const schedules = getAllSchedule();
                const updatedSchedule = schedules.filter(schedule => !(
                    schedule.day === editingDetails.day &&
                    schedule.group === editingDetails.group &&
                    schedule.subject === editingDetails.subject &&
                    schedule.teacher === teacher &&
                    schedule.timeEnd === editingDetails.timeEnd &&
                    schedule.timeStart === editingDetails.timeStart &&
                    schedule.room === editingDetails.room
                ));
                updateSchedule(updatedSchedule);
                setSchedules(updatedSchedule.filter((schedule) => schedule.teacher === teacher));
                callback();
                Swal.fire({
                    title: 'Delete Success!',
                    icon: 'success'
                })
            }
        })
    };


    return (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md xl:w-1/4 lg:w-2/4 sm:w-3/6">
            <h2 className="text-lg font-bold mb-4">Edit Schedule</h2>
            <label className="block mb-2">
            Day:
            <input
                type="text"
                value={editingDetails.day}
                onChange={(e) => setEditingDetails({ ...editingDetails, day: e.target.value })}
                className="border border-gray-300 p-2 rounded-md w-full"
            />
            </label>
            <label className="block mb-2">
            Subject:
            <input
                type="text"
                value={editingDetails.subject}
                onChange={(e) => setEditingDetails({ ...editingDetails, subject: e.target.value })}
                className="border border-gray-300 p-2 rounded-md w-full"
            />
            </label>
            <label className="block mb-2">
            Time start:
            <input
                type="text"
                value={editingDetails.timeStart}
                onChange={(e) => setEditingDetails({ ...editingDetails, timeStart: e.target.value })}
                className="border border-gray-300 p-2 rounded-md w-full"
            />
            </label>
            <label className="block mb-2">
            Time end:                  
            <input
                type="text"
                value={editingDetails.timeEnd}
                onChange={(e) => setEditingDetails({ ...editingDetails, timeEnd: e.target.value })}
                className="border border-gray-300 p-2 rounded-md w-full"
            />
            </label>
            <label className="block mb-2">
            Group:
            <input
                type="text"
                value={editingDetails.group}
                onChange={(e) => setEditingDetails({ ...editingDetails, group: e.target.value })}
                className="border border-gray-300 p-2 rounded-md w-full"
            />
            </label>
            <label className="block mb-2">
            Room:
            <input
                type="text"
                value={editingDetails.room}
                onChange={(e) => setEditingDetails({ ...editingDetails, room: e.target.value })}
                className="border border-gray-300 p-2 rounded-md w-full mb-4"
            />
            </label>
            <div className="flex justify-end space-x-2">
            { selectedSlot &&
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                    Delete
                </button>
            }
            <button
                onClick={callback}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Save
            </button>
            </div>
        </div>
        </div>
    )
}

export default EditPopup