import { useState } from 'react';

const HomePage = () => {
  const [scheduleData, setScheduleData] = useState(null);

  const loadSchedule = () => {
    const data = localStorage.getItem('scheduleData');
    if (data) setScheduleData(JSON.parse(data));
  };

  const saveSchedule = () => {
    if (scheduleData) {
      localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
      alert('Schedule saved successfully!');
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={loadSchedule}>Load Schedule</button>
      <button onClick={saveSchedule}>Save Schedule</button>
    </div>
  );
};

export default HomePage;
