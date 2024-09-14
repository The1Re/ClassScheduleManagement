import { ChangeEvent } from "react";
import { exportToJson } from "../utils";

// import { useState } from 'react';
function HomePage() {

  const loadSchedule = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files?.length != 0) {
      const file = files?.item(0) as File;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        try {
          const parsedData = JSON.parse(fileContent);
          console.log("Loaded Schedule:", parsedData);
          // You can now set this data to state or local storage, etc.
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
      };

      reader.readAsText(file);
    }
  };

  const saveSchedule = async () => {
    exportToJson(JSON.stringify(localStorage));
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-3xl font-bold mb-4">Home Page</h1>
      <label>Import Schedule</label>
      <input type="file" onChange={loadSchedule}/>
      <button className='bg-blue-500 text-white py-2 px-4 rounded mb-2 w-auto mr-4' onClick={saveSchedule}>Save Schedule</button>
    </div>
  );
};

export default HomePage;
