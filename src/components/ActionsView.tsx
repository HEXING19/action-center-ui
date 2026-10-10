import React, { useState } from 'react';
import { ActionItem, Project, ActionStatus } from '../types';
import { ActionCardPastel } from './ActionCardPastel';
import { ActionTable } from './ActionTable';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  LayoutGrid, 
  Table as TableIcon, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Calendar,
  Layers
} from 'lucide-react';

interface ActionsViewProps {
  actions: ActionItem[];
  projects: Project[];
  quickFilter?: string | null;
  onSelectAction: (action: ActionItem) => void;
  onUrgeAction: (action: ActionItem) => void;
  onOpenCreateModal: () => void;
  onOpenBatchUrge: (actions: ActionItem[]) => void;
  onBatchComplete: (ids: string[]) => void;
}

export const ActionsView: React.FC<ActionsViewProps> = ({
  actions,
  projects,
  quickFilter,
  onSelectAction,
  onUrgeAction,
  onOpenCreateModal,
  onOpenBatchUrge,
  onBatchComplete,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showId, setShowId] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [waitingFilter, setWaitingFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<string>('');

  // Pill Status tabs (inspired by Image 8 month capsule selector)
  const statusTabs = [
    { id: 'all', label: '全部事项' },
    { id: '进行中', label: '进行中' },
    { id: '阻塞', label: '阻塞' },
    { id: 'overdue', label: '已逾期' },
    { id: '已完成', label: '已完成' },
  ];

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setProjectFilter('all');
    setOwnerFilter('all');
    setWaitingFilter('all');
    setRiskFilter('all');
    setDeadlineFilter('');
  };

  // Filter logic
  const filteredActions = actions.filter((item) => {
    // Quick filter from sidebar if active
    if (quickFilter === 'overdue' && !item.overdueDays) return false;
    if (quickFilter === 'waiting' && (!item.waitingFor || item.waitingFor === '—')) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q) ||
        item.waitingFor.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Status pill
    if (statusFilter === 'overdue') {
      if (!item.overdueDays) return false;
    } else if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    // Project
    if (projectFilter !== 'all' && item.projectId !== projectFilter) {
      return false;
    }

    // Owner
    if (ownerFilter !== 'all' && item.owner !== ownerFilter) {
      return false;
    }

    // Waiting For
    if (waitingFilter !== 'all' && item.waitingFor !== waitingFilter) {
      return false;
    }

    // Risk
    if (riskFilter === 'overdue' && !item.overdueDays) return false;
    if (riskFilter === 'blocked' && item.status !== '阻塞') return false;

    // Deadline before
    if (deadlineFilter && item.deadline > deadlineFilter) {
      return false;
    }

    return true;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredActions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredActions.map((a) => a.id));
    }
  };

  const selectedActions = filteredActions.filter((a) => selectedIds.includes(a.id));

  // Unique owners and waitingFor for dropdowns
  const allOwners = Array.from(new Set(actions.map((a) => a.owner))).filter(Boolean);
  const allWaiting = Array.from(new Set(actions.map((a) => a.waitingFor))).filter((w) => w && w !== '—');

  return (
    <div className="space-y-5">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Actions
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            所有事情，现在是什么状态
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-full border border-black/[0.04]">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 px-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'cards'
                  ? 'bg-white shadow-2xs text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>卡片</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 px-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white shadow-2xs text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>表格</span>
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

          {/* New Action Button */}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ 新建 Action</span>
          </button>
        </div>
      </div>

      {/* Image 8 Style Pill Status Carousel / Filter Bar */}
      <div className="flex items-center justify-between bg-zinc-100/70 p-1.5 rounded-2xl border border-black/[0.04] overflow-x-auto">
        <div className="flex items-center gap-1">
          <button 
            type="button" 
            className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-zinc-400 hover:text-zinc-800 shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          <button 
            type="button" 
            className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-zinc-400 hover:text-zinc-800 shadow-2xs"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-[11px] text-zinc-400 px-3">
          <span>共 {filteredActions.length} 项</span>
        </div>
      </div>

      {/* Unified Single-Row Filter Toolbar (matching pill button design) */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-2.5 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索事项、进展和来源..."
              className="w-full text-xs pl-9 pr-3 py-1.5 h-8 bg-zinc-50 border border-black/[0.08] rounded-full focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
            />
          </div>

          {/* Project Dropdown Pill */}
          <div className="relative inline-flex items-center">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-7 py-1.5 h-8 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-black/[0.08] hover:border-black/20 rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer shadow-2xs transition-all"
            >
              <option value="all">Project · 全部</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Owner Dropdown Pill */}
          <div className="relative inline-flex items-center">
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-7 py-1.5 h-8 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-black/[0.08] hover:border-black/20 rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer shadow-2xs transition-all"
            >
              <option value="all">Owner · 全部</option>
              {allOwners.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Waiting For Dropdown Pill */}
          <div className="relative inline-flex items-center">
            <select
              value={waitingFilter}
              onChange={(e) => setWaitingFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-7 py-1.5 h-8 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-black/[0.08] hover:border-black/20 rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer shadow-2xs transition-all"
            >
              <option value="all">Waiting For · 全部</option>
              {allWaiting.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Risk Dropdown Pill */}
          <div className="relative inline-flex items-center">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-7 py-1.5 h-8 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-black/[0.08] hover:border-black/20 rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer shadow-2xs transition-all"
            >
              <option value="all">Risk · 全部</option>
              <option value="overdue">逾期风险</option>
              <option value="blocked">阻塞卡点</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Deadline Filter Pill (Integrated in same row) */}
          <div className="relative inline-flex items-center bg-white border border-black/[0.08] hover:border-black/20 rounded-full h-8 pl-3 pr-2.5 shadow-2xs transition-all">
            <span className="text-[11px] text-zinc-400 mr-1.5 whitespace-nowrap">截止前:</span>
            <input
              type="date"
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value)}
              className="text-xs bg-transparent text-zinc-700 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Reset Filter Button */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-8 px-3 rounded-full border border-black/[0.08] hover:border-black/20 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1 transition-all shadow-2xs"
            title="重置所有筛选"
          >
            <RotateCcw className="w-3 h-3 text-zinc-400" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Batch Operations Bar if any items selected */}
      {selectedIds.length > 0 && (
        <div className="bg-zinc-900 text-white p-3 rounded-2xl flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-150">
          <div className="flex items-center gap-2 pl-2">
            <span className="text-xs font-semibold">
              已选中 {selectedIds.length} 项
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenBatchUrge(selectedActions)}
              className="px-3 py-1.5 rounded-full bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-100 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Send className="w-3 h-3 text-indigo-600" />
              <span>合并催办</span>
            </button>

            <button
              type="button"
              onClick={() => onBatchComplete(selectedIds)}
              className="px-3 py-1.5 rounded-full bg-zinc-800 text-white text-xs font-medium hover:bg-zinc-700 flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>标记为完成</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 text-zinc-400 hover:text-white text-xs"
            >
              取消选择
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      {filteredActions.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-black/[0.06] p-8 shadow-2xs">
          <Filter className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-zinc-700">
            未找到符合筛选条件的事项
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            您可以尝试放宽筛选条件或点击重置筛选
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-3 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition-colors"
          >
            重置筛选
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Bento Pastel Grid (Image 8 Style) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredActions.map((action) => (
            <ActionCardPastel
              key={action.id}
              action={action}
              onClick={onSelectAction}
              onUrge={onUrgeAction}
            />
          ))}
        </div>
      ) : (
        /* High-Density Table View */
        <ActionTable
          actions={filteredActions}
          selectedIds={selectedIds}
          showId={showId}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onSelectAction={onSelectAction}
          onUrgeAction={onUrgeAction}
        />
      )}
    </div>
  );
};
