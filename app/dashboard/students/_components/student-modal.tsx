"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertCircle, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentModalProps {
    student?: any; // If provided, mode is "edit", otherwise "add"
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string | null, data: any) => Promise<void>;
}

export default function StudentModal({ student, isOpen, onClose, onSave }: StudentModalProps) {
    const isEdit = !!student;
    const [formData, setFormData] = useState<any>({
        cr69d_title: "",
        cr69d_gender: "",
        cr69d_guardianname: "",
        cr69d_guardianwhatsapp: "",
        cr69d_guardianphone: "",
        cr69d_emailaddress: "",
        cr69d_address: "",
        cr69d_studentid: "",
        cr69d_level: "",
        cr69d_age: "",
        ...student
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (student) {
            setFormData(student);
        } else {
            // Reset for "Add" mode
            setFormData({
                cr69d_title: "",
                cr69d_gender: "",
                cr69d_guardianname: "",
                cr69d_guardianwhatsapp: "",
                cr69d_guardianphone: "",
                cr69d_emailaddress: "",
                cr69d_address: "",
                cr69d_studentid: "",
                cr69d_level: "",
                cr69d_age: "",
            });
        }
    }, [student, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            // Validation
            if (!formData.cr69d_title) throw new Error("Student name is required");
            if (!formData.cr69d_studentid) throw new Error("Student ID is required");
            if (!formData.cr69d_level) throw new Error("Level is required");

            await onSave(isEdit ? student.cr69d_studentid : null, formData);
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to save student record");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--primary-light)] text-[var(--primary)] rounded-xl">
                            {isEdit ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground tracking-tight">
                                {isEdit ? "Update Student Info" : "Add New Student"}
                            </h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                                {isEdit ? `Editing ${student.cr69d_title}` : "Add a student to the school records"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-foreground bg-[var(--background)] rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField 
                            label="Student Full Name *" 
                            placeholder="Full name of student"
                            value={formData.cr69d_title} 
                            onChange={(v) => setFormData({...formData, cr69d_title: v})} 
                        />
                        <FormField 
                            label="Student ID *" 
                            placeholder="LSA-000"
                            value={formData.cr69d_studentid} 
                            onChange={(v) => setFormData({...formData, cr69d_studentid: v})}
                            disabled={isEdit}
                        />
                        <FormField 
                            label="Class/Grade *" 
                            placeholder="e.g. Primary 1 or Grade 1"
                            value={formData.cr69d_level} 
                            onChange={(v) => setFormData({...formData, cr69d_level: v})} 
                        />
                         <FormField 
                            label="Parent/Guardian Name" 
                            placeholder="Father or Mother's name"
                            value={formData.cr69d_guardianname} 
                            onChange={(v) => setFormData({...formData, cr69d_guardianname: v})} 
                        />
                        <FormField 
                            label="Email Address" 
                            placeholder="email@example.com"
                            value={formData.cr69d_emailaddress} 
                            onChange={(v) => setFormData({...formData, cr69d_emailaddress: v})} 
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField 
                                label="Gender" 
                                placeholder="Male/Female"
                                value={formData.cr69d_gender} 
                                onChange={(v) => setFormData({...formData, cr69d_gender: v})} 
                            />
                            <FormField 
                                label="Age" 
                                placeholder="10"
                                value={formData.cr69d_age} 
                                onChange={(v) => setFormData({...formData, cr69d_age: v})} 
                            />
                        </div>
                        <FormField 
                            label="Parent's WhatsApp" 
                            placeholder="WhatsApp Number"
                            value={formData.cr69d_guardianwhatsapp} 
                            onChange={(v) => setFormData({...formData, cr69d_guardianwhatsapp: v})} 
                        />
                        <FormField 
                            label="Parent's Phone" 
                            placeholder="Phone Number"
                            value={formData.cr69d_guardianphone} 
                            onChange={(v) => setFormData({...formData, cr69d_guardianphone: v})} 
                        />
                        
                         <div className="md:col-span-2">
                            <FormField 
                                label="Home Address" 
                                placeholder="123 Street Name, City"
                                value={formData.cr69d_address} 
                                onChange={(v) => setFormData({...formData, cr69d_address: v})} 
                                isTextArea
                            />
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-[var(--border-color)] bg-[var(--background)] flex items-center justify-end gap-3 shrink-0">
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="h-11 px-6 text-sm font-bold text-slate-500 hover:text-foreground transition-colors"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="h-11 px-8 bg-[var(--primary)] text-white text-sm font-black rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/20 active:scale-[0.98] flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                                {isEdit ? "Updating..." : "Adding..."}
                            </>
                        ) : (
                            <>
                                {isEdit ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                {isEdit ? "Save Changes" : "Add Student"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, placeholder, value, onChange, isTextArea = false, disabled = false }: { 
    label: string, 
    placeholder?: string,
    value: string, 
    onChange: (v: string) => void,
    isTextArea?: boolean,
    disabled?: boolean
}) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            {isTextArea ? (
                <textarea
                    value={value || ""}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="w-full min-h-[100px] p-3 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none bg-[var(--background)] transition-all text-sm font-bold text-foreground placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
            ) : (
                <input
                    type="text"
                    value={value || ""}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="w-full h-12 px-4 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none bg-[var(--background)] transition-all text-sm font-bold text-foreground placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
            )}
        </div>
    );
}
