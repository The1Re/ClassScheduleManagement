import { useState, useEffect } from 'react';
import ScheduleTable from '../components/ScheduleTable';
import { ScheduleItem } from '../models';
import { componentToImage, fetchData, getSchedule, updateData } from '../utils';
import Swal from 'sweetalert2';

function ClassPage() {
  const [groups, setGroups] = useState<string[]>(fetchData('groups'));
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    updateData('groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    if (selectedGroup)
      setSchedules(getSchedule('groups', selectedGroup));
  }, [selectedGroup]);

  function addGroup() {
    Swal.fire({
      title: 'Enter Group name',
      input: 'text',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        const name = result.value
        if (!name || groups.some(group => group === name)) return;
        setGroups([...groups, name]);
        Swal.fire({
          title: 'Add Success!',
          icon: 'success'
        })
      }  
    })
  };

  function removeGroup(name: string) {
    Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedGroups = groups.filter(group => group !== name);
        setGroups(updatedGroups);
        if (selectedGroup === name) setSelectedGroup('');
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
        <div className="w-1/6 max-md:w-full">
          <h1 className="text-3xl font-bold mb-4">Class Page</h1>
          <h2 className="text-2xl font-semibold mb-2">Groups</h2>
          <ul className="list-disc pl-5 mb-4">
            {groups.map((group, idx) => (
              <li
                key={idx}
                onClick={() => setSelectedGroup(group)}
                className={`cursor-pointer py-1 ${
                  selectedGroup === group ? 'text-blue-500 font-bold' : ''
                }`}
              >
                {group}
              </li>
            ))}
          </ul>
          <button
            onClick={() => addGroup()}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-2 w-auto mr-6"
          >
            Add Group
          </button>
          {selectedGroup && (
            <button
              onClick={() => removeGroup(selectedGroup)}
              className="bg-red-500 text-white py-2 px-4 rounded w-auto"
            >
              Remove Selected
            </button>
          )}
        </div>
        <div className="w-5/6 max-md:w-full max-md:mt-8">
          {selectedGroup && (
            <>
              <div className='mx-2 flex flex-wrap justify-between mb-2'>
                <h2 className="text-2xl font-semibold mb-2">Schedule for {selectedGroup}</h2>
                <button 
                  className='block border border-green-500 rounded px-3 py-1 text-green-500 hover:bg-gray-100 text-md lg:text-lg'
                  onClick={() => componentToImage(selectedGroup, 'group')}
                >
                  Save as Image
                </button >
              </div>
              <ScheduleTable
                schedule={schedules}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
