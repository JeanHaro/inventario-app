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

export type AiContentBlock = | { type: 'text', text: string } | { type: 'image', imageBase64: string };

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string | AiContentBlock[];
}

export interface AiChatResponse {
  role: 'assistant';
  content: string;
}
