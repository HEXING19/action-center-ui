import React, { useState } from 'react';
import { ActionItem, ActionStatus, Priority } from '../types';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  AlertTriangle, 
  AlertCircle,
  MessageSquare, 
  Tag, 
  ExternalLink,
  Plus
} from 'lucide-react';

interface ActionDetailDrawerProps {
  action: ActionItem | null;
  onClose: () => void;
  onUpdateAction: (updated: ActionItem) => void;
  onUrgeAction: (action: ActionItem) => void;
}

export const ActionDetailDrawer: React.FC<ActionDetailDrawerProps> = ({
  action,
  onClose,
  onUpdateAction,
  onUrgeAction,
}) => {
  if (!action) return null;

  const [status, setStatus] = useState<ActionStatus>(action.status);
  const [priority, setPriority] = useState<Priority>(action.priority);
  const [owner, setOwner] = useState(action.owner);
  const [waitingFor, setWaitingFor] = useState(action.waitingFor || '');
  const [deadline, setDeadline] = useState(action.deadline);
  const [nextFollowUp, setNextFollowUp] = useState(action.nextFollowUp);
  const [newProgressNote, setNewProgressNote] = useState('');

  const handleSaveProgress = () => {
    if (!newProgressNote.trim()) return;

    const newTimelineEntry = {
      id: `t-${Date.now()}`,
      time: '刚刚 (2026年10月10日)',
      type: 'progress' as const,
      user: '何星',
      text: `更新进展：${newProgressNote.trim()}`,
    };

    const updated: ActionItem = {
      ...action,
      status,
      priority,
      owner,
      waitingFor: waitingFor.trim() || '—',
      deadline,
      nextFollowUp,
      latestProgress: newProgressNote.trim(),
      timeline: [newTimelineEntry, ...action.timeline],
    };

    onUpdateAction(updated);
    setNewProgressNote('');
  };

  const handleQuickStatusChange = (newStatus: ActionStatus) => {
    setStatus(newStatus);
    const updated: ActionItem = {
      ...action,
      status: newStatus,
      completedAt: newStatus === '已完成' ? '2026-10-10' : undefined,
      timeline: [
        {
          id: `t-${Date.now()}`,
          time: '刚刚 (2026年10月10日)',
          type: 'status',
          user: '何星',
          text: `将状态调整为：${newStatus}`,
        },
        ...action.timeline,
      ],
    };
    onUpdateAction(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Surface */}
      <aside className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 border-l border-black/[0.08] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-700">
              {action.projectName}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Prominent Overdue / Blocked Alert Banner (Addressing User Image 4) */}
          {action.overdueDays && action.overdueDays > 0 ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 shadow-2xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-rose-950">事项已逾期 {action.overdueDays} 天</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
                      紧急处理
                    </span>
                  </div>
                  <div className="text-xs text-rose-700 font-semibold mt-1">
                    原定截止日：<span className="text-rose-950 font-mono text-sm underline decoration-rose-400 font-bold">{deadline}</span> · 请尽快跟进
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onUrgeAction(action)}
                className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>发起催办</span>
              </button>
            </div>
          ) : status === '阻塞' || action.status === '阻塞' ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 shadow-2xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-950">事项当前处于阻塞卡点</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      卡点预警
                    </span>
                  </div>
                  <div className="text-xs text-amber-800 font-semibold mt-1">
                    推进截止日：<span className="text-amber-950 font-mono text-sm underline decoration-amber-400 font-bold">{deadline}</span> · 阻塞对象：{waitingFor || '待确认'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onUrgeAction(action)}
                className="px-3.5 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>催促排阻</span>
              </button>
            </div>
          ) : null}

          {/* Section: 基础信息 */}
          <div>
            <div className="mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                基础信息
              </span>
            </div>

            <h2 className="text-base font-bold text-zinc-900 leading-snug">
              {action.title}
            </h2>

            <div className="mt-2.5 p-3 rounded-xl bg-zinc-50/80 border border-black/[0.04]">
              <p className="text-xs text-zinc-600 leading-relaxed">
                {action.description || '暂无详细任务描述'}
              </p>
            </div>
          </div>

          {/* Section: 责任人与等待对象 */}
          <div className="pt-2 border-t border-black/[0.05]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Owner / Waiting For
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-50 p-3 rounded-xl border border-black/[0.04]">
                <label className="text-[11px] text-zinc-400 block mb-1">
                  责任人 (Owner)
                </label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full text-xs font-semibold text-zinc-800 bg-white px-2 py-1.5 rounded-lg border border-black/[0.08] focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="bg-zinc-50 p-3 rounded-xl border border-black/[0.04]">
                <label className="text-[11px] text-zinc-400 block mb-1">
                  等待对象 (Waiting For)
                </label>
                <input
                  type="text"
                  value={waitingFor}
                  onChange={(e) => setWaitingFor(e.target.value)}
                  placeholder="未设置时填写 —"
                  className="w-full text-xs font-semibold text-zinc-800 bg-white px-2 py-1.5 rounded-lg border border-black/[0.08] focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* Section: 截止时间与下一跟进 (Prominent High-Visibility Styling) */}
          <div className="pt-2 border-t border-black/[0.05]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Deadline / Next Follow-up
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border transition-all ${
                action.overdueDays
                  ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-200'
                  : status === '阻塞' || action.status === '阻塞'
                  ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200'
                  : 'bg-zinc-50 border-black/[0.04]'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-[11px] font-semibold ${
                    action.overdueDays ? 'text-rose-700' : (status === '阻塞' ? 'text-amber-700' : 'text-zinc-500')
                  }`}>
                    截止时间 (Deadline)
                  </label>
                  {action.overdueDays ? (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                      逾期 {action.overdueDays} 天
                    </span>
                  ) : (status === '阻塞' || action.status === '阻塞') ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      阻塞中
                    </span>
                  ) : null}
                </div>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={`w-full text-xs font-bold px-2 py-1.5 rounded-lg border focus:outline-none transition-all ${
                    action.overdueDays
                      ? 'text-rose-900 bg-white border-rose-300 focus:border-rose-600'
                      : status === '阻塞' || action.status === '阻塞'
                      ? 'text-amber-900 bg-white border-amber-300 focus:border-amber-600'
                      : 'text-zinc-800 bg-white border-black/[0.08] focus:border-zinc-900'
                  }`}
                />
              </div>

              <div className="bg-zinc-50 p-3 rounded-xl border border-black/[0.04]">
                <label className="text-[11px] text-zinc-400 block mb-1">
                  下一跟进 (Next Follow-up)
                </label>
                <input
                  type="date"
                  value={nextFollowUp === '待确认' ? '' : nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value || '待确认')}
                  className="w-full text-xs font-medium text-zinc-800 bg-white px-2 py-1.5 rounded-lg border border-black/[0.08] focus:outline-none focus:border-zinc-900 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section: 最新进展 (Latest Progress) */}
          <div className="pt-2 border-t border-black/[0.05]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Latest Progress 最新进展
              </h3>
            </div>

            <div className="space-y-2">
              <textarea
                value={newProgressNote}
                onChange={(e) => setNewProgressNote(e.target.value)}
                placeholder="在此输入新的进展说明、结论或阻碍点..."
                className="w-full text-xs p-3 rounded-xl bg-zinc-50 border border-black/[0.08] focus:bg-white focus:outline-none focus:border-zinc-900 resize-none h-20 transition-all"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!newProgressNote.trim()}
                  onClick={handleSaveProgress}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>记录进展</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section: Source 来源 */}
          <div className="pt-2 border-t border-black/[0.05]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Source 来源
            </h3>
            <div className="flex items-center gap-2 text-xs text-zinc-700 bg-zinc-50 px-3 py-2 rounded-xl border border-black/[0.04]">
              <span className="font-semibold text-zinc-900">
                [{action.source.type}]
              </span>
              <span>{action.source.name}</span>
              {action.source.rowNumber && (
                <span className="text-zinc-400">
                  (第 {action.source.rowNumber} 行)
                </span>
              )}
            </div>
          </div>

          {/* Section: Timeline 时间轴 */}
          <div className="pt-2 border-t border-black/[0.05]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Timeline 时间轴
            </h3>

            <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
              {action.timeline.map((entry) => (
                <div key={entry.id} className="relative group">
                  <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                  <div className="text-[11px] text-zinc-400 mb-0.5 flex items-center gap-2">
                    <span className="font-medium text-zinc-600">{entry.user}</span>
                    <span>·</span>
                    <span>{entry.time}</span>
                  </div>
                  <p className="text-xs text-zinc-700 bg-zinc-50/60 p-2 rounded-lg border border-black/[0.03]">
                    {entry.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 bg-zinc-50 border-t border-black/[0.06] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onUrgeAction(action)}
            className="flex-1 py-2 px-3 rounded-full bg-white border border-black/[0.1] text-zinc-800 text-xs font-semibold hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5 text-indigo-600" />
            <span>发起催办</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickStatusChange('已完成')}
            className="flex-1 py-2 px-3 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>完成事项</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
