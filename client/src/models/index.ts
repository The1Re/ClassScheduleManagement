interface ScheduleItem {
  id: number,
  day: string,
  subject: string,
  timeStart: string,
  timeEnd: string,
  group: string,
  teacher: string,
  room: string
}

interface EditingDetails {
  day: string,
  timeStart: string,
  timeEnd: string,
  subject: string,
  group: string,
  room: string
}

interface ILocalStorage {
  teachers: string[],
  groups: string[],
  schedules?: ScheduleItem[]
}

const defaultEditingDetails: EditingDetails = { day: 'MON', timeStart: '8:00', timeEnd: '9:30', subject: '', group: '', room: '' };

export type {
  ScheduleItem,
  EditingDetails,
  ILocalStorage
}

export {
  defaultEditingDetails
}