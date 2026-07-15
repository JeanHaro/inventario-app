export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
}
