import { useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Plus } from 'lucide-react';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import LoadingAnimation from './LoadingAnimation';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onGoHome: () => void;
  onNewChat: () => void;
  isConnected: boolean;
  transcript: { role: string; text: string; timestamp: number }[];
  startCall: () => void;
  stopCall: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onGoHome,
  onNewChat,
  isConnected,
  transcript,
  startCall,
  stopCall,
}) => {
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, transcript]);

  // Clean and normalize text
  const cleanText = (text: string): string => {
    if (!text) return '';
    
    let cleaned = text.trim();
    
    // Remove excessive repetitions of words
    cleaned = cleaned.replace(/\b(\w+)(\s+\1\b)+/gi, '$1');
    
    // Remove repeated phrases (up to 5 words)
    cleaned = cleaned.replace(/\b(\w+(?:\s+\w+){0,4})\s+\1\b/gi, '$1');
    
    // Clean up multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    // Remove stuttering patterns like "or or" "uh uh"
    cleaned = cleaned.replace(/\b(\w{1,3})\s+\1\b/gi, '$1');
    
    // Clean up common speech patterns
    cleaned = cleaned.replace(/\b(uh|um|ah)\s+/gi, '');
    cleaned = cleaned.replace(/\s+,/g, ',');
    cleaned = cleaned.replace(/\s+\./g, '.');
    
    return cleaned.trim();
  };

  // Check if text is likely a continuation/update of previous text
  const isTextContinuation = (newText: string, previousText: string): boolean => {
    if (!previousText || !newText) return false;
    
    const cleanNew = newText.toLowerCase().trim();
    const cleanPrev = previousText.toLowerCase().trim();
    
    // If new text starts with previous text, it's likely a continuation
    if (cleanNew.startsWith(cleanPrev) && cleanNew.length > cleanPrev.length) {
      return true;
    }
    
    // If previous text starts with new text, new text might be incomplete
    if (cleanPrev.startsWith(cleanNew) && cleanPrev.length > cleanNew.length) {
      return false; // Keep the longer previous text
    }
    
    return false;
  };

  const mergeTranscript = (): Message[] => {
    if (!transcript || transcript.length === 0) return [];

    const merged: Message[] = [];
    const processedTexts = new Set<string>();
    let messageId = 0;
    const TIME_THRESHOLD = 3000; // 3 seconds for same speaker
    const COMPLETION_THRESHOLD = 1500; // 1.5 seconds to consider message complete

    // Group transcript by speaker and time
    const groups: Array<{
      role: string;
      texts: string[];
      timestamps: number[];
      startTime: number;
      endTime: number;
    }> = [];

    let currentGroup: any = null;

    transcript.forEach((msg) => {
      const cleanedText = cleanText(msg.text);
      if (!cleanedText) return;

      const shouldStartNewGroup = !currentGroup || 
        currentGroup.role !== msg.role || 
        msg.timestamp - currentGroup.endTime > TIME_THRESHOLD;

      if (shouldStartNewGroup) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          role: msg.role,
          texts: [cleanedText],
          timestamps: [msg.timestamp],
          startTime: msg.timestamp,
          endTime: msg.timestamp
        };
      } else {
        // Check if this is a continuation or update
        const lastText = currentGroup.texts[currentGroup.texts.length - 1];
        
        if (isTextContinuation(cleanedText, lastText)) {
          // Replace the last text with the continuation
          currentGroup.texts[currentGroup.texts.length - 1] = cleanedText;
          currentGroup.timestamps[currentGroup.timestamps.length - 1] = msg.timestamp;
        } else if (!isTextContinuation(lastText, cleanedText)) {
          // Add as new text only if it's not a shorter version of existing text
          const isDuplicate = currentGroup.texts.some((existingText: string) => {
            const similarity = calculateSimilarity(cleanedText.toLowerCase(), existingText.toLowerCase());
            return similarity > 0.85;
          });
          
          if (!isDuplicate) {
            currentGroup.texts.push(cleanedText);
            currentGroup.timestamps.push(msg.timestamp);
          }
        }
        
        currentGroup.endTime = msg.timestamp;
      }
    });

    // Don't forget the last group
    if (currentGroup) {
      groups.push(currentGroup);
    }

    // Convert groups to messages
    groups.forEach((group) => {
      // Combine texts intelligently
      let finalText = '';
      
      if (group.texts.length === 1) {
        finalText = group.texts[0];
      } else {
        // For multiple texts, take the longest complete-sounding one
        // or combine if they seem to be building on each other
        const sortedByLength = [...group.texts].sort((a, b) => b.length - a.length);
        finalText = sortedByLength[0];
        
        // Check if we should combine multiple parts
        if (group.texts.length > 1) {
          const combined = group.texts.join(' ');
          const cleanedCombined = cleanText(combined);
          
          // Use combined version if it's significantly longer and makes sense
          if (cleanedCombined.length > finalText.length * 1.2) {
            finalText = cleanedCombined;
          }
        }
      }

      finalText = cleanText(finalText);
      
      if (finalText && finalText.length > 2 && !processedTexts.has(finalText.toLowerCase())) {
        merged.push({
          id: `transcript-${messageId++}`,
          content: finalText,
          sender: group.role === 'user' ? 'user' : 'bot',
          timestamp: new Date(group.startTime),
        });
        processedTexts.add(finalText.toLowerCase());
      }
    });

    return merged;
  };

  // Helper function to calculate text similarity
  const calculateSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;

    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1;

    // Simple similarity based on common words
    const words1 = longer.split(' ');
    const words2 = shorter.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  const transcriptMessages = mergeTranscript();
  
  // Final deduplication with existing messages
  const existingContents = new Set(
    messages.map(msg => cleanText(msg.content).toLowerCase())
  );
  
  const filteredTranscriptMessages = transcriptMessages.filter(transcriptMsg => {
    const cleanedContent = cleanText(transcriptMsg.content).toLowerCase();
    return !existingContents.has(cleanedContent) && cleanedContent.length > 2;
  });

  const allMessages = [...messages, ...filteredTranscriptMessages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  return (
    <div className="h-full flex flex-col">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-plum-500/20 to-plum-600/20 backdrop-blur-sm border-b border-plum-300/30 p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={onGoHome} className="p-1.5 rounded-full hover:bg-plum-500/30 transition-colors mr-2 transform hover:scale-110 font-weight-300">
              <ArrowLeft className="w-4 h-4 text-[#5c108a]" />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 shadow-md bg-white">
                <img src={theme.logoUrl} alt={theme.brandName} className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-[#5c108a] font-medium text-xs">{theme.brandName}</h2>
                <p className="text-[#5c108a]/80 text-xs">Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            
            <button
              onClick={onNewChat}
              className="flex items-center px-3 py-1.5 bg-gradient-to-r from-[#5c108a] to-[#3d0a5c] hover:from-[#3d0a5c] hover:to-[#2a0640] border border-[#5c108a]/50 rounded-lg transition-all duration-300 text-white1 text-xs hover:scale-105 shadow-sm hover:shadow-md font-weight-300"
            >
              <Plus className="w-3 h-3 mr-1" />
              New chat
            </button>
          </div>
        </div>
      </div>

      {/* Compact Message Area */}
      <div className="flex-1 relative h-full overflow-y-auto p-3 space-y-3 scrollbar-hide">
        {allMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-2 shadow-md bg-white mb-2">
              <img src={theme.logoUrl} alt={theme.brandName} className="w-full h-full object-cover" />
            </div>
            <p className="text-purple-700 text-xs">Start a conversation by typing a message below</p>
          </div>
        ) : (
          <>
            {allMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <LoadingAnimation />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        <MessageInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
          isConnected={isConnected}
          startCall={startCall}
          stopCall={stopCall}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
