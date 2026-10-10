import React, { useState } from 'react';
import { ActionItem, Project } from '../types';
import { 
  Download, 
  Search, 
  RotateCcw, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ChevronDown 
} from 'lucide-react';

interface ArchiveViewProps {
  archivedActions: ActionItem[];
  projects: Project[];
  onSelectAction: (action: ActionItem) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  archivedActions,
  projects,
  onSelectAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [completedAfter, setCompletedAfter] = useState('');
  const [showId, setShowId] = useState(false);

  const filteredArchive = archivedActions.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (projectFilter !== 'all' && item.projectId !== projectFilter) return false;
    if (ownerFilter !== 'all' && item.owner !== ownerFilter) return false;
    if (completedAfter && (item.completedAt || '') < completedAfter) return false;
    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setProjectFilter('all');
    setOwnerFilter('all');
    setCompletedAfter('');
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Action', 'Project', 'Owner', 'Waiting For', 'Status', 'Deadline', 'Completed At'];
    const rows = filteredArchive.map((a) => [
      a.id,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.projectName}"`,
      a.owner,
      a.waitingFor,
      a.status,
      a.deadline,
      a.completedAt || '',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ActionCenter_Archive_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allOwners = Array.from(new Set(archivedActions.map((a) => a.owner))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header with single 导出 CSV button as requested */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Archive
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            已经完成的工作，以及不再需要推进的事项
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-full border border-black/[0.1] bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>导出 CSV</span>
          </button>
        </div>
      </div>

      {/* 3 Stat KPI Cards (Image 6 & Image 8) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-emerald-100 bg-[#ECFDF5]/60 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-900/70 text-xs font-semibold mb-2">
            <span>本月完成</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-950 font-mono tabular-nums">
            {archivedActions.length}
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-1">
            已成功达成闭环与归档
          </p>
        </div>

        <div className="rounded-3xl border border-indigo-100 bg-[#EEF2FF]/60 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-900/70 text-xs font-semibold mb-2">
            <span>平均关闭周期 (天)</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-950 font-mono tabular-nums">
            2.8
          </div>
          <p className="text-[11px] text-indigo-700/80 mt-1">
            从创建到完成平均用时
          </p>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-[#FFFBEB]/70 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-amber-900/70 text-xs font-semibold mb-2">
            <span>按期完成率 (%)</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-950 font-mono tabular-nums">
            94.5%
          </div>
          <p className="text-[11px] text-amber-700/80 mt-1">
            在预定 Deadline 前闭环比例
          </p>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-2xs space-y-4">
        {/* Single Row Filter Controls with unified pill design */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索已归档事项、进展和来源..."
              className="w-full text-xs pl-9 pr-3 py-1.5 h-8 bg-zinc-50 border border-black/[0.08] rounded-full focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
            />
          </div>

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

          <div className="relative inline-flex items-center bg-white border border-black/[0.08] hover:border-black/20 rounded-full h-8 pl-3 pr-2.5 shadow-2xs transition-all">
            <span className="text-[11px] text-zinc-400 mr-1.5 whitespace-nowrap">完成于此后:</span>
            <input
              type="date"
              value={completedAfter}
              onChange={(e) => setCompletedAfter(e.target.value)}
              className="text-xs bg-transparent text-zinc-700 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="h-8 px-3 rounded-full border border-black/[0.08] hover:border-black/20 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1 transition-all shadow-2xs"
            title="重置所有筛选"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>重置</span>
          </button>

          <button
            type="button"
            onClick={() => setShowId(!showId)}
            className={`h-8 px-3 rounded-full border text-xs font-medium transition-all shadow-2xs ${
              showId
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-500 border-black/[0.08] hover:border-black/20 hover:text-zinc-800'
            }`}
            title="默认不展示 ID，点击可开启/关闭"
          >
            <span>{showId ? '已显示 ID' : '显示 ID'}</span>
          </button>
        </div>

        {/* Archive Table */}
        <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50/75 border-b border-black/[0.06] text-zinc-500 font-medium">
                {showId && (
                  <th className="py-3 px-3 font-semibold text-zinc-700 w-28">ID</th>
                )}
                <th className="py-3 px-3 font-semibold text-zinc-700 min-w-[280px]">Action 事项</th>
                <th className="py-3 px-3 font-semibold text-zinc-700 w-36">Project 专项</th>
                <th className="py-3 px-3 font-semibold text-zinc-700 w-28">Owner 责任人</th>
                <th className="py-3 px-3 font-semibold text-zinc-700 w-28">Waiting For</th>
                <th className="py-3 px-3 font-semibold text-zinc-700 w-24">Status 状态</th>
                <th className="py-3 px-3 font-semibold text-zinc-700 w-28">完成时间</th>
                <th className="py-3 px-3 font-semibold text-zinc-700 w-28">取消时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-zinc-700">
              {filteredArchive.length === 0 ? (
                <tr>
                  <td colSpan={showId ? 8 : 7} className="py-12 text-center text-zinc-400 text-xs">
                    暂无符合条件的归档事项
                  </td>
                </tr>
              ) : (
                filteredArchive.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectAction(item)}
                    className="hover:bg-zinc-50/80 cursor-pointer transition-colors"
                  >
                    {showId && (
                      <td className="py-3 px-3 font-mono text-[11px] text-zinc-500 font-medium">
                        {item.id}
                      </td>
                    )}
                    <td className="py-3 px-3 font-semibold text-zinc-900">
                      {item.title}
                    </td>
                    <td className="py-3 px-3 text-zinc-600">
                      {item.projectName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {item.owner}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {item.waitingFor || '—'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 tabular-nums text-zinc-600">
                      {item.completedAt || '2026-10-09'}
                    </td>
                    <td className="py-3 px-3 tabular-nums text-zinc-400">
                      {item.cancelledAt || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Bottom count label without duplicated buttons */}
        <div className="pt-2 text-right">
          <span className="text-[11px] text-zinc-400">
            共 {filteredArchive.length} 条归档数据 · 支持随时导出用于审计或汇报
          </span>
        </div>
      </div>
    </div>
  );
};
