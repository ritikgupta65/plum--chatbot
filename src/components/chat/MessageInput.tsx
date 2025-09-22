import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Send, Phone, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isConnected: boolean;
  startCall: () => void;
  stopCall: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled,
  isConnected,
  startCall,
  stopCall,
}) => {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCallClick = () => {
    if (isConnected) {
      stopCall();
    } else {
      startCall();
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onSendMessage(
          `<img src="${base64}" alt="uploaded" class="max-w-[100px] max-h-[100px] rounded-lg" />`
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="p-3 bg-[#b386d4]/80 backdrop-blur-md border-t border-[#5c108a]/30">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={disabled}
            className="w-full p-3 pr-28 bg-gradient-to-r from-[#5c108a]/20 to-[#4a0d70]/20 backdrop-blur-md border border-[#5c108a]/30 rounded-lg text-[#5c108a] placeholder-[#5c108a]/60 resize-none focus:outline-none focus:ring-2 focus:ring-[#5c108a]/50 focus:border-[#5c108a]/50 transition-all duration-200 min-h-[48px] max-h-24 scrollbar-hide shadow-sm"
            rows={1}
          />

          {/* Compact Buttons inside the input */}
          <div className="absolute right-1.5 bottom-1.5 flex items-center space-x-1.5">
            <button
              type="button"
              onClick={handleCallClick}
              className={`p-2 rounded-full border transition-all duration-300 hover:scale-110 shadow-sm ${
                isConnected
                  ? 'bg-red-500 hover:bg-red-600 border-red-400/50 text-white'
                  : 'bg-gradient-to-r from-[#5c108a] to-[#4a0d70] hover:from-[#4a0d70] hover:to-[#5c108a] border-[#5c108a]/50 text-white1 hover:shadow-md'
              }`}
            >
              <Phone className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleAttachmentClick}
              className="p-2 rounded-full bg-gradient-to-r from-[#5c108a] to-[#4a0d70] hover:from-[#4a0d70] hover:to-[#5c108a] border border-[#5c108a]/50 hover:border-[#5c108a]/50 transition-all duration-300 text-white1 hover:scale-110 shadow-sm hover:shadow-md"
            >
              <Paperclip className="w-3 h-3" />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </button>

            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-sm ${
                message.trim() && !disabled
                  ? 'bg-gradient-to-r from-[#5c108a] to-[#4a0d70] backdrop-blur-md border border-[#5c108a]/50 text-white1 hover:from-[#4a0d70] hover:to-[#5c108a] hover:shadow-md'
                  : 'bg-[#5c108a]/20 text-[#5c108a]/40 cursor-not-allowed border border-[#5c108a]/30'
              }`}
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
