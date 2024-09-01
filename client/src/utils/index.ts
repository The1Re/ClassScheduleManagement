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
    if (type == 'teachers') {
        return schedules.filter((schedule) => schedule.teacher == name)
    }else {
        return schedules.filter((schedule) => schedule.group == name)
    }
}

function updateSchedule(newSchedule: ScheduleItem[]) : void{
    localStorage.setItem('schedules', JSON.stringify(newSchedule))
}

export {
    fetchData,
    updateData,
    getSchedule,
    updateSchedule
}