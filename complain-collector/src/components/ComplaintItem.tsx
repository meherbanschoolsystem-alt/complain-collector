import { useState } from "react";
import { Complaint, ComplaintStatus } from "../types";
import { CATEGORIES, STATUS_CONFIG } from "../constants/categories";
import { timeAgo } from "../utils/timeAgo";
import { Clock, Mail, Phone, Eye, CheckCircle, MoreVertical, Copy, Check, MessageSquare, X, Save } from "lucide-react";

interface ComplaintItemProps {
  complaint: Complaint;
  onUpdateStatus: (id: string, status: ComplaintStatus, solution?: string) => void;
}

export function ComplaintItem({ complaint, onUpdateStatus }: ComplaintItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showSolutionInput, setShowSolutionInput] = useState(false);
  const [solutionText, setSolutionText] = useState("");
  const category = CATEGORIES.find((c) => c.value === complaint.category) || CATEGORIES[3];
  const statusConfig = STATUS_CONFIG[complaint.status];
  const shouldTruncate = complaint.description.length > 120;
  const displayText = expanded || !shouldTruncate
    ? complaint.description
    : complaint.description.slice(0, 120) + "...";

  const getStatusIcon = () => {
    switch (complaint.status) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "read":
        return <Eye className="w-3 h-3" />;
      case "solved":
        return <CheckCircle className="w-3 h-3" />;
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleMarkSolved = () => {
    setShowMenu(false);
    setShowSolutionInput(true);
  };

  const handleSaveSolution = () => {
    if (solutionText.trim()) {
      onUpdateStatus(complaint.id, "solved", solutionText.trim());
      setShowSolutionInput(false);
      setSolutionText("");
    }
  };

  const handleCancelSolution = () => {
    setShowSolutionInput(false);
    setSolutionText("");
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 p-5 transition-all duration-200 ${
      complaint.status === "solved" ? "border-emerald-200" : "border-slate-200"
    } hover:shadow-md`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${category.color}`}>
            {category.label}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusConfig.color}`}>
            {getStatusIcon()}
            {statusConfig.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400 text-sm">
            <Clock className="w-3 h-3" />
            <span>{timeAgo(complaint.timestamp)}</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-40 z-10">
                <button
                  onClick={() => {
                    onUpdateStatus(complaint.id, "read");
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Eye className="w-3 h-3" />
                  Mark as Read
                </button>
                <button
                  onClick={handleMarkSolved}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <CheckCircle className="w-3 h-3" />
                  Mark as Solved
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(complaint.id, "pending");
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Clock className="w-3 h-3" />
                  Reset to Pending
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-slate-700 leading-relaxed mb-4">{displayText}</p>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {showSolutionInput && (
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Add Resolution</span>
          </div>
          <textarea
            value={solutionText}
            onChange={(e) => setSolutionText(e.target.value)}
            placeholder="Describe how this issue was resolved..."
            className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-24 text-sm"
            maxLength={500}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={handleCancelSolution}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
            <button
              onClick={handleSaveSolution}
              disabled={!solutionText.trim()}
              className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1"
            >
              <Save className="w-3 h-3" />
              Save Solution
            </button>
          </div>
        </div>
      )}

      {complaint.solution && (
        <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">Resolution</span>
          </div>
          <p className="text-sm text-emerald-800 leading-relaxed">{complaint.solution}</p>
        </div>
      )}

      {complaint.allowFollowUp && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">Contact Information</p>
          <div className="space-y-2">
            {complaint.email && (
              <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{complaint.email}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(complaint.email!, "email")}
                  className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                  title="Copy email"
                >
                  {copied === "email" ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            )}
            {complaint.phone && (
              <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{complaint.phone}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(complaint.phone!, "phone")}
                  className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                  title="Copy phone"
                >
                  {copied === "phone" ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}