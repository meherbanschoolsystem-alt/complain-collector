import { useState } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { CATEGORIES } from "../constants/categories";
import { Complaint } from "../types";
import { Shield, Mail, Phone } from "lucide-react";

interface ComplaintFormProps {
  onSubmit: (complaint: Omit<Complaint, "id" | "timestamp" | "status">) => void;
}

export function ComplaintForm({ onSubmit }: ComplaintFormProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [allowFollowUp, setAllowFollowUp] = useState(false);
  const [contactMethod, setContactMethod] = useState<"email" | "phone" | "both">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = "Please describe your complaint";
    } else if (description.length > 500) {
      newErrors.description = "Description must be 500 characters or less";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    if (allowFollowUp) {
      const hasEmail = contactMethod === "email" || contactMethod === "both";
      const hasPhone = contactMethod === "phone" || contactMethod === "both";

      if (hasEmail && !email.trim()) {
        newErrors.email = "Please provide an email address";
      } else if (hasEmail && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (hasPhone && !phone.trim()) {
        newErrors.phone = "Please provide a phone number";
      } else if (hasPhone && phone && !/^[\d\s\-\+\(\)]{10,}$/.test(phone.replace(/\s/g, ""))) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      description: description.trim(),
      category,
      allowFollowUp,
      email: (contactMethod === "email" || contactMethod === "both") ? email.trim() : undefined,
      phone: (contactMethod === "phone" || contactMethod === "both") ? phone.trim() : undefined,
    });

    setDescription("");
    setCategory("");
    setAllowFollowUp(false);
    setContactMethod("email");
    setEmail("");
    setPhone("");
    setErrors({});

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">Your complaint is anonymous</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Complaint Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your issue here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`min-h-32 mt-2 ${errors.description ? "border-red-300" : ""}`}
              maxLength={500}
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <span className="text-sm text-red-600">{errors.description}</span>
              )}
              <span className={`text-sm ${description.length > 450 ? "text-amber-600" : "text-slate-400"} ml-auto`}>
                {description.length}/500
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={`mt-2 ${errors.category ? "border-red-300" : ""}`}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <span className="text-sm text-red-600 mt-1 block">{errors.category}</span>
            )}
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="followUp"
              checked={allowFollowUp}
              onChange={(e) => setAllowFollowUp(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <Label htmlFor="followUp" className="cursor-pointer">
                Allow follow-up contact
              </Label>
              <p className="text-sm text-slate-500 mt-1">
                Optional: Provide contact info if you're open to discussing this further
              </p>
            </div>
          </div>

          {allowFollowUp && (
            <div className="animate-in slide-in-from-top-2 duration-200 space-y-4">
              <div>
                <Label>Preferred Contact Method</Label>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setContactMethod("email")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      contactMethod === "email"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMethod("phone")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      contactMethod === "phone"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Phone</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMethod("both")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      contactMethod === "both"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Both</span>
                  </button>
                </div>
              </div>

              {(contactMethod === "email" || contactMethod === "both") && (
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.email ? "border-red-300" : "border-slate-300"
                    }`}
                  />
                  {errors.email && (
                    <span className="text-sm text-red-600 mt-1 block">{errors.email}</span>
                  )}
                </div>
              )}

              {(contactMethod === "phone" || contactMethod === "both") && (
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.phone ? "border-red-300" : "border-slate-300"
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-sm text-red-600 mt-1 block">{errors.phone}</span>
                  )}
                </div>
              )}
            </div>
          )}

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
            Submit Complaint
          </Button>
        </form>
      </div>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Complaint submitted successfully</span>
        </div>
      )}
    </>
  );
}