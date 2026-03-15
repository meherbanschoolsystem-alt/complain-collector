import { useState } from "react";
import { ComplaintForm } from "./components/ComplaintForm";
import { ComplaintList } from "./components/ComplaintList";
import { Complaint, ComplaintStatus } from "./types";

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const handleSubmit = (complaint: Omit<Complaint, "id" | "timestamp" | "status">) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      status: "pending",
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const updateStatus = (id: string, status: ComplaintStatus, solution?: string) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id 
          ? { ...complaint, status, solution: solution || complaint.solution }
          : complaint
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">ComplainCollector</h1>
              <p className="text-sm text-slate-500">Anonymous feedback, collected securely</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ComplaintForm onSubmit={handleSubmit} />
          </div>
          <div>
            <ComplaintList complaints={complaints} onUpdateStatus={updateStatus} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;