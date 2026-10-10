import { 
  ChevronRight, 
  Search, 
  Sparkles, 
  Plus, 
  Calendar,
  Inbox as InboxIcon,
  CheckSquare,
  FolderKanban,
  Archive as ArchiveIcon,
  SlidersHorizontal
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onOpenCreateModal: () => void;
  onOpenQuickQuery: () => void;
  onGenerateBrief: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenCreateModal,
  onOpenQuickQuery,
  onGenerateBrief,
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  const tabConfig: Record<string, { title: string; icon: React.FC<{ className?: string }> }> = {
    today: { title: 'Today', icon: Calendar },
    inbox: { title: 'Inbox', icon: InboxIcon },
    actions: { title: 'Actions', icon: CheckSquare },
    projects: { title: 'Projects', icon: FolderKanban },
    archive: { title: 'Archive', icon: ArchiveIcon },
  };

  const current = tabConfig[currentTab] || { title: 'Actions', icon: CheckSquare };
  const TabIcon = current.icon;

  return (
    <header className="h-16 px-6 border-b border-black/[0.05] bg-white flex items-center justify-between gap-4 shrink-0">
      {/* Zone 1: Breadcrumbs Trail & Sidebar Toggle */}
      <div className="flex items-center gap-2.5 text-xs">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="w-8 h-8 rounded-lg border border-black/[0.08] bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-all shadow-2xs cursor-pointer"
            title={isSidebarCollapsed ? "展开侧边栏 (快捷键: ⌘ M)" : "收起侧边栏 (快捷键: ⌘ M)"}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        )}
        <span className="font-semibold text-zinc-400">Action Center</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
        <div className="flex items-center gap-1.5 font-bold text-zinc-900 bg-zinc-50 border border-black/[0.04] px-2.5 py-1 rounded-full shadow-2xs">
          <TabIcon className="w-3.5 h-3.5 text-zinc-700" />
          <span>{current.title}</span>
        </div>
      </div>

      {/* Zone 2: Smart Search & Actions */}
      <div className="flex items-center gap-3">
        {/* Natural Language / Smart Query Bar ("理解查询") */}
        <button
          type="button"
          onClick={onOpenQuickQuery}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 hover:bg-zinc-100/80 border border-black/[0.06] text-xs text-zinc-500 hover:text-zinc-800 transition-all shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>理解查询 (例如: 下周截止的高优事项...)</span>
          <kbd className="font-mono text-[10px] text-zinc-400 bg-white border border-black/[0.06] px-1.5 py-0.5 rounded shadow-2xs">
            ⌘ K
          </kbd>
        </button>

        {/* AI Brief Trigger */}
        <button
          type="button"
          onClick={onGenerateBrief}
          className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 transition-colors"
          title="生成今日 Brief"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
        </button>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ 新建 Action</span>
        </button>
      </div>
    </header>
  );
};
