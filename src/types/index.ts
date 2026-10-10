export type Priority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';

export type ActionStatus = '进行中' | '待确认' | '阻塞' | '已完成' | '已取消';

export type RiskLevel = 'normal' | 'overdue' | 'blocked' | 'warning';

export type SourceType = '会议' | '企业微信' | '钉钉' | '邮件' | 'Excel' | '口头' | '临时事项';

export type CardColorTheme = 'indigo' | 'amber' | 'rose' | 'emerald' | 'cyan' | 'purple';

export interface TimelineEntry {
  id: string;
  time: string;
  type: 'create' | 'progress' | 'urge' | 'status' | 'comment';
  user: string;
  text: string;
}

export interface ActionItem {
  id: string; // e.g. "AC-000037"
  code: string; // e.g. "302" or "037"
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  owner: string; // e.g. "待确认", "段孝义", "何星"
  waitingFor: string; // e.g. "—", "王鹏", "李毅豪"
  status: ActionStatus;
  priority: Priority;
  deadline: string; // "2026-10-12"
  nextFollowUp: string; // "2026-10-10" or "待确认"
  overdueDays?: number; // e.g. 10
  source: {
    type: SourceType;
    name: string;
    url?: string;
    rowNumber?: number;
  };
  latestProgress?: string;
  timeline: TimelineEntry[];
  urgencyCount?: number;
  completedAt?: string;
  cancelledAt?: string;
  colorTheme: CardColorTheme;
  participantsCount?: number;
}

export interface Project {
  id: string;
  code: string; // "001"
  name: string;
  description: string;
  status: '进行中' | '已完成' | '规划中';
  lead: string;
  colorTheme: CardColorTheme;
  totalActions: number;
  completedActions: number;
}

export interface InboxItem {
  id: string;
  entryDate: string; // "2026年10月10日"
  rawText: string;
  sourceType: SourceType;
  sourceName: string;
  sourceUrl?: string;
  status: '待整理' | '已解析' | '已转事项';
  extractedItems: Array<{
    title: string;
    owner: string;
    waitingFor?: string;
    deadline: string;
    standard?: string;
    priority?: Priority;
  }>;
}

export interface UrgeRecord {
  id: string;
  timestamp: string;
  recipient: string;
  actionIds: string[];
  actionTitles: string[];
  message: string;
  channel: '企业微信' | '邮件' | '短信';
}

export interface AiUsageLog {
  id: string;
  timestamp: string;
  action: string;
  tokens: number;
  cost: number;
}

export interface AiQuotaInfo {
  total: number; // e.g. 5.00
  used: number; // e.g. 0.72
  remaining: number; // e.g. 4.28
  currency: string;
  resetDate: string; // e.g. "2026-11-01"
  modelName?: string;
  logs: AiUsageLog[];
}
