import { useState, useEffect } from 'react';
import ScheduleTable from '../components/ScheduleTable';

const ClassPage = () => {
  const [groups, setGroups] = useState<string[]>(() => {
    const savedGroups = localStorage.getItem('groups');
    return savedGroups ? JSON.parse(savedGroups) : [];
  });
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<{ [group: string]: { [day: string]: { [timeSlot: string]: string } } }>(() => {
    const savedSchedule = localStorage.getItem('groupSchedule');
    return savedSchedule ? JSON.parse(savedSchedule) : {};
  });

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('groupSchedule', JSON.stringify(schedule));
  }, [schedule]);

  const addGroup = (name: string) => {
    if (!name || groups.includes(name)) return;
    setGroups([...groups, name]);
  };

  const removeGroup = (name: string) => {
    const updatedGroups = groups.filter(dept => dept !== name);
    setGroups(updatedGroups);
    if (selectedGroup === name) setSelectedGroup(null);

    const updatedSchedule = { ...schedule };
    delete updatedSchedule[name];
    setSchedule(updatedSchedule);
  };

  const selectGroup = (name: string) => setSelectedGroup(name);

  const editSchedule = (
    day: string,
    timeSlot: string,
    duration: number,
    subject: string
  ) => {
    if (!selectedGroup) return;
  
    // Calculate end time based on duration
    const detailedTimeSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
    ];
  
    const startIndex = detailedTimeSlots.indexOf(timeSlot);
    if (startIndex === -1) return;
  
    const updatedDaySchedule = { ...(schedule[selectedGroup]?.[day] || {}) };
  
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
      [selectedGroup]: {
        ...(schedule[selectedGroup] || {}),
        [day]: updatedDaySchedule,
      },
    });
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
                onClick={() => selectGroup(group)}
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
            className="bg-blue-500 text-white py-2 px-4 rounded mb-2 w-auto"
          >
            Add Group
          </button>
          {selectedGroup && (
            <button
              onClick={() => removeGroup(selectedGroup)}
              className="bg-red-500 text-white py-2 px-4 rounded w-auto"
            >
              Remove Selected Group
            </button>
          )}
        </div>
        <div className="w-2/3">
          {selectedGroup && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Schedule for {selectedGroup}</h2>
              <ScheduleTable
                schedule={schedule[selectedGroup] || {}}
                onEdit={editSchedule}
              />
            </>
          )}
        </div>
      </div>
    </div>
    // <div>
    //   <h1>Class Page</h1>
    //   <div style={{ display: 'flex' }}>
    //     <div>
    //       <h2>Groups</h2>
    //       <ul>
    //         {groups.map((group) => (
    //           <li key={group} onClick={() => selectGroup(group)}>
    //             {group}
    //           </li>
    //         ))}
    //       </ul>
    //       <button onClick={() => addGroup(prompt('Enter group name') || '')}>Add Group</button>
    //       {selectedGroup && (
    //         <button onClick={() => removeGroup(selectedGroup)}>Remove Selected Group</button>
    //       )}
    //     </div>
    //     <div>
    //       {selectedGroup && (
    //         <>
    //           <h2>Schedule for {selectedGroup}</h2>
    //           <ScheduleTable
    //             schedule={schedule[selectedGroup] || {}}
    //             onEdit={editSchedule}
    //           />
    //         </>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default ClassPage;
