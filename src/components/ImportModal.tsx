import React, { useState } from 'react';
import { Project, InboxItem } from '../types';
import { X, Upload, FileSpreadsheet, Check, Sparkles, ChevronDown } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onImportSuccess: (inboxItem: InboxItem) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  projects,
  onImportSuccess,
}) => {
  if (!isOpen) return null;

  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [fileName, setFileName] = useState<string>('Book1.xlsx');
  const [isDemoLoaded, setIsDemoLoaded] = useState(true);

  const sampleRows = [
    { row: 1, title: '段老师核实D365渠道被修改为“离职”状态的原因', owner: '段孝义', waitingFor: '—', deadline: '2026-10-09', progress: '核实配置回退' },
    { row: 2, title: '同步“引流到深小服”的问题解决率', owner: '王鹏', waitingFor: '—', deadline: '2026-09-30', progress: '输出数据看板' },
    { row: 3, title: '同步AIOps试点阶段性结论', owner: '待确认', waitingFor: '王鹏', deadline: '2026-10-12', progress: 'Case分析PPT初稿' },
    { row: 4, title: '分类数据分析QA机器人差距以及后续计划', owner: '待确认', waitingFor: '—', deadline: '2026-10-12', progress: '分析渠道转人工问题' },
    { row: 5, title: '完成Solvia首选率新统计口径报表', owner: '郑毅', waitingFor: '—', deadline: '2026-10-12', progress: '海外报表平台更新' },
    { row: 6, title: '明确AIOps端到端里程碑', owner: '何星、谭资昌', waitingFor: '—', deadline: '2026-09-30', progress: '拆解效果目标' },
    { row: 7, title: '评估服务号切换公账号的可行性', owner: '待确认', waitingFor: 'IT运维组', deadline: '2026-10-12', progress: 'IT服务依赖排查' },
    { row: 8, title: '推进知识同步问题解决', owner: '待确认', waitingFor: '—', deadline: '2026-10-12', progress: '路径知识拼接方案' },
  ];

  const handleConfirmImport = () => {
    const newInboxItem: InboxItem = {
      id: `inbox-${Date.now()}`,
      entryDate: '2026年10月10日',
      sourceType: 'Excel',
      sourceName: fileName || '导入数据.xlsx',
      status: '待整理',
      rawText: sampleRows.map((r) => `第 ${r.row} 行: 待办: ${r.title} · 责任人: ${r.owner} · 截止: ${r.deadline} · 进展: ${r.progress}`).join('\n'),
      extractedItems: sampleRows.map((r) => ({
        title: r.title,
        owner: r.owner,
        waitingFor: r.waitingFor,
        deadline: r.deadline,
        standard: r.progress,
        priority: 'HIGH',
      })),
    };

    onImportSuccess(newInboxItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-black/[0.08] z-10 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                导入 Excel / CSV
              </h3>
              <p className="text-[11px] text-zinc-400">
                批量解析待办并同步生成收件箱待整理建议
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

        {/* Instruction Note */}
        <div className="my-4 p-3.5 bg-zinc-50 rounded-2xl border border-black/[0.04] text-xs text-zinc-600 leading-relaxed space-y-1.5">
          <p className="font-medium text-zinc-800">
            首行表头：事项、责任人、等待对象、截止时间、最新进展。
          </p>
          <p className="text-zinc-500 text-[11px]">
            每次最多 50 行、1MB；XLSX 读取首张工作表，公式请先转换成值。导入只生成 Inbox 建议，核对确认后才创建正式事项。日期建议使用 YYYY-MM-DD 文本。
          </p>
        </div>

        {/* Project Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            选择所属专项
          </label>
          <div className="relative flex items-center">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full appearance-none text-xs font-medium text-zinc-800 bg-white hover:bg-zinc-50 border border-black/[0.1] hover:border-black/20 rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-zinc-900 cursor-pointer shadow-2xs transition-all"
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name} ({proj.lead})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* File Dropzone */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            数据文件
          </label>
          <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl p-4 text-center bg-zinc-50/50 hover:bg-zinc-50 transition-all cursor-pointer">
            <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
            <div className="text-xs font-medium text-zinc-800">
              {fileName ? fileName : '点击选择或拖拽 Excel / CSV 文件至此处'}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              支持 .xlsx, .xls, .csv 格式 (已就绪样例)
            </p>
          </div>
        </div>

        {/* Preview of rows */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-700">
              已读取预览 ({sampleRows.length} 条待办事项)
            </span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> 表头格式校验通过
            </span>
          </div>

          <div className="max-h-40 overflow-y-auto rounded-xl border border-black/[0.06] bg-zinc-50/60 p-2 text-[11px] space-y-1.5 font-mono">
            {sampleRows.map((r) => {
              const isMissingOwner = !r.owner || r.owner === '待确认' || r.owner === '缺少待办人';
              return (
                <div key={r.row} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-black/[0.03]">
                  <div className="flex items-center gap-2 truncate max-w-[320px]">
                    <span className="text-zinc-400 font-mono text-[10px]">{r.row}.</span>
                    <span className="font-sans text-zinc-800 truncate">
                      {r.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isMissingOwner ? (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-sans border border-amber-200/50">
                        缺少待办人 · 进待整理
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-sans border border-emerald-200/50">
                        {r.owner} · 直接录入
                      </span>
                    )}
                    <span className="text-zinc-400 text-[10px]">{r.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-black/[0.1] text-zinc-700 text-xs font-medium hover:bg-zinc-100 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirmImport}
            className="px-5 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>确认导入并进入 Inbox 整理</span>
          </button>
        </div>
      </div>
    </div>
  );
};
