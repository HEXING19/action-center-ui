import React from 'react';
import { X, Sparkles, Zap, Clock } from 'lucide-react';
import { AiQuotaInfo } from '../types';

interface AiQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  quota: AiQuotaInfo;
}

export const AiQuotaModal: React.FC<AiQuotaModalProps> = ({
  isOpen,
  onClose,
  quota,
}) => {
  if (!isOpen) return null;

  const percentRemaining = Math.max(0, Math.min(100, (quota.remaining / quota.total) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-[28px] border border-black/[0.08] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-black/[0.05] flex items-center justify-between bg-[#FAFBFD]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                大模型月度免费额度
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  生效中
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                平台每月自动提供 $5.00 免费额度
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Quota Display Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-5 text-white shadow-sm relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between text-xs text-zinc-400 pb-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  当前剩余额度
                </span>
                <span className="font-mono text-zinc-300">
                  重置日：{quota.resetDate}
                </span>
              </div>

              <div className="flex items-baseline gap-3 my-2">
                <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
                  ${quota.remaining.toFixed(2)}
                </span>
                <span className="text-sm text-zinc-400 font-medium">
                  / ${quota.total.toFixed(2)} 每月
                </span>
                <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/10">
                  剩余 {percentRemaining.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 mb-2">
                <div className="h-2 w-full bg-white/15 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentRemaining > 30
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                        : percentRemaining > 10
                        ? 'bg-gradient-to-r from-amber-400 to-amber-300'
                        : 'bg-gradient-to-r from-rose-500 to-rose-400'
                    }`}
                    style={{ width: `${percentRemaining}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 mt-2 border-t border-white/10 text-center">
                <div>
                  <div className="text-[10px] text-zinc-400">月度免费额度</div>
                  <div className="text-xs font-bold font-mono text-zinc-200 mt-0.5">
                    ${quota.total.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">本月已消耗</div>
                  <div className="text-xs font-bold font-mono text-zinc-200 mt-0.5">
                    ${quota.used.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Usage Logs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                用量明细 ({quota.logs.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {quota.logs.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-400 bg-zinc-50 rounded-xl">
                  暂无调用记录
                </div>
              ) : (
                quota.logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-black/[0.05] hover:border-black/10 transition-colors text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-zinc-800">
                        {log.action}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                        <span>{log.timestamp}</span>
                        <span>·</span>
                        <span className="font-mono">约 {log.tokens.toLocaleString()} tokens</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[11px]">
                        -${log.cost.toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-black/[0.05] bg-[#FAFBFD] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-zinc-950 hover:bg-black text-white text-xs font-semibold transition-all shadow-sm"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
