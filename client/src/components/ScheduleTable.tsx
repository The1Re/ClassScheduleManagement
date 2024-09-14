import { useEffect, useState } from 'react';
import { headers, orderedDate } from '../utils/constant';
import { getColorByDate, timeToCol } from '../utils';
import { ScheduleItem } from '../models';
import EditPopup from './EditPopup';

interface ScheduleTableProps {
  schedule: ScheduleItem[];
  isModify?: boolean;
}

function ScheduleTable({ schedule, isModify }: ScheduleTableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (isModify && event.key == 'Enter') {
        setIsEditing(true);
      }
    }

    if (!isEditing)
      document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);
  }, [isEditing, isModify])

  function handleEdit() {
    setSelectedSlot(null);
    setIsEditing(false);
  }

  function selectSlot(course: ScheduleItem) {
    setSelectedSlot(course);
    setIsEditing(true);
  }

  return (
    <div className='flex flex-col'>
      <div className="overflow-x-auto border">
          <div className="overflow-x-hidden table-w" id="table">
            <div className="grid grid-cols-26">
              {headers.map(( header, idx ) => 
              <div key={idx}
                className="border py-1 pl-1 col-span-2 text-black border-gray-700"
              >
              {header}
              </div>
              )}
            </div>

            {orderedDate.map((date, dateIndex) => (
              <div key={dateIndex} className="grid grid-cols-26 min-h-16 md:min-h-20 border border-gray-700">
                <div className={`p-1 md:p-3 col-span-2 border-r-2 border-gray-700 ${getColorByDate(date)}`} >
                  <span className="font-bold text-gray-900">{ date }</span>
                </div>
                {
                  schedule.map((course, courseIndex) => {
                    if (course.day == date)
                    return <div
                      key={`course-${courseIndex}`}
                      onClick={() => isModify && selectSlot(course)}
                      className={`
                        border
                        p-2
                        md:px-3 md:py-2
                        rounded
                        text-xs
                        md:text-sm
                        flex flex-col
                        justify-between
                        hover:bg-opacity-70
                        overflow-hidden
                        ${isModify && `cursor-pointer`}
                        bg-opacity-100 border-gray-700
                        ${getColorByDate(date)}
                        my-col-start-${timeToCol(course.timeStart)} 
                        my-col-end-${timeToCol(course.timeEnd)}
                      `}
                    >
                      <p className="flex flex-warp justify-between mb-2">
                        <span>{`${course.room}`}</span>
                      </p>
                      <p>{course.subject}</p>
                      <div className="flex justify-between text-gray-700 text-xs">
                        { isModify 
                          ?
                          <div className="text-right ">
                            <span>group : {course.group}</span>
                          </div> 
                          :
                          <div>
                            <span>teacher : <br />{course.teacher}</span>
                          </div>
                        }
                      </div>
                    </div>
                  })
                }
              </div>
            ))}
          </div>
        </div>

      {
        isEditing &&
        <EditPopup 
          selectedSlot={selectedSlot}
          callback={handleEdit}
        />
      }

      {
        isModify &&
        <button 
          className="bg-blue-500 text-white py-2 px-4 rounded mb-2 w-auto mt-6 hover:bg-blue-400"
          onClick={() => setIsEditing(true)}
        >
          Add
        </button>
      }
    </div>
  );
};

export default ScheduleTable;
