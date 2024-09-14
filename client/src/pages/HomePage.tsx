// import { ChangeEvent } from "react";
import Swal from "sweetalert2";
import { exportToJson } from "../utils";
import { ILocalStorage } from "../models";

// import { useState } from 'react';
function HomePage() {

  const ImportSchedule = async () => {
    const { value: file } = await Swal.fire({
      title: "Select file",
      input: "file",
      inputAttributes: {
        "accept": "application/json",
      }
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        
        try{
          const data = await (await fetch(fileContent)).json() as ILocalStorage;
          localStorage.clear();
          localStorage.setItem("groups", data.groups.toString());
          localStorage.setItem("teachers", data.teachers.toString());
          if (data.schedules)
            localStorage.setItem("schedules", data.schedules.toString());
          Swal.fire({
            title: 'Import Success!',
            icon: 'success'
          });
        }catch{
          Swal.fire({
            title: 'Something Error!',
            icon: 'error'
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const ExportSchedule = () => {
    const groups = localStorage.getItem('groups');
    const teachers = localStorage.getItem('teachers');

    if (groups && teachers){
      exportToJson(JSON.stringify(localStorage));
    }else{
      Swal.fire({
        title: "Warning : no data can't export",
        icon: 'warning'
      })
    }
  };

  const ClearSchedule = () => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'question',
      confirmButtonText: 'Yes',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          title: 'Clear Success!',
          icon: 'success'
        })
      }
    })
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-3xl font-bold mb-4">Home Page</h1>
      <button className='bg-blue-500 text-white py-2 px-4 rounded mb-2 w-auto mr-4' onClick={ImportSchedule}>Import Schedule</button>
      <button className='bg-blue-500 text-white py-2 px-4 rounded mb-2 w-auto mr-4' onClick={ExportSchedule}>Export Schedule</button>
      <button className='bg-blue-500 text-white py-2 px-4 rounded mb-2 w-auto mr-4' onClick={ClearSchedule}>Clear Schedule</button>
    </div>
  );
};

export default HomePage;
