import React, { useState, useEffect } from 'react';
import { 
  ActionItem, 
  Project, 
  InboxItem, 
  UrgeRecord,
  ActionStatus,
  AiQuotaInfo
} from './types';
import { 
  initialActions, 
  initialProjects, 
  initialInboxItems, 
  initialArchivedActions, 
  initialUrgeRecords 
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TodayView } from './components/TodayView';
import { InboxView } from './components/InboxView';
import { ActionsView } from './components/ActionsView';
import { ProjectsView } from './components/ProjectsView';
import { ArchiveView } from './components/ArchiveView';
import { ActionDetailDrawer } from './components/ActionDetailDrawer';
import { ImportModal } from './components/ImportModal';
import { UrgeModal } from './components/UrgeModal';
import { CreateActionModal } from './components/CreateActionModal';
import { AiBriefModal } from './components/AiBriefModal';
import { SmartQueryModal } from './components/SmartQueryModal';
import { AiQuotaModal } from './components/AiQuotaModal';
import { Sparkles, Send, Plus, Check } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('today');
  const [actions, setActions] = useState<ActionItem[]>(initialActions);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(initialInboxItems);
  const [archivedActions, setArchivedActions] = useState<ActionItem[]>(initialArchivedActions);
  const [urgeRecords, setUrgeRecords] = useState<UrgeRecord[]>(initialUrgeRecords);

  // Large Model Free Quota ($5.00/month)
  const [aiQuota, setAiQuota] = useState<AiQuotaInfo>({
    total: 5.00,
    used: 0.72,
    remaining: 4.28,
    currency: '$',
    resetDate: '2026-11-01',
    modelName: 'Gemini 2.5 Flash',
    logs: [
      {
        id: 'log-1',
        timestamp: '2026-10-10 14:20',
        action: '生成今日推进 Brief',
        tokens: 1240,
        cost: 0.024,
      },
      {
        id: 'log-2',
        timestamp: '2026-10-10 11:05',
        action: '智能催办话术生成',
        tokens: 450,
        cost: 0.009,
      },
      {
        id: 'log-3',
        timestamp: '2026-10-10 09:30',
        action: '收件箱待办智能提取',
        tokens: 890,
        cost: 0.018,
      },
      {
        id: 'log-4',
        timestamp: '2026-10-09 16:40',
        action: '自然语言理解查询 (⌘ K)',
        tokens: 320,
        cost: 0.006,
      },
    ],
  });
  const [isAiQuotaModalOpen, setIsAiQuotaModalOpen] = useState(false);

  const deductAiQuota = (actionName: string, cost = 0.015, tokens = 750) => {
    setAiQuota((prev) => {
      const newRemaining = Math.max(0, +(prev.remaining - cost).toFixed(3));
      const newUsed = +(prev.used + cost).toFixed(3);
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: '刚刚 (2026-10-10)',
        action: actionName,
        tokens,
        cost,
      };
      return {
        ...prev,
        remaining: newRemaining,
        used: newUsed,
        logs: [newLog, ...prev.logs],
      };
    });
  };

  // Modals & Drawer State
  const [selectedActionForDrawer, setSelectedActionForDrawer] = useState<ActionItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSmartQueryOpen, setIsSmartQueryOpen] = useState(false);
  const [urgeModalState, setUrgeModalState] = useState<{ isOpen: boolean; actions: ActionItem[] }>({
    isOpen: false,
    actions: [],
  });
  const [aiBriefState, setAiBriefState] = useState<{
    isOpen: boolean;
    type: 'daily_brief' | 'project_review';
    project?: Project;
  }>({
    isOpen: false,
    type: 'daily_brief',
  });

  // Quick filters
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  // Sidebar Collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSmartQueryOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'm' || e.key.toLowerCase() === 'b')) {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Action Handlers
  const handleSelectAction = (action: ActionItem) => {
    setSelectedActionForDrawer(action);
  };

  const handleUpdateAction = (updated: ActionItem) => {
    if (updated.status === '已完成') {
      // move to archive
      setActions((prev) => prev.filter((a) => a.id !== updated.id));
      setArchivedActions((prev) => [updated, ...prev]);
      showToast(`事项「${updated.title}」已完成并转入归档`);
    } else {
      setActions((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      showToast('事项进展已更新');
    }
    setSelectedActionForDrawer(null);
  };

  const handleOpenUrgeModal = (action: ActionItem) => {
    setUrgeModalState({
      isOpen: true,
      actions: [action],
    });
  };

  const handleOpenBatchUrge = (selectedList: ActionItem[]) => {
    if (selectedList.length === 0) return;
    setUrgeModalState({
      isOpen: true,
      actions: selectedList,
    });
  };

  const handleSendUrge = (record: UrgeRecord) => {
    setUrgeRecords((prev) => [record, ...prev]);

    // Append urge event to timeline of affected actions
    setActions((prev) =>
      prev.map((a) => {
        if (record.actionIds.includes(a.id)) {
          return {
            ...a,
            urgencyCount: (a.urgencyCount || 0) + 1,
            timeline: [
              {
                id: `t-${Date.now()}-${a.id}`,
                time: '刚刚 (2026年10月10日)',
                type: 'urge',
                user: '何星',
                text: `已向【${record.recipient}】发送催办消息：${record.message.slice(0, 50)}...`,
              },
              ...a.timeline,
            ],
          };
        }
        return a;
      })
    );

    showToast(`已向【${record.recipient}】发出催办通知，已登记跟进记录`);
  };

  const handleCreateAction = (newAction: ActionItem) => {
    setActions((prev) => [newAction, ...prev]);
    showToast(`新事项「${newAction.title}」已成功创建！`);
  };

  const handleBatchComplete = (ids: string[]) => {
    const toComplete = actions.filter((a) => ids.includes(a.id));
    const updatedArchived = toComplete.map((a) => ({
      ...a,
      status: '已完成' as ActionStatus,
      completedAt: '2026-10-10',
      timeline: [
        {
          id: `t-${Date.now()}`,
          time: '刚刚 (2026年10月10日)',
          type: 'status' as const,
          user: '何星',
          text: '批量标记为已完成',
        },
        ...a.timeline,
      ],
    }));

    setActions((prev) => prev.filter((a) => !ids.includes(a.id)));
    setArchivedActions((prev) => [...updatedArchived, ...prev]);
    showToast(`已批量完成 ${ids.length} 项事项！`);
  };

  const handleImportSuccess = (newInboxItem: InboxItem) => {
    // Separate complete items from incomplete items (e.g. missing owner)
    const completeItems = newInboxItem.extractedItems.filter(
      (it) => it.owner && it.owner !== '待确认' && it.owner !== '—'
    );
    const incompleteItems = newInboxItem.extractedItems.filter(
      (it) => !it.owner || it.owner === '待确认' || it.owner === '—'
    );

    // Complete items are directly recognized and added into official Actions!
    if (completeItems.length > 0) {
      const newActions: ActionItem[] = completeItems.map((it, idx) => {
        const idNum = Math.floor(Math.random() * 900) + 100;
        return {
          id: `AC-0000${idNum}`,
          code: String(idNum),
          title: it.title,
          description: it.standard || '从 Excel 自动识别导入',
          projectId: 'proj-1',
          projectName: '数智化服务平台',
          owner: it.owner,
          waitingFor: it.waitingFor || '—',
          status: '进行中',
          priority: it.priority || 'HIGH',
          deadline: it.deadline || '2026-10-12',
          nextFollowUp: '待确认',
          source: {
            type: 'Excel',
            name: newInboxItem.sourceName,
          },
          latestProgress: it.standard || '待推进',
          colorTheme: 'indigo',
          participantsCount: 2,
          timeline: [
            {
              id: `t-${Date.now()}-${idx}`,
              time: '刚刚 (2026年10月10日)',
              type: 'create',
              user: '何星',
              text: `从 Excel 自动识别导入：${it.title}`,
            },
          ],
        };
      });
      setActions((prev) => [...newActions, ...prev]);
    }

    // Only incomplete items (e.g. missing owner) stay in "待整理的内容"
    if (incompleteItems.length > 0) {
      const unorganizedInboxItem: InboxItem = {
        ...newInboxItem,
        extractedItems: incompleteItems,
      };
      setInboxItems((prev) => [unorganizedInboxItem, ...prev]);
    }

    setCurrentTab('inbox');
    if (completeItems.length > 0 && incompleteItems.length > 0) {
      showToast(`已自动识别 ${completeItems.length} 项转入看板，${incompleteItems.length} 项缺少待办人进入待整理`);
    } else if (completeItems.length > 0) {
      showToast(`已自动识别全部 ${completeItems.length} 项事项并录入看板！`);
    } else {
      showToast(`导入完成，共 ${incompleteItems.length} 项缺少待办人`);
    }
  };

  const handleConvertInboxToAction = (partial: Partial<ActionItem>) => {
    const newIdNum = Math.floor(Math.random() * 900) + 50;
    const newAction: ActionItem = {
      id: `AC-0000${newIdNum}`,
      code: String(newIdNum),
      title: partial.title || '新待办事项',
      description: partial.description || '从收件箱快速确认转入',
      projectId: partial.projectId || 'proj-1',
      projectName: partial.projectName || '数智化服务平台',
      owner: partial.owner || '待确认',
      waitingFor: partial.waitingFor || '—',
      status: '进行中',
      priority: 'HIGH',
      deadline: partial.deadline || '2026-10-12',
      nextFollowUp: '待确认',
      source: {
        type: '会议',
        name: '收件箱快速转入',
      },
      latestProgress: '已从收件箱转入看板',
      colorTheme: 'indigo',
      participantsCount: 2,
      timeline: [
        {
          id: `t-${Date.now()}`,
          time: '刚刚 (2026年10月10日)',
          type: 'create',
          user: '何星',
          text: `从收件箱转入正式事项：${partial.title}`,
        },
      ],
    };

    setActions((prev) => [newAction, ...prev]);
    showToast(`已将待办「${newAction.title.slice(0, 16)}」转入正式看板`);
  };

  const handleDeleteInboxItem = (id: string) => {
    setInboxItems((prev) => prev.filter((item) => item.id !== id));
    showToast('收件箱记录已删除');
  };

  // Metrics for Sidebar Badges
  const inboxCount = inboxItems.length;
  const overdueCount = actions.filter((a) => !!a.overdueDays).length;
  const todayCount = actions.filter(
    (a) => a.nextFollowUp === '2026-10-10' || a.deadline === '2026-10-10' || a.overdueDays
  ).length;
  const waitingCount = actions.filter((a) => a.waitingFor && a.waitingFor !== '—').length;

  return (
    <div className="min-h-screen bg-[#ECEEF2] text-zinc-900 flex items-center justify-center p-2 sm:p-4 lg:p-6 select-none font-sans">
      {/* Floating Application Shell - Exactly mirroring Image 8 style! */}
      <div className="w-full max-w-[1440px] h-[92vh] max-h-[960px] bg-white rounded-[28px] border border-black/[0.07] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          inboxCount={inboxCount}
          overdueCount={overdueCount}
          todayCount={todayCount}
          waitingCount={waitingCount}
          quickFilter={quickFilter}
          onSelectQuickFilter={setQuickFilter}
          aiQuota={aiQuota}
          onOpenAiQuotaModal={() => setIsAiQuotaModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
          {/* Top Header with Breadcrumbs & Action Bar */}
          <Header
            currentTab={currentTab}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenQuickQuery={() => setIsSmartQueryOpen(true)}
            onGenerateBrief={() => {
              deductAiQuota('生成今日推进 Brief', 0.02, 1150);
              setAiBriefState({ isOpen: true, type: 'daily_brief' });
            }}
          />

          {/* View Container with Smooth Scrolling */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FAFBFD]/50">
            {currentTab === 'today' && (
              <TodayView
                actions={actions}
                urgeRecords={urgeRecords}
                onSelectAction={handleSelectAction}
                onUrgeAction={handleOpenUrgeModal}
                onOpenBatchUrge={handleOpenBatchUrge}
                onGenerateBrief={() => {
                  deductAiQuota('生成今日推进 Brief', 0.02, 1150);
                  setAiBriefState({ isOpen: true, type: 'daily_brief' });
                }}
              />
            )}

            {currentTab === 'inbox' && (
              <InboxView
                inboxItems={inboxItems}
                onOpenImportModal={() => setIsImportModalOpen(true)}
                onSaveToInbox={(item) => {
                  setInboxItems((prev) => [item, ...prev]);
                  showToast('已保存到收件箱');
                }}
                onConvertToAction={handleConvertInboxToAction}
                onDeleteInboxItem={handleDeleteInboxItem}
                onUpdateInboxItem={(item) => setInboxItems((prev) => prev.map((it) => it.id === item.id ? item : it))}
                onAiDeduct={(action, cost, tokens) => deductAiQuota(action, cost, tokens)}
              />
            )}

            {currentTab === 'actions' && (
              <ActionsView
                actions={actions}
                projects={projects}
                quickFilter={quickFilter}
                onSelectAction={handleSelectAction}
                onUrgeAction={handleOpenUrgeModal}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onOpenBatchUrge={handleOpenBatchUrge}
                onBatchComplete={handleBatchComplete}
              />
            )}

            {currentTab === 'projects' && (
              <ProjectsView
                projects={projects}
                actions={actions}
                onSelectAction={handleSelectAction}
                onUrgeAction={handleOpenUrgeModal}
                onGenerateProjectReview={(proj) =>
                  setAiBriefState({
                    isOpen: true,
                    type: 'project_review',
                    project: proj,
                  })
                }
                onCreateActionForProject={(projId) => {
                  setIsCreateModalOpen(true);
                }}
              />
            )}

            {currentTab === 'archive' && (
              <ArchiveView
                archivedActions={archivedActions}
                projects={projects}
                onSelectAction={handleSelectAction}
              />
            )}
          </main>
        </div>

        {/* Floating Quick Urge / AI Action Trigger (seen on right in screenshot) */}
        <button
          type="button"
          onClick={() => setAiBriefState({ isOpen: true, type: 'daily_brief' })}
          className="absolute bottom-6 right-6 w-11 h-11 rounded-full bg-zinc-950 text-white shadow-lg hover:bg-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-30 group"
          title="快捷生成今日 Brief"
        >
          <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
        </button>

        {/* Slide-over Drawer for Item Details (Image 4) */}
        <ActionDetailDrawer
          action={selectedActionForDrawer}
          onClose={() => setSelectedActionForDrawer(null)}
          onUpdateAction={handleUpdateAction}
          onUrgeAction={handleOpenUrgeModal}
        />

        {/* Import Modal (Image 7) */}
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          projects={projects}
          onImportSuccess={handleImportSuccess}
        />

        {/* Urge Ping Modal */}
        <UrgeModal
          isOpen={urgeModalState.isOpen}
          onClose={() => setUrgeModalState({ isOpen: false, actions: [] })}
          actions={urgeModalState.actions}
          onSendUrge={handleSendUrge}
        />

        {/* Create Action Modal */}
        <CreateActionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          projects={projects}
          onCreate={handleCreateAction}
        />

        {/* AI Brief & Meeting Review Modal */}
        <AiBriefModal
          isOpen={aiBriefState.isOpen}
          onClose={() => setAiBriefState((prev) => ({ ...prev, isOpen: false }))}
          type={aiBriefState.type}
          actions={actions}
          project={aiBriefState.project}
        />

        {/* Smart Query Modal */}
        <SmartQueryModal
          isOpen={isSmartQueryOpen}
          onClose={() => setIsSmartQueryOpen(false)}
          actions={actions}
          onSelectAction={handleSelectAction}
          onApplyQuery={(filtered, queryText) => {
            deductAiQuota(`自然语言查询: ${queryText}`, 0.008, 420);
            setCurrentTab('actions');
            showToast(`已按语义意图“${queryText}”匹配出 ${filtered.length} 项 (大模型已解析)`);
          }}
        />

        {/* Large Model Free Quota Modal */}
        <AiQuotaModal
          isOpen={isAiQuotaModalOpen}
          onClose={() => setIsAiQuotaModalOpen(false)}
          quota={aiQuota}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-zinc-900/95 text-white px-4 py-2 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top duration-200 backdrop-blur-xs">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
