
import { useState, useEffect } from 'react';
import WelcomeScreenWidget from './WelcomeScreenWidget';
import ChatWindow from './ChatWindow';
import NavigationBar from './NavigationBar';
import { Message, ChatState } from '@/types/chat';
import { useVapi } from '@/hooks/useVapi';

const ChatInterface = () => {
  const [chatState, setChatState] = useState<ChatState>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = 'c24b5ae5-acc4-446a-a601-f590170aba94';
  const assistantId = '12cc6bfb-754c-4e26-b827-7efef7e15f9e';
  const { isConnected, isSpeaking, startCall, stopCall, transcript, clearTranscript } = useVapi(apiKey, assistantId);

  const startChat = (initialMessage?: string) => {
    setChatState('chatting');
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const response = await fetch('https://identityforgestudio.app.n8n.cloud/webhook/64fb26db-35c6-40f1-bcd1-79354f3b0bd8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply || 'Sorry, I couldn\'t understand that.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Oops! Something went wrong. Try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const goHome = () => {
    setChatState('welcome');
  };

  const startNewChat = () => {
    setMessages([]);
    clearTranscript();
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        {chatState === 'welcome' ? (
          <div className="h-full flex flex-col">
            <div className="h-full flex-1 overflow-y-auto scrollbar-hide">
              <WelcomeScreenWidget onStartChat={startChat} />
            </div>
            {/* Navigation Bar only on welcome screen */}
            <div className="flex-shrink-0">
              <NavigationBar currentView={chatState} onNavigate={setChatState} />
            </div>
          </div>
        ) : (
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onGoHome={goHome}
            onNewChat={startNewChat}
            isConnected={isConnected}
            transcript={transcript}
            startCall={startCall}
            stopCall={stopCall}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
