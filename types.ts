
export enum Sender {
  USER = 'user',
  AI = 'ai'
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
}

export type UserBackground = 'Student' | 'Working Professional' | 'Homemaker' | 'Entrepreneur' | 'Career Break';
