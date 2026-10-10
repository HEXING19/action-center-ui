import React from 'react';
import { ActionItem } from '../types';
import { 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  MoreHorizontal, 
  ArrowUpRight,
  Send,
  Calendar,
  Sparkles
} from 'lucide-react';

interface ActionCardPastelProps {
  action: ActionItem;
  onClick: (action: ActionItem) => void;
  onUrge?: (action: ActionItem) => void;
  onComplete?: (action: ActionItem) => void;
}

export const ActionCardPastel: React.FC<ActionCardPastelProps> = ({
  action,
  onClick,
  onUrge,
  onComplete,
}) => {
  // Color palette styles corresponding to Image 8
  const themeStyles = {
    indigo: {
      outer: 'bg-[#EEF2FF] border-[#E0E7FF] text-indigo-950',
      badge: 'bg-white text-indigo-900 border-indigo-100',
      tag: 'bg-indigo-100/80 text-indigo-800',
      borderAccent: 'hover:border-indigo-300',
    },
    amber: {
      outer: 'bg-[#FFFBEB] border-[#FEF3C7] text-amber-950',
      badge: 'bg-white text-amber-900 border-amber-100',
      tag: 'bg-amber-100/80 text-amber-800',
      borderAccent: 'hover:border-amber-300',
    },
    rose: {
      outer: 'bg-[#FFF1F2] border-[#FFE4E6] text-rose-950',
      badge: 'bg-white text-rose-900 border-rose-100',
      tag: 'bg-rose-100/80 text-rose-800',
      borderAccent: 'hover:border-rose-300',
    },
    emerald: {
      outer: 'bg-[#ECFDF5] border-[#D1FAE5] text-emerald-950',
      badge: 'bg-white text-emerald-900 border-emerald-100',
      tag: 'bg-emerald-100/80 text-emerald-800',
      borderAccent: 'hover:border-emerald-300',
    },
    cyan: {
      outer: 'bg-[#F0FDFA] border-[#CCFBF1] text-teal-950',
      badge: 'bg-white text-teal-900 border-teal-100',
      tag: 'bg-teal-100/80 text-teal-800',
      borderAccent: 'hover:border-teal-300',
    },
    purple: {
      outer: 'bg-[#FAF5FF] border-[#F3E8FF] text-purple-950',
      badge: 'bg-white text-purple-900 border-purple-100',
      tag: 'bg-purple-100/80 text-purple-800',
      borderAccent: 'hover:border-purple-300',
    },
  };

  const theme = themeStyles[action.colorTheme || 'indigo'];
  const isOverdue = !!action.overdueDays;
  const isBlocked = action.status === '阻塞';

  return (
    <div
      onClick={() => onClick(action)}
      className={`group relative rounded-[20px] border p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${theme.outer} ${theme.borderAccent}`}
    >
      {/* Top Header Row in Pastel Container */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 truncate">
          <span className="text-xs font-semibold text-zinc-800 truncate block">
            {action.projectName}
          </span>
        </div>

        {/* High-Contrast Deadline / Overdue / Blocked Badge (Addressing User Image 4) */}
        {isOverdue ? (
          <div 
            className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs shrink-0 animate-pulse"
            title={`已逾期 ${action.overdueDays} 天 (截止日: ${action.deadline})`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-100" />
            <span>逾期 {action.overdueDays}天 · {action.deadline.replace('2026-', '')}</span>
          </div>
        ) : isBlocked ? (
          <div 
            className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs shrink-0"
            title={`此事项当前处于阻塞卡点状态 (截止日: ${action.deadline})`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-100" />
            <span>阻塞卡点 · {action.deadline.replace('2026-', '')}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/90 text-zinc-700 border border-black/[0.08] shadow-3xs shrink-0">
            <Calendar className="w-3 h-3 text-zinc-400" />
            <span>{action.deadline.replace('2026-', '')}</span>
          </div>
        )}
      </div>

      {/* Inner White Floating Inset Card (the Image 8 signature design) */}
      <div className="bg-white rounded-xl p-3 border border-black/[0.04] shadow-2xs space-y-2 group-hover:border-black/[0.08] transition-colors">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[13px] font-semibold text-zinc-900 leading-snug line-clamp-2">
            {action.title}
          </h4>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-600 transition-colors shrink-0 mt-0.5" />
        </div>

        {action.description && (
          <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
            {action.description}
          </p>
        )}

        {/* Owner & Waiting For row */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-400 border-t border-black/[0.03]">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-zinc-400">责任:</span>
            <span className="font-medium text-zinc-700 truncate">
              {action.owner}
            </span>
          </div>
          {action.waitingFor && action.waitingFor !== '—' && (
            <div className="flex items-center gap-1 truncate text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
              <span>等:</span>
              <span className="font-medium truncate">{action.waitingFor}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Tag & Quick Action Row */}
      <div className="mt-2.5 flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Status pill (Default 进行中 / 阻塞 / 已完成) */}
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            action.status === '已完成'
              ? 'bg-emerald-100 text-emerald-800'
              : action.status === '阻塞'
              ? 'bg-amber-100 text-amber-900 border border-amber-200'
              : 'bg-blue-100 text-blue-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              action.status === '已完成' ? 'bg-emerald-600' :
              action.status === '阻塞' ? 'bg-amber-600' : 'bg-blue-600'
            }`} />
            {action.status}
          </span>

          {/* Overdue alert badge if any */}
          {isOverdue && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
              逾期 {action.overdueDays} 天
            </span>
          )}

          {/* Participant / source badge */}
          {action.participantsCount && (
            <span className="text-[10px] text-zinc-500 font-medium px-1.5 py-0.5 rounded-md bg-white/70">
              👥 {action.participantsCount}
            </span>
          )}
        </div>

        {/* Quick Urge or Action trigger */}
        <div className="flex items-center gap-1">
          {onUrge && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUrge(action);
              }}
              className="p-1 rounded-lg bg-white/80 hover:bg-white text-zinc-500 hover:text-zinc-900 transition-colors shadow-2xs text-[11px] flex items-center gap-1 px-1.5"
              title="一键催办"
            >
              <Send className="w-3 h-3 text-zinc-600" />
              <span className="hidden group-hover:inline text-[10px] font-medium">催办</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick(action);
            }}
            className="p-1 rounded-lg bg-white/80 hover:bg-white text-zinc-400 hover:text-zinc-800 transition-colors shadow-2xs"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
