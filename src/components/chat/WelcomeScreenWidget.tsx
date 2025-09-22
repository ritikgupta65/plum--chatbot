import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, Clock, Phone, User, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: (message?: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const { theme } = useTheme();

  const handleQuickAction = (action: string) => {
    onStartChat(action);
  };

  const recentConversations = [
    {
      id: 1,
      preview: "Great! Please provide the following details...",
      timestamp: "2 minutes ago"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative min-h-screen">
      {/* Enhanced Animated Background Elements with custom color */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-r from-[#5c108a]/20 to-[#4a0d70]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-r from-[#5c108a]/20 to-[#4a0d70]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#5c108a]/10 to-[#4a0d70]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-sm w-full mx-auto">
        {/* Top-right circular badges */}
        {theme.badgeImages && theme.badgeImages.length > 0 && (
          <div className="absolute -top-2 right-2 flex -space-x-2">
            {theme.badgeImages.slice(0,2).map((src, idx) => (
              <div key={idx} className="w-16 h-16 rounded-full bg-white shadow-md overflow-hidden border border-white">
                <img src={src} alt={`badge-${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Compact Logo Section */}
       <div className="text-center mb-6">
  {theme.logoUrl ? (
    <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden shadow-xl bg-white transform hover:scale-105 transition-transform duration-300">
      <img 
        src={theme.logoUrl}
        alt={theme.brandName}
        className="w-full h-full object-contain"
      />
    </div>
  ) : (
    <div className={`w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br ${theme.primaryGradient} shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300`}>
      <MessageCircle className="w-8 h-8 text-white" />
    </div>
  )}
  
  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5c108a] to-[#4a0d70] bg-clip-text text-transparent mb-2 animate-fade-in">Welcome to Plum Goodness!</h1>
  <p className="text-[#5c108a] text-base mb-6 animate-fade-in-delay">How can we help you today?</p>
</div>


        {/* Compact Main Quick Action */}
        <div className="mb-4">
          <button
            onClick={() => handleQuickAction('Hi')}
            className="textcolor w-full p-3 bg-gradient-to-r from-[#5c108a] to-[#4a0d70] backdrop-blur-md rounded-xl border border-[#5c108a]/30 text-white hover:from-[#4a0d70] hover:to-[#5c108a] transition-all duration-300 group flex items-center justify-between shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          > 
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2 textcolor" />
              <span className="font-medium text-sm">Ask a question</span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 text-white" />
          </button>
        </div>

        {/* Compact Secondary Actions */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => window.open('https://plumgoodness.com/pages/track-your-order-2', '_blank')}
            className="flex-1 px-3 py-2.5 bg-gradient-to-r from-[#7e22ce33] to-[#7e22ce33] backdrop-blur-md rounded-lg border border-[#5c108a]/30 text-white text-xs hover:from-[#9c64c6] hover:to-[#9c64c6] transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
          >
            Track my order
          </button>
          <button
            onClick={() => handleQuickAction('New arrivals')}
            className="flex-1 px-3 py-2.5 bg-gradient-to-r from-[#d4b8e8] to-[#d4b8e8] backdrop-blur-md rounded-lg border border-[#5c108a]/30 text-white text-xs hover:from-[#9c64c6] hover:to-[#9c64c6] transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
          >
            New arrivals
          </button>
        </div>

        {/* Compact Recent Conversations */}
        {recentConversations.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[#5c108a] font-medium mb-2 text-center text-sm">Recent Conversation</h3>
            {recentConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onStartChat()}
                className="w-full p-3 bg-gradient-to-r from-[#d4b8e8] to-[#d4b8e8] backdrop-blur-md rounded-xl border border-[#5c108a]/30 text-left hover:from-[#9c64c6] hover:to-[#9c64c6] transition-all duration-300 group transform hover:scale-[1.02] shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white text-xs mb-1">{conversation.preview}</p>
                    <p className="text-white/80 text-xs">{conversation.timestamp}</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-white group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Compact Additional Actions */}
        <div className="space-y-2">
          <button
            className="w-full p-3 bg-gradient-to-r from-[#d4b8e8] to-[#d4b8e8] backdrop-blur-md rounded-xl border border-[#5c108a]/30 text-white hover:from-[#9c64c6] hover:to-[#9c64c6] transition-all duration-300 group flex items-center justify-between transform hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-white" />
              <span className="font-medium text-sm">Start a live call</span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 text-white" />
          </button>

          <button
            className="w-full p-3 bg-gradient-to-r from-[#d4b8e8] to-[#d4b8e8] backdrop-blur-md rounded-xl border border-[#5c108a]/30 text-white hover:from-[#9c64c6] hover:to-[#9c64c6] transition-all duration-300 group flex items-center justify-between transform hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-white" />
              <span className="font-medium text-sm">Talk to a human agent</span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
