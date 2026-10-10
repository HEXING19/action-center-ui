import React, { useState } from 'react';
import { X, Sparkles, Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { ActionItem } from '../types';

interface SmartQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: ActionItem[];
  onSelectAction: (action: ActionItem) => void;
  onApplyQuery: (filtered: ActionItem[], queryText: string) => void;
}

export const SmartQueryModal: React.FC<SmartQueryModalProps> = ({
  isOpen,
  onClose,
  actions,
  onSelectAction,
  onApplyQuery,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const suggestions = [
    '已逾期的事项有哪些？',
    '王鹏 负责或等待的所有待办',
    '数智化服务平台的重点高优任务',
    '等待他人推进的事项 (Waiting For)',
    '10月12日截止的所有工作',
  ];

  const handleRunQuery = (qText: string) => {
    const q = qText.toLowerCase();
    let result = actions;

    if (q.includes('逾期')) {
      result = actions.filter((a) => !!a.overdueDays);
    } else if (q.includes('王鹏')) {
      result = actions.filter((a) => a.owner.includes('王鹏') || a.waitingFor.includes('王鹏'));
    } else if (q.includes('数智化')) {
      result = actions.filter((a) => a.projectName.includes('数智化'));
    } else if (q.includes('等待') || q.includes('waiting')) {
      result = actions.filter((a) => a.waitingFor && a.waitingFor !== '—');
    } else if (q.includes('10月12') || q.includes('10-12')) {
      result = actions.filter((a) => a.deadline.includes('10-12'));
    } else {
      result = actions.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.owner.toLowerCase().includes(q) ||
          a.projectName.toLowerCase().includes(q)
      );
    }

    onApplyQuery(result, qText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-24 p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-3xl p-5 shadow-2xl border border-black/[0.08] z-10 animate-in zoom-in-95 duration-150 space-y-4">
        {/* Search input */}
        <div className="relative flex items-center">
          <Sparkles className="w-5 h-5 text-amber-500 absolute left-3.5" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                handleRunQuery(query.trim());
              }
            }}
            placeholder="理解查询：输入任意自然语言意图，AI 自动解析语义并过滤事项..."
            className="w-full text-sm pl-11 pr-10 py-3 bg-zinc-50 border border-black/[0.08] rounded-2xl focus:bg-white focus:outline-none focus:border-zinc-900 font-medium placeholder:text-zinc-400"
          />
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 absolute right-3"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Queries */}
        <div>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2 px-1">
            推荐快捷理解意图
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRunQuery(s)}
                className="px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <span>{s}</span>
                <ArrowRight className="w-3 h-3 text-zinc-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-black/[0.05] text-[11px] text-zinc-400 px-1">
          <span>按回车执行语义检索</span>
          <span className="font-mono">ESC 退出</span>
        </div>
      </div>
    </div>
  );
};
