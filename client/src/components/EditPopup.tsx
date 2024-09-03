import { useContext, useEffect, useState } from "react";
import { defaultEditingDetails, EditingDetails, ScheduleItem } from "../models";
import { IMyContext, MyContext } from "../pages/TeacherPage";
import { createId, getAllSchedule, getCollision, sortScheduleByTime, timeToCol, updateSchedule } from "../utils";
import { orderedDate } from "../utils/constant";


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

    function isFormValid(): boolean {
        if (timeToCol(editingDetails.timeEnd) < timeToCol(editingDetails.timeStart)){
            alert(`
               Input error: timeStart and timeEnd is not valid!
            `);
            return false;
        }else if (!orderedDate.includes(editingDetails.day)) {
            alert(`
                Input error: day must be ${orderedDate.toString()}
            `)
            return false;
        }
        return true;
    }

    function handleSave() {
        if (!isFormValid())
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
                schedule.timeStart === editingDetails.timeStart
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
        }else{
            alert(`
                Collision by ${collision.teacher !== newSchedule.teacher ? 'group' : 'teacher'}
                subject : ${collision.subject}
                day : ${collision.day}
                time : ${collision.timeStart} - ${collision.timeEnd}
                teacher : ${collision.teacher}
                group : ${collision.group}
            `)
        }
    }

    function handleDelete() {
        const schedules = getAllSchedule();
        const updatedSchedule = schedules.filter(schedule => !(
            schedule.day === editingDetails.day &&
            schedule.group === editingDetails.group &&
            schedule.subject === editingDetails.subject &&
            schedule.teacher === teacher &&
            schedule.timeEnd === editingDetails.timeEnd &&
            schedule.timeStart === editingDetails.timeStart
        ));
        updateSchedule(updatedSchedule);
        setSchedules(updatedSchedule.filter((schedule) => schedule.teacher === teacher));
        callback();
    }

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