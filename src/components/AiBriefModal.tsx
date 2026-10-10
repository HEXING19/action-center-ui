import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Download, Share2 } from 'lucide-react';
import { ActionItem, Project } from '../types';

interface AiBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'daily_brief' | 'project_review';
  actions: ActionItem[];
  project?: Project;
}

export const AiBriefModal: React.FC<AiBriefModalProps> = ({
  isOpen,
  onClose,
  type,
  actions,
  project,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const generateContent = () => {
    if (type === 'daily_brief') {
      const overdue = actions.filter((a) => a.overdueDays);
      const todayDue = actions.filter((a) => a.deadline === '2026-10-10' || a.nextFollowUp === '2026-10-10');
      const inProgress = actions.filter((a) => a.status === '进行中');

      return `📋 【Action Center 今日推进 Brief】
日期：2026年10月10日
负责人：何星 (工作空间)

一、🚨 核心风险与逾期预警 (${overdue.length} 项)
${overdue.map((a) => `• [${a.projectName}] ${a.title} (责任人: ${a.owner} / 已逾期 ${a.overdueDays} 天)\n  建议策略：跟进最新验证排期，确认阻塞因素。`).join('\n') || '• 今日暂无严重逾期事项，推进正常。'}

二、🎯 今日重点盯防与跟进 (${todayDue.length} 项)
${todayDue.map((a) => `• [${a.projectName}] ${a.title} (责任人: ${a.owner} / 等待: ${a.waitingFor})\n  进展备注：${a.latestProgress || '待例会同步'}`).join('\n') || '• 今日无临界交付事项，按既定排期推进。'}

三、📊 进行中重点专项协同 (${inProgress.length} 项)
${inProgress.map((a) => `• ${a.title} (责任人: ${a.owner})`).join('\n')}

四、💡 推进建议
1. 优先对 32环境流量灰度验证 (AC-000045) 及 推文确认 发起催办对齐。
2. 提醒王鹏在 10月12日 前输出 AIOps 试点阶段性分析报告。`;
    }

    if (type === 'project_review') {
      const projName = project?.name || '数智化服务平台';
      const projActions = actions.filter((a) => a.projectName === projName);
      return `📊 【专项进展会议 Review 简报】
专项名称：${projName} (编号: ${project?.code || '001'})
专项负责人：${project?.lead || '何星'}
统计周期：2026年10月第2周

一、事项大盘总览
• 事项总数：${projActions.length} 项
• 进行中：${projActions.filter((a) => a.status === '进行中').length} 项
• 待开始/待确认：${projActions.filter((a) => a.status === '待开始').length} 项
• 逾期预警：${projActions.filter((a) => a.overdueDays).length} 项

二、核心推进卡点及决议事项
${projActions.slice(0, 3).map((a, i) => `${i + 1}. ${a.title}
   - 当前责任人: ${a.owner} / 等待: ${a.waitingFor}
   - 最新进展: ${a.latestProgress || '待例会确定'}
   - 会议决议建议: 明确验收标准与上线时间点。`).join('\n\n')}

三、下周交付承诺
• 10月12日完成Solvia首选率新统计口径离线报表及海外图片TTFT压测。`;
    }

        return '';
  };

  const briefText = generateContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTitle = () => {
    if (type === 'daily_brief') return '今日推进 Brief (Daily Brief)';
    return '生成会议 Review 报告';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-black/[0.08] z-10 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                {getTitle()}
              </h3>
              <p className="text-[11px] text-zinc-400">
                基于全量事项状态、风险点与截止时间自动提炼
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Box */}
        <div className="my-4">
          <div className="relative rounded-2xl bg-zinc-50 border border-black/[0.06] p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap text-zinc-800 max-h-96 overflow-y-auto">
            {briefText}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
          <span className="text-[11px] text-zinc-400">
            生成时间：2026/10/10 09:30 · 随时一键同步到例会或企微群
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-black/[0.1] text-zinc-700 text-xs font-medium hover:bg-zinc-100 transition-colors"
            >
              关闭
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all shadow-sm flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制到剪贴板' : '复制简报内容'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
