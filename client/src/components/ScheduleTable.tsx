import React, { useState } from 'react';

interface ScheduleTableProps {
  schedule: { [day: string]: { [timeSlot: string]: string } };
  onEdit?: (day: string, timeSlot: string, duration: number, subject: string) => void;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingDetails, setEditingDetails] = useState({ day: '', timeSlot: '', duration: 1, subject: '' });

  const handleEdit = (day: string, timeSlot: string) => {
    setIsEditing(true);
    setEditingDetails({ ...editingDetails, day, timeSlot });
  };

  const handleSave = () => {
    if (onEdit) onEdit(editingDetails.day, editingDetails.timeSlot, editingDetails.duration, editingDetails.subject);
    setIsEditing(false);
    setEditingDetails({ day: '', timeSlot: '', duration: 1, subject: '' });
  };

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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day}</td>
              {timeSlots.map((timeSlot) => (
                <td
                  key={`${day}-${timeSlot}`}
                  onClick={() => handleEdit(day, timeSlot)}
                  className={`px-6 py-4 whitespace-nowrap text-sm ${onEdit ? 'cursor-pointer' : ''} ${schedule[day]?.[timeSlot] ? 'bg-green-100' : ''} hover:bg-gray-100`}
                >
                  {schedule[day]?.[timeSlot] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-bold mb-4">Edit Schedule</h2>
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
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
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
