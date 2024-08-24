import { useState, useEffect } from 'react';
import ScheduleTable from '../components/ScheduleTable';

const TeacherPage = () => {
  const [teachers, setTeachers] = useState<string[]>(() => {
    const savedTeachers = localStorage.getItem('teachers');
    return savedTeachers ? JSON.parse(savedTeachers) : [];
  });
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<{ [teacher: string]: { [day: string]: { [timeSlot: string]: string } } }>(() => {
    const savedSchedule = localStorage.getItem('teacherSchedule');
    return savedSchedule ? JSON.parse(savedSchedule) : {};
  });

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('teacherSchedule', JSON.stringify(schedule));
  }, [teachers, schedule]);

  const addTeacher = (name: string) => {
    if (!name || teachers.includes(name)) return;
    setTeachers([...teachers, name]);
  };

  const removeTeacher = (name: string) => {
    const updatedTeachers = teachers.filter(teacher => teacher !== name);
    setTeachers(updatedTeachers);
    if (selectedTeacher === name) setSelectedTeacher(null);

    const updatedSchedule = { ...schedule };
    delete updatedSchedule[name];
    setSchedule(updatedSchedule);
  };

  const selectTeacher = (name: string) => setSelectedTeacher(name);

  const editSchedule = (
    day: string,
    timeSlot: string,
    duration: number,
    subject: string
  ) => {
    if (!selectedTeacher) return;
  
    // Calculate end time based on duration
    const detailedTimeSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
    ];
  
    const startIndex = detailedTimeSlots.indexOf(timeSlot);
    if (startIndex === -1) return;
  
    const updatedDaySchedule = { ...(schedule[selectedTeacher]?.[day] || {}) };
  
    // Check for overlapping schedule
    for (let i = 0; i < duration; i++) {
      const slot = detailedTimeSlots[startIndex + i];
      if (!slot) break;
  
      if (updatedDaySchedule[slot]) {
        // If there's a conflict, show an error popup
        alert(`Error: Time slot ${slot} is already occupied by ${updatedDaySchedule[slot]}.`);
        return;
      }
    }
  
    // If no conflict, update the schedule
    for (let i = 0; i < duration; i++) {
      const slot = detailedTimeSlots[startIndex + i];
      if (!slot) break;
      updatedDaySchedule[slot] = subject;
    }
  
    setSchedule({
      ...schedule,
      [selectedTeacher]: {
        ...(schedule[selectedTeacher] || {}),
        [day]: updatedDaySchedule,
      },
    });
  };
  
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Teacher Page</h1>
      <div className="flex space-x-4">
        <div className="w-1/3">
          <h2 className="text-2xl font-semibold mb-2">Teachers</h2>
          <ul className="list-disc pl-5 mb-4">
            {teachers.map((teacher) => (
              <li
                key={teacher}
                onClick={() => selectTeacher(teacher)}
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
            className="bg-blue-500 text-white py-2 px-4 rounded mb-2 w-auto"
          >
            Add Teacher
          </button>
          {selectedTeacher && (
            <button
              onClick={() => removeTeacher(selectedTeacher)}
              className="bg-red-500 text-white py-2 px-4 rounded w-auto"
            >
              Remove Selected Teacher
            </button>
          )}
        </div>
        <div className="w-2/3">
          {selectedTeacher && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Schedule for {selectedTeacher}</h2>
              <ScheduleTable
                schedule={schedule[selectedTeacher] || {}}
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