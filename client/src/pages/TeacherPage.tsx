import { useState, useEffect } from 'react';
import ScheduleTable from '../components/ScheduleTable';
import { fetchData, getSchedule, updateData, updateSchedule } from '../utils';
import { EditingDetails, ScheduleItem } from '../models';
import { detailedTimeSlots } from '../utils/constant';

const TeacherPage = () => {
  const [teachers, setTeachers] = useState<string[]>(fetchData('teachers'));
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    updateData('teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    if (selectedTeacher)
      setSchedules(getSchedule('teachers', selectedTeacher));
  }, [selectedTeacher])

  function addTeacher(name: string) {
    if (!name || teachers.some(teacher => teacher === name)) return;
    setTeachers([...teachers, name]);
  };

  function removeTeacher(name: string) {
    const updatedTeachers = teachers.filter(teacher => teacher !== name);
    setTeachers(updatedTeachers);
    if (selectedTeacher === name) setSelectedTeacher('');
  };

  function editSchedule({ day, timeSlot, duration, subject, group }: EditingDetails) : boolean {
    const startIndex = detailedTimeSlots.indexOf(timeSlot);

    if (subject === '') {
      // If the subject is empty, remove the schedule item
      const updatedSchedule = schedules.filter(
        (item) => !(item.day === day && item.timeStart === timeSlot)
      );
      setSchedules(updatedSchedule);
      updateSchedule(updatedSchedule);
      return true;
    }

    const endTime = detailedTimeSlots[startIndex + duration];

    const newSchedule: ScheduleItem = {
      day,
      subject,
      timeStart: timeSlot,
      timeEnd: endTime || timeSlot,
      group,
      teacher: selectedTeacher
    };

    const conflictItem = schedules.find((item) => {
      if (item.day !== day) return false;
      const existingStartIndex = detailedTimeSlots.indexOf(item.timeStart);
      const existingEndIndex = detailedTimeSlots.indexOf(item.timeEnd);

      const newStartIndex = detailedTimeSlots.indexOf(newSchedule.timeStart);
      const newEndIndex = detailedTimeSlots.indexOf(newSchedule.timeEnd);

      // Check if the time slots overlap
      return (
        (newStartIndex < existingEndIndex && newEndIndex > existingStartIndex)
      );
    });

    if (conflictItem) {
      alert(`
        Conflict detected:
        day: ${conflictItem.day}
        Time: ${conflictItem.timeStart} - ${conflictItem.timeEnd}
        Subject: ${conflictItem.subject}
        Group: ${conflictItem.group}
      `);
      return false;
    }

    const updatedSchedule = [...schedules, newSchedule];
    setSchedules(updatedSchedule);
    updateSchedule(updatedSchedule);
    return true;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Teacher Page</h1>
      <div className="flex space-x-4">
        <div className="w-1/3">
          <h2 className="text-2xl font-semibold mb-2">Teachers</h2>
          <ul className="list-disc pl-5 mb-4">
            {teachers.map((teacher, idx) => (
              <li
                key={idx}
                onClick={() => setSelectedTeacher(teacher)}
                className={`cursor-pointer py-1 ${
                  selectedTeacher === teacher ? 'text-blue-500 font-bold' : ''
                }`}
              >
                {teacher}
              </li>
            ))}
          </ul>
          <button
            onClick={() => addTeacher(prompt('Enter teacher name') || '')}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-2 w-auto mr-4"
          >
            Add Teacher
          </button>
          {selectedTeacher && (
            <button
              onClick={() => removeTeacher(selectedTeacher)}
              className="bg-red-500 text-white py-2 px-4 rounded w-auto"
            >
              Remove Selected
            </button>
          )}
        </div>
        <div className="w-2/3">
          {selectedTeacher && (
            <>
              <h2 className="text-2xl font-semibold mb-2 w-full">Schedule for {selectedTeacher}</h2>
              <ScheduleTable
                schedule={schedules}
                onEdit={editSchedule}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;