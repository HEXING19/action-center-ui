import React from 'react';
import { ActionItem } from '../types';
import { Send, CheckCircle2, MoreHorizontal, ArrowRight, AlertCircle, AlertTriangle } from 'lucide-react';

interface ActionTableProps {
  actions: ActionItem[];
  selectedIds: string[];
  showId?: boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSelectAction: (action: ActionItem) => void;
  onUrgeAction?: (action: ActionItem) => void;
  onCompleteAction?: (action: ActionItem) => void;
}

export const ActionTable: React.FC<ActionTableProps> = ({
  actions,
  selectedIds,
  showId = false,
  onToggleSelect,
  onToggleSelectAll,
  onSelectAction,
  onUrgeAction,
  onCompleteAction,
}) => {
  const isAllSelected = actions.length > 0 && selectedIds.length === actions.length;

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-zinc-50/75 border-b border-black/[0.06] text-zinc-500 font-medium">
            <th className="py-3 px-3.5 w-10 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onToggleSelectAll}
                className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer accent-zinc-900"
              />
            </th>
            {showId && (
              <th className="py-3 px-3 font-semibold text-zinc-700 w-28">ID</th>
            )}
            <th className="py-3 px-3 font-semibold text-zinc-700 min-w-[280px]">Action 事项</th>
            <th className="py-3 px-3 font-semibold text-zinc-700 w-36">Project 专项</th>
            <th className="py-3 px-3 font-semibold text-zinc-700 w-28">Owner 责任人</th>
            <th className="py-3 px-3 font-semibold text-zinc-700 w-28">Waiting For</th>
            <th className="py-3 px-3 font-semibold text-zinc-700 w-24">Status 状态</th>
            <th className="py-3 px-3 font-semibold text-zinc-700 w-28">Deadline 截止</th>
            <th className="py-3 px-3 font-semibold text-zinc-700 w-28">下一跟进</th>
            <th className="py-3 px-3 font-semibold text-zinc-700 w-20 text-right pr-4">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.04] text-zinc-700">
          {actions.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isOverdue = !!item.overdueDays;

            return (
              <tr
                key={item.id}
                onClick={() => onSelectAction(item)}
                className={`group cursor-pointer transition-colors duration-150 ${
                  isSelected ? 'bg-indigo-50/40' : 'hover:bg-zinc-50/80'
                }`}
              >
                {/* Checkbox */}
                <td 
                  className="py-3 px-3.5 text-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(item.id);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(item.id)}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer accent-zinc-900"
                  />
                </td>

                {/* ID (default hidden) */}
                {showId && (
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-500 font-medium whitespace-nowrap">
                    {item.id}
                  </td>
                )}

                {/* Title + Overdue badge */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </span>
                    {isOverdue && (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                        逾期 {item.overdueDays} 天
                      </span>
                    )}
                  </div>
                </td>

                {/* Project */}
                <td className="py-3 px-3 text-zinc-600 truncate max-w-[150px]">
                  {item.projectName}
                </td>

                {/* Owner */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                    item.owner === '待确认' ? 'bg-amber-50 text-amber-700' : 'bg-zinc-100 text-zinc-700'
                  }`}>
                    {item.owner}
                  </span>
                </td>

                {/* Waiting For */}
                <td className="py-3 px-3 whitespace-nowrap text-zinc-500">
                  {item.waitingFor && item.waitingFor !== '—' ? (
                    <span className="text-amber-700 font-medium">
                      {item.waitingFor}
                    </span>
                  ) : (
                    <span className="text-zinc-300">—</span>
                  )}
                </td>

                {/* Status */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    item.status === '已完成'
                      ? 'bg-emerald-50 text-emerald-700'
                      : item.status === '进行中'
                      ? 'bg-blue-50 text-blue-700'
                      : item.status === '阻塞'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      item.status === '已完成' ? 'bg-emerald-500' :
                      item.status === '进行中' ? 'bg-blue-500' :
                      item.status === '阻塞' ? 'bg-rose-500' : 'bg-zinc-400'
                    }`} />
                    {item.status}
                  </span>
                </td>

                {/* Deadline */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {isOverdue ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 shadow-3xs">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      逾期 {item.overdueDays}天 · {item.deadline}
                    </span>
                  ) : item.status === '阻塞' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-3xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      阻塞 · {item.deadline}
                    </span>
                  ) : (
                    <span className="text-zinc-600 tabular-nums font-mono text-xs font-medium">
                      {item.deadline}
                    </span>
                  )}
                </td>

                {/* Next follow-up */}
                <td className="py-3 px-3 whitespace-nowrap text-zinc-500 tabular-nums">
                  {item.nextFollowUp}
                </td>

                {/* Row Quick Action */}
                <td className="py-3 px-3 text-right pr-4 whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    {onUrgeAction && (
                      <button
                        type="button"
                        onClick={() => onUrgeAction(item)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                        title="发起催办"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectAction(item)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                      title="查看详情"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
