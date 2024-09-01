interface ScheduleItem {
  day: string,
  subject: string,
  timeStart: string,
  timeEnd: string,
  group: string,
  teacher: string,
}

interface EditingDetails {
  day: string;
  timeSlot: string;
  duration: number;
  subject: string;
  group: string;
}

const defaultEditingDetails: EditingDetails = { day: '', timeSlot: '', duration: 1, subject: '', group: '' };

export type {
  ScheduleItem,
  EditingDetails,
}

export {
  defaultEditingDetails
}