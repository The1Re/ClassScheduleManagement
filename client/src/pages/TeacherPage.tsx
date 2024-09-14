import { useState, useEffect, createContext } from 'react';
import ScheduleTable from '../components/ScheduleTable';
import { fetchData, getAllSchedule, getSchedule, sortScheduleByTime, updateData, updateSchedule } from '../utils';
import { ScheduleItem } from '../models';
import Swal from 'sweetalert2';

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

  function addTeacher() {
    Swal.fire({
      title: 'Enter teacher name',
      input: 'text',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        const name = result.value
        if (!name || teachers.some(teacher => teacher === name)) return;
        setTeachers([...teachers, name]);
        Swal.fire({
          title: 'Add Success!',
          icon: 'success'
        })
      }  
    })
  };

  function removeTeacher(name: string) {
    Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        const allSchedule = getAllSchedule();
        const newSchedules = allSchedule.filter((s) => s.teacher != name);
        updateSchedule(sortScheduleByTime(newSchedules));

        const updatedTeachers = teachers.filter(teacher => teacher !== name);
        setTeachers(updatedTeachers);
        if (selectedTeacher === name) setSelectedTeacher('');

        Swal.fire({
          title: 'Delete Success!',
          icon: 'success'
        })
      }
    })
  };

  

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 max-md:flex-col">
        <div className="w-1/5 max-md:w-full">
          <h1 className="text-3xl font-bold mb-4">Teacher Page</h1>
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
            onClick={() => addTeacher()}
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
        <div className="w-4/5 max-md:w-full">
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