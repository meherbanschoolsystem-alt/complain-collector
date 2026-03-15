export type ComplaintStatus = "pending" | "read" | "solved";

export interface Complaint {
  id: string;
  description: string;
  category: string;
  allowFollowUp: boolean;
  email?: string;
  phone?: string;
  timestamp: Date;
  status: ComplaintStatus;
  solution?: string;
}