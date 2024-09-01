import { useState, useEffect } from 'react';
import ScheduleTable from '../components/ScheduleTable';
import { ScheduleItem } from '../models';
import { fetchData, getSchedule, updateData } from '../utils';


const ClassPage = () => {
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

  function addGroup(name: string) {
    if (!name || groups.includes(name)) return;
    setGroups([...groups, name]);
  };

  function removeGroup(name: string) {
    const updatedGroups = groups.filter(group => group !== name);
    setGroups(updatedGroups);
    if (selectedGroup === name) setSelectedGroup('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Class Page</h1>
      <div className="flex space-x-4">
        <div className="w-1/3">
          <h2 className="text-2xl font-semibold mb-2">Groups</h2>
          <ul className="list-disc pl-5 mb-4">
            {groups.map((group) => (
              <li
                key={group}
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
            onClick={() => addGroup(prompt('Enter group name') || '')}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-2 w-auto mr-4"
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
        <div className="w-2/3">
          {selectedGroup && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Schedule for {selectedGroup}</h2>
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
