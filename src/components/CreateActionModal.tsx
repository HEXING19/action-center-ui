import React, { useState } from 'react';
import { ActionItem, Project, Priority, CardColorTheme } from '../types';
import { X, Plus, Sparkles, Check, ChevronDown } from 'lucide-react';

interface CreateActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onCreate: (action: ActionItem) => void;
}

export const CreateActionModal: React.FC<CreateActionModalProps> = ({
  isOpen,
  onClose,
  projects,
  onCreate,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [owner, setOwner] = useState('待确认');
  const [waitingFor, setWaitingFor] = useState('—');
  const [priority, setPriority] = useState<Priority>('HIGH');
  const [deadline, setDeadline] = useState('2026-10-12');
  const [colorTheme, setColorTheme] = useState<CardColorTheme>('indigo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const currentProject = projects.find((p) => p.id === projectId) || projects[0];
    const newIdNum = Math.floor(Math.random() * 900) + 50;

    const newAction: ActionItem = {
      id: `AC-0000${newIdNum}`,
      code: String(newIdNum),
      title: title.trim(),
      description: description.trim(),
      projectId: currentProject.id,
      projectName: currentProject.name,
      owner: owner.trim() || '待确认',
      waitingFor: waitingFor.trim() || '—',
      status: '进行中',
      priority,
      deadline,
      nextFollowUp: '待确认',
      source: {
        type: '临时事项',
        name: '手动快速创建',
      },
      latestProgress: '刚刚创建',
      colorTheme,
      participantsCount: 1,
      timeline: [
        {
          id: `t-${Date.now()}`,
          time: '刚刚 (2026年10月10日)',
          type: 'create',
          user: '何星',
          text: `创建了新事项：${title.trim()}`,
        },
      ],
    };

    onCreate(newAction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-black/[0.08] z-10 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                新建 Action 事项
              </h3>
              <p className="text-[11px] text-zinc-400">
                登记新的推进目标并纳入行动看板
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="my-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              事项描述 / Action 标题 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如: 推进知识同步问题排查与技术对齐..."
              className="w-full text-xs font-semibold text-zinc-900 bg-white border border-black/[0.1] rounded-xl px-3 py-2.5 focus:outline-none focus:border-zinc-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              详细要求 / 交付标准
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="说明验收目标、无法解决Case的复盘以及需要拉齐的干系人..."
              className="w-full text-xs p-3 rounded-2xl bg-zinc-50 border border-black/[0.08] focus:bg-white focus:outline-none focus:border-zinc-900 resize-none h-20 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                所属专项 (Project)
              </label>
              <div className="relative flex items-center">
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full appearance-none text-xs font-medium text-zinc-800 bg-white hover:bg-zinc-50 border border-black/[0.1] hover:border-black/20 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-zinc-900 shadow-2xs cursor-pointer transition-all"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                优先级 (Priority)
              </label>
              <div className="relative flex items-center">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full appearance-none text-xs font-medium text-zinc-800 bg-white hover:bg-zinc-50 border border-black/[0.1] hover:border-black/20 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-zinc-900 shadow-2xs cursor-pointer transition-all"
                >
                  <option value="URGENT">加急 (URGENT)</option>
                  <option value="HIGH">高 (HIGH)</option>
                  <option value="NORMAL">中 (NORMAL)</option>
                  <option value="LOW">低 (LOW)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                责任人 (Owner)
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="例如: 待确认 或 段孝义"
                className="w-full text-xs font-medium text-zinc-800 bg-white border border-black/[0.1] rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                等待对象 (Waiting For)
              </label>
              <input
                type="text"
                value={waitingFor}
                onChange={(e) => setWaitingFor(e.target.value)}
                placeholder="例如: — 或 王鹏"
                className="w-full text-xs font-medium text-zinc-800 bg-white border border-black/[0.1] rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-900 shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                截止时间 (Deadline)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs font-medium text-zinc-800 bg-white border border-black/[0.1] rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                卡片配色 (Pastel Theme)
              </label>
              <div className="flex items-center gap-2 pt-1">
                {(['indigo', 'amber', 'rose', 'emerald', 'cyan'] as CardColorTheme[]).map((theme) => {
                  const colors: Record<CardColorTheme, string> = {
                    indigo: 'bg-indigo-300',
                    amber: 'bg-amber-300',
                    rose: 'bg-rose-300',
                    emerald: 'bg-emerald-300',
                    cyan: 'bg-teal-300',
                    purple: 'bg-purple-300',
                  };
                  return (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => setColorTheme(theme)}
                      className={`w-6 h-6 rounded-full ${colors[theme]} flex items-center justify-center transition-all ${
                        colorTheme === theme ? 'ring-2 ring-zinc-900 ring-offset-2' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {colorTheme === theme && <Check className="w-3 h-3 text-zinc-900" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-black/[0.1] text-zinc-700 text-xs font-medium hover:bg-zinc-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
            >
              创建事项
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
