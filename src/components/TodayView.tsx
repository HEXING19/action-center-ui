import React, { useState } from 'react';
import { ActionItem, UrgeRecord } from '../types';
import { ActionCardPastel } from './ActionCardPastel';
import { ActionTable } from './ActionTable';
import { 
  Sparkles, 
  RefreshCw, 
  Send, 
  Inbox as InboxIcon, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Ban,
  CheckCircle2,
  ChevronDown,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';

interface TodayViewProps {
  actions: ActionItem[];
  urgeRecords: UrgeRecord[];
  onSelectAction: (action: ActionItem) => void;
  onUrgeAction: (action: ActionItem) => void;
  onOpenBatchUrge: (actions: ActionItem[]) => void;
  onGenerateBrief: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  actions,
  urgeRecords,
  onSelectAction,
  onUrgeAction,
  onOpenBatchUrge,
  onGenerateBrief,
}) => {
  const [targetFilter, setTargetFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showId, setShowId] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Metrics
  const todayFollowUpList = actions.filter((a) => {
    if (a.status === '已完成' || a.status === '已取消') return false;
    if (targetFilter !== 'all') {
      if (a.owner !== targetFilter && a.waitingFor !== targetFilter) return false;
    }
    // Items that have a follow-up or deadline soon or overdue
    return a.nextFollowUp === '2026-10-10' || a.deadline === '2026-10-10' || a.overdueDays;
  });

  const dueSoonCount = actions.filter((a) => a.deadline === '2026-10-12' && a.status !== '已完成').length;
  const overdueCount = actions.filter((a) => !!a.overdueDays && a.status !== '已完成').length;
  const blockedCount = actions.filter((a) => a.status === '阻塞').length;
  const todayDueCount = todayFollowUpList.length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === todayFollowUpList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(todayFollowUpList.map((a) => a.id));
    }
  };

  const selectedActions = todayFollowUpList.filter((a) => selectedIds.includes(a.id));

  return (
    <div className="space-y-6">
      {/* Page Title & Date Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Today
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            今天真正需要你推动的事情
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 tabular-nums">
            2026/10/10
          </span>
          <button
            type="button"
            onClick={onGenerateBrief}
            className="px-3.5 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>生成今日 Brief</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards directly styled with Image 8 soft aesthetic */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-indigo-100 bg-[#EEF2FF]/60 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-900/70 text-xs font-semibold mb-2">
            <span>今日跟进</span>
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-950 font-mono tabular-nums">
            {todayDueCount}
          </div>
          <p className="text-[10px] text-indigo-600/80 mt-1">
            包含需确认及今日节点
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-[#FFFBEB]/70 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-amber-900/70 text-xs font-semibold mb-2">
            <span>即将到期</span>
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-950 font-mono tabular-nums">
            {dueSoonCount}
          </div>
          <p className="text-[10px] text-amber-600/80 mt-1">
            48 小时内截止交付
          </p>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-[#FFF1F2]/70 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-rose-900/70 text-xs font-semibold mb-2">
            <span>已逾期</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-950 font-mono tabular-nums">
            {overdueCount}
          </div>
          <p className="text-[10px] text-rose-600/80 mt-1">
            已超过既定截止时间
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold mb-2">
            <span>阻塞</span>
            <Ban className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-800 font-mono tabular-nums">
            {blockedCount}
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">
            依赖外部或卡点排查中
          </p>
        </div>
      </div>

      {/* Main Section: 今日跟进 */}
      <div className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-2xs space-y-4">
        {/* Section Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-black/[0.04]">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-zinc-900">
              今日跟进
            </h3>
            <span className="text-xs text-zinc-400">
              优先跟进 Waiting For，未设置时跟进 Owner。选择同一人的事项可合并催办。
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-full">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-full transition-all ${
                  viewMode === 'cards' ? 'bg-white shadow-2xs text-zinc-900' : 'text-zinc-400 hover:text-zinc-700'
                }`}
                title="Bento 卡片视图"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-full transition-all ${
                  viewMode === 'table' ? 'bg-white shadow-2xs text-zinc-900' : 'text-zinc-400 hover:text-zinc-700'
                }`}
                title="表格清单视图"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Optional ID Toggle (Default Hidden) */}
            {viewMode === 'table' && (
              <button
                type="button"
                onClick={() => setShowId(!showId)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  showId
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-500 border-black/[0.08] hover:border-black/20 hover:text-zinc-800'
                }`}
                title="默认不展示 ID，点击可开启/关闭"
              >
                <span>{showId ? '已显示 ID' : '显示 ID'}</span>
              </button>
            )}

            {/* Target Filter Dropdown - Styled Pill matching button design */}
            <div className="relative inline-flex items-center">
              <select
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-1.5 h-8 text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 border border-black/[0.08] hover:border-black/20 rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer shadow-2xs transition-all"
              >
                <option value="all">所有跟进对象</option>
                <option value="待确认">待确认 (未指派)</option>
                <option value="王鹏">王鹏</option>
                <option value="段孝义">段孝义</option>
                <option value="郑毅">郑毅</option>
                <option value="黄祥红">黄祥红</option>
                <option value="李毅豪">李毅豪</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
            </div>

            {/* Batch Urge Button */}
            <button
              type="button"
              disabled={selectedActions.length === 0}
              onClick={() => onOpenBatchUrge(selectedActions)}
              className="px-3.5 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Send className="w-3 h-3 text-indigo-300" />
              <span>合并催办 ({selectedActions.length})</span>
            </button>
          </div>
        </div>

        {/* Content list or Empty state */}
        {todayFollowUpList.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-center text-zinc-300 mx-auto mb-3">
              <InboxIcon className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium text-zinc-500">
              暂无符合条件的今日跟进事项
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              所有紧急事项已闭环或已安排在其他日期
            </p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {todayFollowUpList.map((item) => (
              <ActionCardPastel
                key={item.id}
                action={item}
                onClick={onSelectAction}
                onUrge={onUrgeAction}
              />
            ))}
          </div>
        ) : (
          <ActionTable
            actions={todayFollowUpList}
            selectedIds={selectedIds}
            showId={showId}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onSelectAction={onSelectAction}
            onUrgeAction={onUrgeAction}
          />
        )}
      </div>

      {/* Reminders & Today Brief Section */}
      <div className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
          <h3 className="text-sm font-bold text-zinc-900">
            提醒与今日摘要
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded-full border border-black/[0.08] text-zinc-700 text-xs font-medium hover:bg-zinc-50 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 text-zinc-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>刷新提醒</span>
            </button>
            <button
              type="button"
              onClick={onGenerateBrief}
              className="px-3.5 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>生成今日 Brief</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-zinc-500 pt-3">
          暂无已触发提醒。今日跟进与异常视图会实时计算；刷新提醒可立即扫描风险事项。
        </p>
      </div>

      {/* Recent Urge Records Section */}
      <div className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.04]">
          <h3 className="text-sm font-bold text-zinc-900">
            最近催办记录
          </h3>
          <span className="text-[11px] text-zinc-400">
            确认发送后，催办消息和对应序号会保存在事项历史中。
          </span>
        </div>

        {urgeRecords.length === 0 ? (
          <p className="text-xs text-zinc-400 py-3">暂无催办发送记录</p>
        ) : (
          <div className="space-y-2">
            {urgeRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-2xl bg-zinc-50 border border-black/[0.04] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900">
                      跟进对象: {rec.recipient}
                    </span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      {rec.channel}
                    </span>
                  </div>
                  <span className="text-zinc-400 text-[11px]">{rec.timestamp}</span>
                </div>
                <p className="text-zinc-600 bg-white p-2.5 rounded-xl border border-black/[0.03] text-[11px] leading-relaxed">
                  {rec.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
