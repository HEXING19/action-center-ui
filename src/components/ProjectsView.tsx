import React, { useState } from 'react';
import { Project, ActionItem } from '../types';
import { ActionCardPastel } from './ActionCardPastel';
import { 
  Plus, 
  Users, 
  Sparkles, 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  actions: ActionItem[];
  onSelectAction: (action: ActionItem) => void;
  onUrgeAction: (action: ActionItem) => void;
  onGenerateProjectReview: (project: Project) => void;
  onCreateActionForProject: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  actions,
  onSelectAction,
  onUrgeAction,
  onGenerateProjectReview,
  onCreateActionForProject,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [showMemberModal, setShowMemberModal] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectActions = actions.filter((a) => a.projectId === selectedProjectId);

  const completedCount = projectActions.filter((a) => a.status === '已完成').length;
  const inProgressCount = projectActions.filter((a) => a.status === '进行中').length;
  const overdueCount = projectActions.filter((a) => !!a.overdueDays).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Projects
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            按专项查看事项，掌握整体推进情况
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMemberModal(true)}
            className="px-3.5 py-1.5 rounded-full border border-black/[0.1] bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-zinc-500" />
            <span>管理人员</span>
          </button>

          <button
            type="button"
            onClick={() => onCreateActionForProject(selectedProjectId)}
            className="px-4 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建专项</span>
          </button>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const isSelected = proj.id === selectedProjectId;
          const count = actions.filter((a) => a.projectId === proj.id).length;

          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`rounded-3xl border p-5 cursor-pointer transition-all duration-200 shadow-2xs ${
                isSelected
                  ? 'bg-white border-zinc-900 shadow-md ring-1 ring-zinc-900'
                  : 'bg-white/80 border-black/[0.06] hover:bg-white hover:border-black/[0.12]'
              }`}
            >
              {/* Top row */}
              <div className="flex items-center justify-end mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {proj.status}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-base font-bold text-zinc-900 mb-1">
                {proj.name}
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                {proj.description}
              </p>

              {/* Meta & Stats */}
              <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-black/[0.04] pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">负责人:</span>
                  <span className="font-semibold text-zinc-800">{proj.lead}</span>
                </div>
                <div className="font-mono tabular-nums text-zinc-700 font-semibold">
                  {count} 项事项
                </div>
              </div>

              {/* Action row */}
              <div className="mt-3 flex items-center gap-2 pt-1">
                <button
                  type="button"
                  className={`w-full py-1.5 rounded-full text-xs font-semibold transition-all text-center ${
                    isSelected
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {isSelected ? '正在查看' : '查看事项'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Actions List Section */}
      <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.05]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-900">
                {selectedProject.name} · 专项事项
              </h3>
              <span className="text-xs font-semibold text-zinc-400 font-mono">
                ({projectActions.length} 项)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              已完成 {completedCount} · 进行中 {inProgressCount} · 逾期 {overdueCount}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onGenerateProjectReview(selectedProject)}
              className="px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>生成会议 Review</span>
            </button>
          </div>
        </div>

        {/* Project Actions Grid (Image 8 Pastel Style) */}
        {projectActions.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs">
            该专项下暂无任何事项，可点击右上角新建事项
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {projectActions.map((action) => (
              <ActionCardPastel
                key={action.id}
                action={action}
                onClick={onSelectAction}
                onUrge={onUrgeAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Member Management Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setShowMemberModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-black/[0.08] z-10 space-y-4 animate-in zoom-in-95 duration-150">
            <h4 className="text-base font-bold text-zinc-900">
              工作空间人员与干系人
            </h4>
            <div className="divide-y divide-black/[0.05] text-xs">
              {[
                { name: '何星', role: '平台负责人 / Owner', email: 'hexing018@gmail.com' },
                { name: '王鹏', role: 'AIOps与算法负责人', email: 'wangpeng@company.com' },
                { name: '段孝义', role: '架构与渠道技术骨干', email: 'duanxiaoyi@company.com' },
                { name: '郑毅', role: '海外知识运营负责人', email: 'zhengyi@company.com' },
                { name: '黄祥红', role: '企业服务渠道打通负责人', email: 'huangxianghong@company.com' },
                { name: '李毅豪', role: 'Solvia性能与图片优化', email: 'liyihao@company.com' },
              ].map((m) => (
                <div key={m.name} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-zinc-900">{m.name}</div>
                    <div className="text-[11px] text-zinc-400">{m.email}</div>
                  </div>
                  <span className="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-medium">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowMemberModal(false)}
              className="w-full py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
