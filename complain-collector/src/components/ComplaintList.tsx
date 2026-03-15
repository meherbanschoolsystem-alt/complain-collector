import { Complaint, ComplaintStatus } from "../types";
import { ComplaintItem } from "./ComplaintItem";
import { MessageSquare } from "lucide-react";

interface ComplaintListProps {
  complaints: Complaint[];
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
}

export function ComplaintList({ complaints, onUpdateStatus }: ComplaintListProps) {
  if (complaints.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No complaints yet</h3>
        <p className="text-slate-500">Be the first to speak up and share your feedback.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Recent Complaints</h2>
        <span className="text-sm text-slate-500">{complaints.length} total</span>
      </div>
      {complaints.map((complaint) => (
        <ComplaintItem
          key={complaint.id}
          complaint={complaint}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
}