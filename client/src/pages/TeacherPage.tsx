import { useState, useEffect, createContext } from 'react';
import ScheduleTable from '../components/ScheduleTable';
import { fetchData, getSchedule, updateData } from '../utils';
import { ScheduleItem } from '../models';

export interface IMyContext {
  teacher: string
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleItem[]>>
}

export const MyContext = createContext<IMyContext | null>(null);

function TeacherPage() {
  const [teachers, setTeachers] = useState<string[]>(fetchData('teachers'));
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    updateData('teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    if (selectedTeacher){
      setSchedules(getSchedule('teachers', selectedTeacher));
      return;
    }
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
        <div className="w-2/3 ">
          {selectedTeacher && (
            <>
              <h2 className="text-2xl font-semibold mb-2 w-full">Schedule for {selectedTeacher}</h2>
              <MyContext.Provider value={{ teacher: selectedTeacher, setSchedules }}>
                <ScheduleTable
                  schedule={schedules}
                  isModify={true}
                />
              </MyContext.Provider>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;