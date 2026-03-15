export const CATEGORIES = [
  { value: "facilities", label: "Facilities", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "behavior", label: "Behavior", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "process", label: "Process", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "other", label: "Other", color: "bg-slate-100 text-slate-800 border-slate-200" },
] as const;

export type CategoryValue = typeof CATEGORIES[number]["value"];

export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: "Clock",
  },
  read: {
    label: "Read",
    color: "bg-sky-100 text-sky-700 border-sky-200",
    icon: "Eye",
  },
  solved: {
    label: "Solved",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: "CheckCircle",
  },
} as const;

export type ComplaintStatus = keyof typeof STATUS_CONFIG;