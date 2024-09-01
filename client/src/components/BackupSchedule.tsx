import React, { useState } from 'react';
import { defaultEditingDetails, EditingDetails, ScheduleItem } from '../models'
import { detailedTimeSlots as timeSlots, days } from '../utils/constant'

interface ScheduleTableProps {
  schedule: ScheduleItem[];
  onEdit?: (details: EditingDetails) => boolean;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingDetails, setEditingDetails] = useState<EditingDetails>(defaultEditingDetails);
  

  function handleEdit(day: string, timeSlot: string) {
    const existingEntry = findSubject(day, timeSlot);

    if (existingEntry) {
      const duration = timeSlots.indexOf(existingEntry.timeEnd) - timeSlots.indexOf(existingEntry.timeStart);
      setEditingDetails({
        ...existingEntry,
        duration: duration > 0 ? duration : 1,
        timeSlot: existingEntry.timeStart
      })
    }else{
      setEditingDetails({ day, timeSlot, duration: 1, subject: '', group: '' })
    }

    setIsEditing(true);
  };

  function handleSave() {
    let status = false;
    if (onEdit) {
      status = onEdit(editingDetails);
    }

    if(status) resetEditing();
  };

  function handleDelete() {
    if (onEdit) {
      onEdit({
        ...editingDetails,
        subject: '', // Clear subject to indicate deletion
        group: '',   // Clear group to indicate deletion
        duration: 1, // Reset duration
      });
    }
    resetEditing();
  }

  function resetEditing() {
    setIsEditing(false);
    setEditingDetails({ day: '', timeSlot: '', duration: 1, subject: '', group: '' });
  }

  function findSubject(day: string, timeSlot: string) {
    return schedule.find(
      (item) =>
        item.day === day &&
        item.timeStart <= timeSlot &&
        item.timeEnd > timeSlot
    );
  }

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day/Time</th>
            {timeSlots.map((timeSlot) => (
              <th key={timeSlot} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{timeSlot}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {days.map((day, dayIdx) => (
            <tr key={day} className={dayIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 h-16">{day}</td>
              {timeSlots.map((timeSlot) => (
                <td
                  key={`${day}-${timeSlot}`}
                  onClick={() => handleEdit(day, timeSlot)}
                  className={`px-6 py-4 whitespace-nowrap text-sm ${onEdit ? 'cursor-pointer' : ''} ${findSubject(day, timeSlot)?.subject || '' ? 'bg-green-100' : ''} hover:bg-gray-100`}
                >
                  {findSubject(day, timeSlot)?.subject || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && onEdit && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-bold mb-4">Edit Schedule</h2>
            <label className="block">
              Detail : {editingDetails.day} {editingDetails.timeSlot}
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
              Duration (in slots of 30 mins): 
              <input
                type="number"
                value={editingDetails.duration}
                onChange={(e) => setEditingDetails({ ...editingDetails, duration: parseInt(e.target.value) })}
                min="1"
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
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
              <button
                onClick={resetEditing}
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
      )}
    </div>
  );
};

export default ScheduleTable;
