"use client";

import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type { EventClickArg, EventDropArg, EventInput } from "@fullcalendar/core";
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "@/actions/calendarEvents";
import type { CalendarEventRow } from "@/lib/queries/calendarEvents";

const COLOR_OPTIONS = [
  { label: "에메랄드", value: "#059669" },
  { label: "파랑", value: "#3b82f6" },
  { label: "보라", value: "#8b5cf6" },
  { label: "주황", value: "#f97316" },
  { label: "빨강", value: "#ef4444" },
  { label: "회색", value: "#6b7280" },
];

type ModalState =
  | { mode: "closed" }
  | { mode: "add"; start: string; end: string; allDay: boolean }
  | { mode: "edit"; event: CalendarEventRow };

type FormData = {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  color: string;
  description: string;
};

function toLocalDatetime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toLocalDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function CalendarClient({ initialEvents }: { initialEvents: CalendarEventRow[] }) {
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEventRow[]>(initialEvents);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    title: "", start: "", end: "", allDay: false, color: "#059669", description: "",
  });

  function openAdd(arg: DateClickArg) {
    const start = arg.allDay ? arg.dateStr + "T09:00" : toLocalDatetime(arg.date.toISOString());
    const end   = arg.allDay ? arg.dateStr + "T10:00" : toLocalDatetime(new Date(arg.date.getTime() + 3600000).toISOString());
    setForm({ title: "", start, end, allDay: arg.allDay, color: "#059669", description: "" });
    setModal({ mode: "add", start, end, allDay: arg.allDay });
    setError(null);
  }

  function openEdit(arg: EventClickArg) {
    const ev = events.find((e) => String(e.id) === arg.event.id);
    if (!ev) return;
    setForm({
      title: ev.title,
      start: ev.allDay ? toLocalDate(ev.start) : toLocalDatetime(ev.start),
      end: ev.end ? (ev.allDay ? toLocalDate(ev.end) : toLocalDatetime(ev.end)) : "",
      allDay: ev.allDay,
      color: ev.color,
      description: ev.description ?? "",
    });
    setModal({ mode: "edit", event: ev });
    setError(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const payload = {
      title: form.title,
      start: form.allDay ? form.start.slice(0, 10) : new Date(form.start).toISOString(),
      end: form.end ? (form.allDay ? form.end.slice(0, 10) : new Date(form.end).toISOString()) : undefined,
      allDay: form.allDay,
      color: form.color,
      description: form.description,
    };

    if (modal.mode === "add") {
      const res = await createCalendarEvent(payload);
      if (res.error) { setError(res.error); setSaving(false); return; }
      const newEv: CalendarEventRow = {
        id: res.id!,
        title: payload.title,
        start: payload.start,
        end: payload.end ?? null,
        allDay: payload.allDay ?? false,
        color: payload.color ?? "#059669",
        description: payload.description ?? null,
        authorName: null,
      };
      setEvents((prev) => [...prev, newEv]);
    } else if (modal.mode === "edit") {
      const res = await updateCalendarEvent(modal.event.id, payload);
      if (res.error) { setError(res.error); setSaving(false); return; }
      setEvents((prev) =>
        prev.map((e) => e.id === modal.event.id
          ? { ...e, ...payload, end: payload.end ?? null, description: payload.description ?? null }
          : e
        )
      );
    }
    setSaving(false);
    setModal({ mode: "closed" });
  }

  async function handleDelete() {
    if (modal.mode !== "edit") return;
    if (!confirm("이 일정을 삭제할까요?")) return;
    setSaving(true);
    const res = await deleteCalendarEvent(modal.event.id);
    if (res.error) { setError(res.error); setSaving(false); return; }
    setEvents((prev) => prev.filter((e) => e.id !== modal.event.id));
    setSaving(false);
    setModal({ mode: "closed" });
  }

  const fcEvents: EventInput[] = events.map((e) => ({
    id: String(e.id),
    title: e.title,
    start: e.start,
    end: e.end ?? undefined,
    allDay: e.allDay,
    backgroundColor: e.color,
    borderColor: e.color,
    extendedProps: { description: e.description, authorName: e.authorName },
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">연구실 일정</h1>
        <p className="text-sm text-gray-500 mt-1">날짜를 클릭하면 일정을 추가할 수 있습니다</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listMonth",
          }}
          buttonText={{ today: "오늘", month: "월", week: "주", list: "목록" }}
          events={fcEvents}
          editable={false}
          selectable={false}
          dateClick={openAdd}
          eventClick={openEdit}
          height="auto"
          eventDisplay="block"
          dayMaxEvents={3}
        />
      </div>

      {/* Modal */}
      {modal.mode !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              {modal.mode === "add" ? "일정 추가" : "일정 수정"}
            </h2>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">제목 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="일정 제목"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="allDay"
                  type="checkbox"
                  checked={form.allDay}
                  onChange={(e) => setForm((f) => ({ ...f, allDay: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                />
                <label htmlFor="allDay" className="text-sm text-gray-600">하루 종일</label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">시작</label>
                  <input
                    type={form.allDay ? "date" : "datetime-local"}
                    value={form.start}
                    onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">종료</label>
                  <input
                    type={form.allDay ? "date" : "datetime-local"}
                    value={form.end}
                    onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">색상</label>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.label}
                      onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                      className={`w-7 h-7 rounded-full transition-transform ${form.color === c.value ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : ""}`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">메모</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="추가 설명 (선택)"
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <div>
                {modal.mode === "edit" && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    삭제
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModal({ mode: "closed" })}
                  className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
