
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export type ChatState = 'welcome' | 'chatting' | 'history' | 'faq';

export interface QuickAction {
  label: string;
  message?: string;
  action?: () => void;
}
