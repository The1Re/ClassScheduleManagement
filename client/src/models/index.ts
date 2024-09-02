interface ScheduleItem {
  id: number,
  day: string,
  subject: string,
  timeStart: string,
  timeEnd: string,
  group: string,
  teacher: string,
}

interface EditingDetails {
  day: string;
  timeStart: string;
  timeEnd: string;
  subject: string;
  group: string;
}

const defaultEditingDetails: EditingDetails = { day: 'MON', timeStart: '8:00', timeEnd: '9:30', subject: '', group: '' };

export type {
  ScheduleItem,
  EditingDetails,
}

export {
  defaultEditingDetails
}