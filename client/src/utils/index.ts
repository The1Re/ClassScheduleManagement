import { ScheduleItem } from "../models";


function fetchData(type: 'teachers' | 'groups') : string[]{
    const data = localStorage.getItem(type);
    return data ? JSON.parse(data) : [];
}

function updateData(type: 'teachers' | 'groups', value: string) : void{
    localStorage.setItem(type, value);
}

function getSchedule(type: 'teachers' | 'groups', name: string) : ScheduleItem[]{
    const data = localStorage.getItem('schedules');
    if (!data) return [];

    const schedules = JSON.parse(data) as ScheduleItem[];
    if (type === 'teachers') {
        return schedules.filter((schedule) => schedule.teacher === name)
    }else {
        return schedules.filter((schedule) => schedule.group === name)
    }
}

function getAllSchedule() : ScheduleItem[]{
    const data = localStorage.getItem('schedules');
    return data ? JSON.parse(data) : [];
}

function updateSchedule(newSchedule: ScheduleItem[]) : void{
    localStorage.setItem('schedules', JSON.stringify(newSchedule))
}

const getColorByDate = (date:string): string => {
    const color:{ [key: string]: string } = {
        MON: 'bg-yellow-200',
        TUE: 'bg-pink-400',
        WED: 'bg-green-400',
        THU: 'bg-yellow-400',
        FRI: 'bg-blue-400',
        SAT: 'bg-purple-400',
        SUN: 'bg-red-400',
    }
    return color[date]
}
  
const timeToCol = (timeString: string) => {
    const time = timeString?.split(':') || []
    if (time.length != 2) return 0
    const remainder = +time[1]/60
    return (+time[0] + remainder) * 2 - 13
}

const sortScheduleByTime = (schedules: ScheduleItem[]) => {
    schedules.sort((a, b) => {
        return timeToCol(a.timeStart) - timeToCol(b.timeStart) 
    })
    return schedules;
}

function createId(): number{
    const schedules = getAllSchedule();
    if (schedules.length == 0) return 1;
    schedules.sort((a, b) => b.id - a.id);
    return schedules[0].id + 1;
}

function getCollision(target: ScheduleItem, schedules: ScheduleItem[]): ScheduleItem | undefined{
    const teacherCollision = schedules.find((schedule) => {
        if (target.day !== schedule.day || target.teacher !== schedule.teacher) return false;
        const startTargetCol = timeToCol(target.timeStart);
        const endTargetCol = timeToCol(target.timeEnd);
        const startCol = timeToCol(schedule.timeStart);
        const endCol = timeToCol(schedule.timeEnd);
        
        console.log(startTargetCol, endCol);
        for (let i=startTargetCol; i<=endTargetCol; i++) {
            if (i>startCol && i<endCol)
                return true;
        }
        return false;
    });

    const studentCollision = schedules.find((schedule) => {
        if (target.day !== schedule.day || target.group !== schedule.group) return false;
        const startTargetCol = timeToCol(target.timeStart);
        const endTargetCol = timeToCol(target.timeEnd);
        const startCol = timeToCol(schedule.timeStart);
        const endCol = timeToCol(schedule.timeEnd);
        
        for (let i=startTargetCol; i<=endTargetCol; i++) {
            if (i>startCol && i<endCol)
                return true;
        }
        return false;
    });

    return teacherCollision || studentCollision;
}

const download = (content:string, fileName?: string) => {
    // Create a link element
    const blob = new Blob([content], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName || 'schedule.json'; // Specify the file name for the download

    // Append the link to the body
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
 }

export {
    fetchData,
    updateData,
    getSchedule,
    getAllSchedule,
    updateSchedule,
    createId,
    timeToCol,
    getColorByDate,
    sortScheduleByTime,
    getCollision,
    download
}