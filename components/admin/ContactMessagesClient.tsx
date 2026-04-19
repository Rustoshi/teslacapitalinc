"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2, X } from "lucide-react";

type Message = {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "unread" | "read";
    createdAt: string;
};

type Filter = "all" | "unread" | "read";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ContactMessagesClient({ messages }: { messages: Message[] }) {
    const router = useRouter();
    const [filter, setFilter] = useState<Filter>("all");
    const [selected, setSelected] = useState<Message | null>(null);
    const [loading, setLoading] = useState<string | null>(null);

    const filtered = messages.filter((m) => filter === "all" || m.status === filter);
    const unreadCount = messages.filter((m) => m.status === "unread").length;

    async function markRead(id: string) {
        setLoading(id);
        await fetch(`/api/admin/messages/${id}/read`, { method: "PATCH" });
        setLoading(null);
        router.refresh();
        if (selected?._id === id) setSelected((prev) => prev ? { ...prev, status: "read" } : null);
    }

    async function deleteMessage(id: string) {
        if (!confirm("Delete this message?")) return;
        setLoading(id);
        await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
        setLoading(null);
        if (selected?._id === id) setSelected(null);
        router.refresh();
    }

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1
                        className="text-xl font-black uppercase tracking-[0.06em] text-white mb-1"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                        Contact Messages
                    </h1>
                    <p className="text-xs text-white/40">{messages.length} total · {unreadCount} unread</p>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6">
                {(["all", "unread", "read"] as Filter[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-200 ${
                            filter === f
                                ? "bg-white/10 text-white"
                                : "text-white/35 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                        {f === "all" ? `All (${messages.length})` : f === "unread" ? `Unread (${unreadCount})` : `Read (${messages.length - unreadCount})`}
                    </button>
                ))}
            </div>

            {/* Layout: list + detail */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Message list */}
                <div className="lg:col-span-2 flex flex-col gap-2">
                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                            <Mail className="w-8 h-8 text-white/15 mb-3" />
                            <p className="text-xs text-white/30">No messages</p>
                        </div>
                    )}
                    {filtered.map((msg) => (
                        <button
                            key={msg._id}
                            onClick={() => {
                                setSelected(msg);
                                if (msg.status === "unread") markRead(msg._id);
                            }}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                                selected?._id === msg._id
                                    ? "bg-white/[0.06] border-white/[0.15]"
                                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <span className={`text-xs font-bold truncate ${msg.status === "unread" ? "text-white" : "text-white/60"}`}>
                                    {msg.name}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {msg.status === "unread" && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    )}
                                    <span className="text-[9px] text-white/25">{formatDate(msg.createdAt).split(",")[0]}</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/35 truncate mb-1">{msg.subject || "No subject"}</p>
                            <p className="text-[10px] text-white/25 truncate">{msg.message}</p>
                        </button>
                    ))}
                </div>

                {/* Message detail */}
                <div className="lg:col-span-3">
                    {!selected ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                            <MailOpen className="w-10 h-10 text-white/10 mb-3" />
                            <p className="text-xs text-white/25">Select a message to read</p>
                        </div>
                    ) : (
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-5">
                            {/* Detail header */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2
                                        className="text-sm font-bold text-white mb-1"
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        {selected.subject || "No subject"}
                                    </h2>
                                    <p className="text-xs text-white/40">{selected.name} · <a href={`mailto:${selected.email}`} className="text-white/50 hover:text-white transition-colors">{selected.email}</a></p>
                                    <p className="text-[10px] text-white/25 mt-1">{formatDate(selected.createdAt)}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {selected.status === "unread" && (
                                        <button
                                            onClick={() => markRead(selected._id)}
                                            disabled={loading === selected._id}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[10px] font-semibold tracking-widest uppercase text-white/50 hover:text-white hover:border-white/20 transition-all disabled:opacity-40"
                                        >
                                            <MailOpen className="w-3.5 h-3.5" /> Mark Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteMessage(selected._id)}
                                        disabled={loading === selected._id}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-semibold tracking-widest uppercase text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-40"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="p-2 rounded-lg text-white/30 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-white/[0.06]" />

                            {/* Message body */}
                            <p className="text-sm text-white/60 font-light leading-relaxed whitespace-pre-wrap">{selected.message}</p>

                            {/* Reply shortcut */}
                            <div className="mt-auto pt-2">
                                <a
                                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your enquiry")}`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white text-xs font-semibold tracking-[0.08em] uppercase hover:bg-red-500 transition-all duration-300"
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    <Mail className="w-3.5 h-3.5" /> Reply via Email
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
