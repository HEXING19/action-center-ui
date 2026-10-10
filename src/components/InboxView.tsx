import React, { useState } from 'react';
import { InboxItem, SourceType, ActionItem } from '../types';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Plus, 
  Check, 
  Calendar, 
  User, 
  UserX,
  ArrowRight, 
  Clock, 
  Trash2,
  ChevronDown,
  AlertCircle,
  HelpCircle,
  Layers
} from 'lucide-react';

interface InboxViewProps {
  inboxItems: InboxItem[];
  onOpenImportModal: () => void;
  onSaveToInbox: (item: InboxItem) => void;
  onConvertToAction: (action: Partial<ActionItem>) => void;
  onDeleteInboxItem: (id: string) => void;
  onUpdateInboxItem?: (item: InboxItem) => void;
  onAiDeduct?: (action: string, cost?: number, tokens?: number) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  inboxItems,
  onOpenImportModal,
  onSaveToInbox,
  onConvertToAction,
  onDeleteInboxItem,
  onUpdateInboxItem,
  onAiDeduct,
}) => {
  const [rawText, setRawText] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('会议');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [livePreviewActions, setLivePreviewActions] = useState<Array<{
    title: string;
    owner: string;
    deadline: string;
    standard: string;
  }> | null>(null);

  // State to track which item's assignee dropdown is open
  const [activeAssignMenu, setActiveAssignMenu] = useState<{ itemId: string; subIdx: number } | null>(null);

  const teamMembers = ['段孝义', '王鹏', '何星', '李毅豪', '郑毅', '黄祥红'];

  // Button 2 Action: AI Recognize Action
  const handleAiRecognize = () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    if (onAiDeduct) {
      onAiDeduct('收件箱待办智能提取', 0.012, 680);
    }

    // Smart natural language parsing simulation
    setTimeout(() => {
      const lines = rawText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const parsed: Array<{
        title: string;
        owner: string;
        deadline: string;
        standard: string;
      }> = [];

      lines.forEach((line) => {
        // extract owner if mentioned
        let owner = '待确认';
        const ownerMatch = line.match(/(?:责任人|Owner|负责人|：|:|\s)([^\s·,，]+)/i);
        if (ownerMatch && ownerMatch[1].length <= 5) {
          owner = ownerMatch[1];
        }

        // extract deadline
        let deadline = '2026-10-12';
        const dateMatch = line.match(/(\d{4}[年/-]\d{1,2}[月/-]\d{1,2}日?)/);
        if (dateMatch) {
          deadline = dateMatch[1].replace('年', '-').replace('月', '-').replace('日', '');
        }

        const cleanTitle = line
          .replace(/^第\s*\d+\s*行[:：]/, '')
          .replace(/^[A-Z0-9\.\-、\s]+/, '')
          .replace(/待办[：:]\s*/, '')
          .slice(0, 60);

        if (cleanTitle.length > 4) {
          parsed.push({
            title: cleanTitle,
            owner,
            deadline,
            standard: '明确验收标准并同步例会结论',
          });
        }
      });

      setLivePreviewActions(parsed.length > 0 ? parsed : [
        {
          title: rawText.slice(0, 50),
          owner: '待确认',
          deadline: '2026-10-12',
          standard: '待对齐',
        },
      ]);
      setIsParsing(false);
    }, 600);
  };

  // Button 1 Action: Save to Inbox only (no immediate parsing)
  const handleSaveOnly = () => {
    if (!rawText.trim()) return;

    const newItem: InboxItem = {
      id: `inbox-${Date.now()}`,
      entryDate: '2026年10月10日',
      rawText: rawText.trim(),
      sourceType,
      sourceName: sourceName.trim() || '日常沟通收集',
      sourceUrl: sourceUrl.trim() || undefined,
      status: '待整理',
      extractedItems: [
        {
          title: rawText.trim().slice(0, 60),
          owner: '待确认',
          deadline: '2026-10-12',
          standard: '待补充具体标准',
        },
      ],
    };

    onSaveToInbox(newItem);
    setRawText('');
    setSourceName('');
    setSourceUrl('');
    setLivePreviewActions(null);
  };

  // Handler to assign member to an incomplete item
  const handleAssignMember = (itemId: string, subIdx: number, memberName: string) => {
    const parentItem = inboxItems.find((it) => it.id === itemId);
    if (!parentItem || !onUpdateInboxItem) return;

    const updatedExtracted = [...parentItem.extractedItems];
    if (updatedExtracted[subIdx]) {
      updatedExtracted[subIdx] = {
        ...updatedExtracted[subIdx],
        owner: memberName,
      };
    }

    onUpdateInboxItem({
      ...parentItem,
      extractedItems: updatedExtracted,
    });
    setActiveAssignMenu(null);
  };

  // Handler to convert sub item to official Action Kanban
  const handleConvertSubItem = (itemId: string, subIdx: number, subItem: any) => {
    onConvertToAction({
      title: subItem.title,
      owner: subItem.owner === '待确认' ? '何星' : subItem.owner,
      deadline: subItem.deadline,
      description: subItem.standard,
      projectName: '数智化服务平台',
      projectId: 'proj-1',
    });

    // Remove this sub item from InboxItem once converted
    const parentItem = inboxItems.find((it) => it.id === itemId);
    if (!parentItem) return;

    const remaining = parentItem.extractedItems.filter((_, i) => i !== subIdx);
    if (remaining.length === 0) {
      onDeleteInboxItem(itemId);
    } else if (onUpdateInboxItem) {
      onUpdateInboxItem({
        ...parentItem,
        extractedItems: remaining,
      });
    }
  };

  // Track staged assignees before converting
  const [stagedOwners, setStagedOwners] = useState<Record<string, string>>({});

  // Flatten unorganized items across all inbox items
  // NOTE: Items with already identified owners from import tables are NOT displayed here!
  // Here we ONLY display unorganized items that lack owners or need alignment.
  const unorganizedList: Array<{
    parentId: string;
    subIdx: number;
    title: string;
    owner: string;
    deadline: string;
    standard?: string;
    sourceName: string;
  }> = [];

  inboxItems.forEach((item) => {
    if (item.extractedItems && item.extractedItems.length > 0) {
      item.extractedItems.forEach((sub, idx) => {
        // Items already identified with real owners from imported tables are NOT shown here
        const isMissingOwner = !sub.owner || sub.owner === '待确认' || sub.owner === '缺少待办人' || sub.owner === '—';
        if (isMissingOwner) {
          unorganizedList.push({
            parentId: item.id,
            subIdx: idx,
            title: sub.title,
            owner: sub.owner,
            deadline: sub.deadline,
            standard: sub.standard,
            sourceName: item.sourceName,
          });
        }
      });
    } else if (item.rawText && item.status === '待整理') {
      unorganizedList.push({
        parentId: item.id,
        subIdx: 0,
        title: item.rawText.slice(0, 50),
        owner: '待确认',
        deadline: '2026-10-12',
        standard: '从便签暂存转入',
        sourceName: item.sourceName,
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Inbox
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            把分散的会议待办和沟通事项，整理到一个入口
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenImportModal}
          className="px-4 py-2 rounded-full border border-black/[0.1] bg-white text-zinc-800 text-xs font-semibold hover:bg-zinc-50 transition-all flex items-center gap-2 shadow-2xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>导入 Excel / CSV</span>
        </button>
      </div>

      {/* Card 1: 原始内容输入卡片 */}
      <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-2xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-2">
            原始内容
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="把会议待办 / 企业微信 DM / 临时事项粘贴到这里..."
            className="w-full text-xs p-4 rounded-2xl bg-zinc-50 border border-black/[0.06] focus:bg-white focus:outline-none focus:border-zinc-900 resize-none h-36 leading-relaxed transition-all placeholder:text-zinc-400"
          />
        </div>

        {/* Source Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
              来源
            </label>
            <div className="relative flex items-center">
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as SourceType)}
                className="w-full appearance-none text-xs font-medium text-zinc-800 bg-zinc-50 hover:bg-white border border-black/[0.08] hover:border-black/20 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-zinc-900 cursor-pointer shadow-2xs transition-all"
              >
                <option value="会议">会议</option>
                <option value="企业微信">企业微信 DM / 群聊</option>
                <option value="钉钉">钉钉</option>
                <option value="邮件">邮件</option>
                <option value="口头">口头沟通</option>
                <option value="临时事项">临时事项</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
              来源名称
            </label>
            <input
              type="text"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="例如: 数智化双周例会 或 Book1.xlsx"
              className="w-full text-xs font-medium text-zinc-800 bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
              来源链接
            </label>
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="可选: 文档链接或对话回溯"
              className="w-full text-xs font-medium text-zinc-800 bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-900 shadow-2xs"
            />
          </div>
        </div>

        {/* Live Parsing Preview if available */}
        {livePreviewActions && livePreviewActions.length > 0 && (
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI 智能识别结果 ({livePreviewActions.length} 条待办已提取结构)
              </span>
              <span className="text-[11px] text-indigo-600">
                可核对后直接转入正式看板
              </span>
            </div>

            <div className="space-y-2">
              {livePreviewActions.map((action, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="truncate">
                    <h5 className="text-xs font-semibold text-zinc-900 truncate">
                      {action.title}
                    </h5>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-0.5">
                      <span>责任人: {action.owner}</span>
                      <span>截止: {action.deadline}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onConvertToAction({
                        title: action.title,
                        owner: action.owner === '待确认' ? '何星' : action.owner,
                        deadline: action.deadline,
                        description: action.standard,
                        projectName: '数智化服务平台',
                        projectId: 'proj-1',
                      });
                      setLivePreviewActions((prev) => prev?.filter((_, i) => i !== idx) || null);
                    }}
                    className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1 shrink-0 shadow-2xs transition-all"
                  >
                    <span>转为 Action</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card 1 Bottom Bar - With Clear Function Explanations */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-black/[0.05]">
          <div className="flex items-start sm:items-center gap-2 text-xs text-zinc-500">
            <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-[11px] leading-relaxed">
              <span className="text-zinc-700 font-semibold">按钮区别：</span>
              <span>「保存到 Inbox」仅暂存原文草稿（0 额度消耗）；「AI 识别 Action」调用大模型抽取事项/人/期并生成结构化卡片。</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Button 1: Save to Inbox (Raw note, no AI parsing) */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                disabled={!rawText.trim()}
                onClick={handleSaveOnly}
                className="px-4 py-2 rounded-full border border-black/[0.1] text-zinc-700 text-xs font-semibold hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="保存到 Inbox：暂存原始内容为草稿，不调用大模型，不消耗免费额度"
              >
                保存到 Inbox
              </button>
              <span className="text-[10px] text-zinc-400 mt-0.5">暂存草稿 · 0 消耗</span>
            </div>

            {/* Button 2: AI Recognize Action (Instant LLM structure extraction) */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                disabled={!rawText.trim() || isParsing}
                onClick={handleAiRecognize}
                className="px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-2xs"
                title="AI 识别 Action：调用大模型自动识别责任人与截止期，生成结构化待办卡片"
              >
                <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isParsing ? 'animate-spin' : ''}`} />
                <span>{isParsing ? '正在识别结构...' : 'AI 识别 Action'}</span>
              </button>
              <span className="text-[10px] text-indigo-500 font-medium mt-0.5">智能解析人/期 · 消耗额度</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: 待整理的内容 (Strictly styled according to User Image 3, excluding already recognized items) */}
      <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-2xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/[0.04]">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-bold text-zinc-900">
              待整理的内容
            </h3>
            <span className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
              {unorganizedList.length} 项缺少待办人
            </span>
          </div>

          <span className="text-[11px] text-zinc-400">
            表格导入已识别完整的事项已直接录入看板，此处仅沉淀缺少待办人或待确认事项
          </span>
        </div>

        {/* List Body Styled Exactly as Image 3 */}
        {unorganizedList.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs space-y-1">
            <Check className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold text-zinc-700">收件箱已整理完毕</div>
            <div>所有待办均已分配责任人并转入看板，暂无遗留事项</div>
          </div>
        ) : (
          <div className="space-y-2">
            {unorganizedList.map((item, index) => {
              const itemKey = `${item.parentId}-${item.subIdx}`;
              const assigned = stagedOwners[itemKey] || (item.owner !== '待确认' && item.owner !== '缺少待办人' ? item.owner : null);
              const isMenuOpen = activeAssignMenu?.itemId === item.parentId && activeAssignMenu?.subIdx === item.subIdx;

              return (
                <div
                  key={itemKey}
                  className="rounded-2xl border border-black/[0.06] hover:border-black/15 bg-white px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all group"
                >
                  {/* Left Side: Sequence Number + Title (Image 3 Style: "1. 事项名称...") */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-zinc-400 font-mono text-xs font-semibold shrink-0">
                      {index + 1}.
                    </span>
                    <span className="text-xs font-semibold text-zinc-900 truncate">
                      {item.title}
                    </span>
                  </div>

                  {/* Right Side: Owner Status + Date + Quick Actions (Image 3 Style: "缺少待办人 · 2026-10-12") */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    {/* Owner & Date block */}
                    <div className="flex items-center gap-2 text-xs font-mono">
                      {!assigned ? (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              if (isMenuOpen) {
                                setActiveAssignMenu(null);
                              } else {
                                setActiveAssignMenu({ itemId: item.parentId, subIdx: item.subIdx });
                              }
                            }}
                            className="text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs"
                            title="点击选择并指定待办人"
                          >
                            <UserX className="w-3.5 h-3.5 text-amber-600" />
                            <span>缺少待办人</span>
                            <ChevronDown className="w-3 h-3 text-amber-600" />
                          </button>

                          {/* Quick Member Selector Popover */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-black/[0.08] p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                              <div className="text-[10px] font-bold text-zinc-400 px-2 py-1 uppercase tracking-wider border-b border-black/[0.04] mb-1">
                                选择待办人
                              </div>
                              <div className="space-y-0.5">
                                {teamMembers.map((member) => (
                                  <button
                                    key={member}
                                    type="button"
                                    onClick={() => {
                                      setStagedOwners((prev) => ({ ...prev, [itemKey]: member }));
                                      setActiveAssignMenu(null);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-800 hover:bg-zinc-100 flex items-center justify-between transition-colors"
                                  >
                                    <span>{member}</span>
                                    <span className="text-[10px] text-zinc-400">指派</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveAssignMenu(isMenuOpen ? null : { itemId: item.parentId, subIdx: item.subIdx })}
                            className="text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-black/[0.06] px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs"
                            title="点击更换待办人"
                          >
                            <User className="w-3.5 h-3.5 text-zinc-600" />
                            <span>{assigned}</span>
                            <ChevronDown className="w-3 h-3 text-zinc-400" />
                          </button>

                          {/* Quick Member Selector Popover */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-black/[0.08] p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                              <div className="text-[10px] font-bold text-zinc-400 px-2 py-1 uppercase tracking-wider border-b border-black/[0.04] mb-1">
                                更换待办人
                              </div>
                              <div className="space-y-0.5">
                                {teamMembers.map((member) => (
                                  <button
                                    key={member}
                                    type="button"
                                    onClick={() => {
                                      setStagedOwners((prev) => ({ ...prev, [itemKey]: member }));
                                      setActiveAssignMenu(null);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-800 hover:bg-zinc-100 flex items-center justify-between transition-colors"
                                  >
                                    <span>{member}</span>
                                    {assigned === member && <Check className="w-3 h-3 text-emerald-600" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <span className="text-zinc-300">·</span>

                      <span className="text-zinc-400 text-xs">
                        {item.deadline}
                      </span>
                    </div>

                    {/* Quick Convert Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const finalOwner = assigned || '何星';
                        onConvertToAction({
                          title: item.title,
                          owner: finalOwner,
                          deadline: item.deadline,
                          description: item.standard || '从收件箱整理转入',
                          projectName: '数智化服务平台',
                          projectId: 'proj-1',
                        });

                        const parent = inboxItems.find((it) => it.id === item.parentId);
                        if (!parent) return;
                        const remaining = parent.extractedItems.filter((_, i) => i !== item.subIdx);
                        if (remaining.length === 0) {
                          onDeleteInboxItem(item.parentId);
                        } else if (onUpdateInboxItem) {
                          onUpdateInboxItem({
                            ...parent,
                            extractedItems: remaining,
                          });
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs ${
                        assigned
                          ? 'bg-zinc-950 text-white hover:bg-black'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <span>转入看板</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {/* Quick Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        const parent = inboxItems.find((it) => it.id === item.parentId);
                        if (!parent) return;
                        const remaining = parent.extractedItems.filter((_, i) => i !== item.subIdx);
                        if (remaining.length === 0) {
                          onDeleteInboxItem(item.parentId);
                        } else if (onUpdateInboxItem) {
                          onUpdateInboxItem({
                            ...parent,
                            extractedItems: remaining,
                          });
                        }
                      }}
                      className="p-1 text-zinc-300 hover:text-rose-500 rounded transition-colors"
                      title="忽略或删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
