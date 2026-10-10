import React, { useState } from 'react';
import { ActionItem, UrgeRecord } from '../types';
import { X, Send, Copy, Check, MessageSquare, AlertCircle, ChevronDown } from 'lucide-react';

interface UrgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: ActionItem[];
  onSendUrge: (record: UrgeRecord) => void;
}

export const UrgeModal: React.FC<UrgeModalProps> = ({
  isOpen,
  onClose,
  actions,
  onSendUrge,
}) => {
  if (!isOpen || actions.length === 0) return null;

  const defaultRecipient = actions[0].owner !== '待确认' ? actions[0].owner : '相关责任人';
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [channel, setChannel] = useState<'企业微信' | '邮件' | '短信'>('企业微信');
  const [tone, setTone] = useState<'polite' | 'urgent' | 'meeting'>('polite');
  const [copied, setCopied] = useState(false);

  const getTemplate = () => {
    const titles = actions.map((a) => `• 【${a.projectName}】${a.title} (截止: ${a.deadline})`).join('\n');
    if (tone === 'urgent') {
      return `${recipient}老师您好，打扰了！以下事项已临近/超出截止时限，系统显示当前存在跟进卡点，请您抽空推进或同步最新进展，非常感谢配合：\n${titles}\n如需协同支持请随时同步！`;
    }
    if (tone === 'meeting') {
      return `${recipient}老师好，下次例会即将召开，需向管理层汇报以下重点专项进展，请您在此之前对齐下当前交付状态：\n${titles}\n辛苦了！`;
    }
    return `${recipient}老师您好，温馨提醒以下推进事项：\n${titles}\n目前进展如何？若有阻塞或需协调资源，随时沟通同步，祝工作顺利！`;
  };

  const [message, setMessage] = useState(getTemplate());

  const handleToneChange = (newTone: 'polite' | 'urgent' | 'meeting') => {
    setTone(newTone);
    const titles = actions.map((a) => `• 【${a.projectName}】${a.title} (截止: ${a.deadline})`).join('\n');
    if (newTone === 'urgent') {
      setMessage(`${recipient}老师您好，打扰了！以下事项已临近/超出截止时限，系统显示当前存在跟进卡点，请您抽空推进或同步最新进展，非常感谢配合：\n${titles}\n如需协同支持请随时同步！`);
    } else if (newTone === 'meeting') {
      setMessage(`${recipient}老师好，下次例会即将召开，需向管理层汇报以下重点专项进展，请您在此之前对齐下当前交付状态：\n${titles}\n辛苦了！`);
    } else {
      setMessage(`${recipient}老师您好，温馨提醒以下推进事项：\n${titles}\n目前进展如何？若有阻塞或需协调资源，随时沟通同步，祝工作顺利！`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    const record: UrgeRecord = {
      id: `urge-${Date.now()}`,
      timestamp: '2026年10月10日 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recipient,
      actionIds: actions.map((a) => a.id),
      actionTitles: actions.map((a) => a.title),
      message,
      channel,
    };
    onSendUrge(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-black/[0.08] z-10 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                {actions.length > 1 ? `合并催办 (${actions.length} 项)` : '发起事项催办'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                自动生成针对性督办催办话术并沉淀跟进历史
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

        {/* Content */}
        <div className="my-4 space-y-3.5">
          {/* Recipient & Channel */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                催办跟进对象
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full text-xs font-medium text-zinc-800 bg-white border border-black/[0.1] rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                推送渠道
              </label>
              <div className="relative flex items-center">
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full appearance-none text-xs font-medium text-zinc-800 bg-white border border-black/[0.1] hover:border-black/20 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-zinc-900 shadow-2xs cursor-pointer transition-all"
                >
                  <option value="企业微信">企业微信 DM / 群通知</option>
                  <option value="邮件">邮件提醒</option>
                  <option value="短信">紧急短信</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              话术基调
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleToneChange('polite')}
                className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tone === 'polite'
                    ? 'bg-zinc-900 text-white shadow-2xs font-semibold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                温和日常提醒
              </button>
              <button
                type="button"
                onClick={() => handleToneChange('meeting')}
                className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tone === 'meeting'
                    ? 'bg-zinc-900 text-white shadow-2xs font-semibold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                例会前对齐
              </button>
              <button
                type="button"
                onClick={() => handleToneChange('urgent')}
                className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tone === 'urgent'
                    ? 'bg-rose-600 text-white shadow-2xs font-semibold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                逾期紧迫跟催
              </button>
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-700">
                催办消息正文
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? '已复制话术' : '复制话术'}</span>
              </button>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl bg-zinc-50 border border-black/[0.08] focus:bg-white focus:outline-none focus:border-zinc-900 resize-none h-32 leading-relaxed"
            />
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
            onClick={handleSend}
            className="px-5 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition-all shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-indigo-300" />
            <span>确认发送并记录</span>
          </button>
        </div>
      </div>
    </div>
  );
};
