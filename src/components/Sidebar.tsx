import React from 'react';
import { 
  Calendar, 
  Inbox, 
  CheckSquare, 
  FolderKanban, 
  Archive, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  LogOut,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

import { AiQuotaInfo } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  inboxCount: number;
  overdueCount: number;
  todayCount: number;
  waitingCount: number;
  quickFilter?: string | null;
  onSelectQuickFilter?: (filter: string | null) => void;
  aiQuota?: AiQuotaInfo;
  onOpenAiQuotaModal?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  inboxCount,
  overdueCount,
  todayCount,
  waitingCount,
  quickFilter,
  onSelectQuickFilter,
  aiQuota,
  onOpenAiQuotaModal,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const mainNav = [
    {
      id: 'today',
      name: 'Today',
      icon: Calendar,
      badge: todayCount > 0 ? todayCount : undefined,
      badgeColor: 'bg-indigo-600',
    },
    {
      id: 'inbox',
      name: 'Inbox',
      icon: Inbox,
      badge: inboxCount > 0 ? inboxCount : undefined,
      badgeColor: 'bg-zinc-900',
    },
    {
      id: 'actions',
      name: 'Actions',
      icon: CheckSquare,
      badge: undefined,
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: FolderKanban,
      badge: undefined,
    },
    {
      id: 'archive',
      name: 'Archive',
      icon: Archive,
      badge: undefined,
    },
  ];

  // Collapsed Sidebar View
  if (isCollapsed) {
    return (
      <aside className="w-[72px] shrink-0 bg-[#F7F7FA] border-r border-black/[0.05] flex flex-col justify-between p-2.5 select-none transition-all duration-200">
        {/* Top Section */}
        <div className="space-y-4">
          {/* Logo & Toggle Button (Image 1) */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <div 
              onClick={onToggleCollapse}
              className="w-9 h-9 rounded-[10px] bg-zinc-950 text-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-black transition-colors"
              title="点击展开侧边栏"
            >
              <svg 
                className="w-5 h-5 text-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>

            {/* Image 1 Button to toggle expand/collapse */}
            <button 
              type="button"
              onClick={onToggleCollapse}
              className="w-8 h-8 rounded-lg border border-black/[0.08] bg-white flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:border-black/20 transition-all shadow-2xs"
              title="展开侧边栏 (快捷键: ⌘ M)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Icons */}
          <nav className="space-y-1.5 pt-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  title={item.name}
                  className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center relative transition-all ${
                    isActive 
                      ? 'bg-zinc-950 text-white shadow-2xs' 
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-2xs ${
                      isActive ? 'bg-indigo-500' : (item.badgeColor || 'bg-zinc-900')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Filter Icons */}
          <div className="pt-3 border-t border-black/[0.05] space-y-1.5 flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                onSelectTab('actions');
                if (onSelectQuickFilter) onSelectQuickFilter('overdue');
              }}
              title={`逾期预警关注 (${overdueCount})`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition-all ${
                quickFilter === 'overdue' && currentTab === 'actions'
                  ? 'bg-rose-100 text-rose-800'
                  : 'text-zinc-400 hover:text-rose-600 hover:bg-rose-50/60'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              {overdueCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('actions');
                if (onSelectQuickFilter) onSelectQuickFilter('waiting');
              }}
              title={`等待他人推进 (${waitingCount})`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition-all ${
                quickFilter === 'waiting' && currentTab === 'actions'
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-zinc-400 hover:text-amber-600 hover:bg-amber-50/60'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-500" />
              {waitingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Section (Collapsed) */}
        <div className="pt-3 border-t border-black/[0.05] space-y-2.5 flex flex-col items-center">
          {aiQuota && (
            <button
              type="button"
              onClick={onOpenAiQuotaModal}
              title={`大模型免费额度: 剩余 $${aiQuota.remaining.toFixed(2)} / $${aiQuota.total.toFixed(2)}`}
              className="w-10 h-11 rounded-xl bg-white border border-black/[0.08] hover:border-black/20 flex flex-col items-center justify-center gap-0.5 shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[9px] font-mono font-bold text-zinc-700">
                ${aiQuota.remaining.toFixed(1)}
              </span>
            </button>
          )}

          <div 
            className="w-8 h-8 rounded-full bg-zinc-900 text-white font-semibold text-xs flex items-center justify-center shadow-xs cursor-pointer"
            title="何星 · 我的工作空间 (hexing018@gmail.com)"
          >
            何
          </div>
        </div>
      </aside>
    );
  }

  // Expanded Sidebar View (Default)
  return (
    <aside className="w-64 shrink-0 bg-[#F7F7FA] border-r border-black/[0.05] flex flex-col justify-between p-4 select-none transition-all duration-200">
      {/* Top Header */}
      <div>
        {/* Brand Lockup */}
        <div className="flex items-center justify-between px-2 pt-1 pb-5">
          <div className="flex items-center gap-3">
            {/* Sleek black badge like Image 8 */}
            <div className="w-9 h-9 rounded-[10px] bg-zinc-950 text-white flex items-center justify-center shadow-sm">
              <svg 
                className="w-5 h-5 text-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight text-zinc-900 leading-tight">
                Action Center
              </h1>
              <p className="text-[11px] text-zinc-400 font-medium tracking-wide">
                收·理·跟·催·关
              </p>
            </div>
          </div>

          {/* Toggle button (Image 1) */}
          <button 
            type="button"
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-lg border border-black/[0.08] bg-white flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-black/20 transition-all shadow-2xs cursor-pointer"
            title="收起侧边栏 (快捷键: ⌘ M)"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section: Main Menu */}
        <div className="mt-2">
          <div className="px-3 pb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Main menu
            </span>
            <span className="text-[10px] text-zinc-400 font-mono tracking-tight">
              ⌘ M
            </span>
          </div>

          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-zinc-950 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-black/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                        isActive ? 'bg-indigo-500' : (item.badgeColor || 'bg-zinc-900')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section: Quick Views / Exception Filters */}
        <div className="mt-6">
          <div className="px-3 pb-2">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              快捷视图
            </span>
          </div>

          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => {
                onSelectTab('actions');
                if (onSelectQuickFilter) onSelectQuickFilter('overdue');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-medium transition-all ${
                quickFilter === 'overdue' && currentTab === 'actions'
                  ? 'bg-rose-50 text-rose-800 shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.03]'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>逾期预警关注</span>
              </div>
              {overdueCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                  {overdueCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('actions');
                if (onSelectQuickFilter) onSelectQuickFilter('waiting');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-medium transition-all ${
                quickFilter === 'waiting' && currentTab === 'actions'
                  ? 'bg-amber-50 text-amber-900 shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.03]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>等待他人推进</span>
              </div>
              {waitingCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  {waitingCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Profile & Workspace Section */}
      <div className="pt-3 border-t border-black/[0.05] space-y-2.5">
        {/* Large Model Monthly Quota Widget */}
        {aiQuota && (
          <div
            onClick={onOpenAiQuotaModal}
            role="button"
            tabIndex={0}
            title="点击查看大模型月度免费额度明细与用量记录"
            className="group relative bg-white hover:bg-white/95 rounded-2xl p-2.5 border border-black/[0.06] hover:border-black/15 shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none"
          >
            {/* Top row: Icon, Title, Monthly Tag */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-zinc-950 text-amber-400 flex items-center justify-center shadow-3xs">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-bold text-zinc-800 tracking-tight">
                  大模型月度额度
                </span>
              </div>
              <span className="text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/50">
                $5.00 免费
              </span>
            </div>

            {/* Middle row: Remaining Amount & Percentage */}
            <div className="flex items-baseline justify-between mb-1.5 px-0.5">
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] text-zinc-400 font-medium">剩余</span>
                <span className="text-sm font-extrabold font-mono text-zinc-900 tracking-tight">
                  ${aiQuota.remaining.toFixed(2)}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  / ${aiQuota.total.toFixed(2)}
                </span>
              </div>
              <span className={`text-[10px] font-bold font-mono ${
                (aiQuota.remaining / aiQuota.total) > 0.3 ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {((aiQuota.remaining / aiQuota.total) * 100).toFixed(0)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden p-[1px]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  (aiQuota.remaining / aiQuota.total) > 0.3
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : (aiQuota.remaining / aiQuota.total) > 0.1
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (aiQuota.remaining / aiQuota.total) * 100))}%` }}
              />
            </div>

            {/* Bottom micro label */}
            <div className="mt-1.5 pt-1 border-t border-black/[0.04] flex items-center justify-between text-[9px] text-zinc-400 group-hover:text-zinc-600 transition-colors">
              <span>次月1日自动重置</span>
              <span className="flex items-center gap-0.5 font-medium text-zinc-500 group-hover:text-zinc-900">
                用量明细
                <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        )}

        {/* User Account Card */}
        <div className="bg-white/80 rounded-2xl p-2.5 border border-black/[0.05] shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                何
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-zinc-900 truncate">
                  我的工作空间
                </div>
                <div className="text-[10px] text-zinc-400 truncate">
                  hexing018@gmail.com
                </div>
              </div>
            </div>

            <button 
              type="button"
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-black/[0.04] rounded-lg transition-colors cursor-pointer"
              title="退出登录"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="px-2 pt-1 text-center">
          <p className="text-[10px] text-zinc-400 font-medium tracking-wide">
            让每一件事有着落
          </p>
        </div>
      </div>
    </aside>
  );
};
