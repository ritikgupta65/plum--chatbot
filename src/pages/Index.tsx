
import ChatInterface from '@/components/chat/ChatInterface';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Index = () => {
  return (
    <ThemeProvider>
      {/* Custom background matching Plum Goodness website */}
      <div className="min-h-screen bg-gradient-to-br from-[#5c108a]/5 via-white to-[#5c108a]/10 flex items-center justify-center">
        {/* Compact professional widget-style chatbot container */}
        <div className="w-full max-w-sm h-[600px] bg-gradient-to-br from-white via-[#5c108a]/5 to-[#5c108a]/10 rounded-2xl shadow-2xl border border-[#5c108a]/20 relative overflow-hidden">
          {/* Enhanced background elements with custom theme */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5c108a]/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#5c108a]/15 via-transparent to-transparent"></div>
          
          {/* Subtle animated background pattern - removed one circle */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute bottom-16 right-12 w-12 h-12 bg-[#5c108a] rounded-full animate-pulse delay-1000"></div>
          </div>
          
          {/* Main Chat Interface */}
          <ChatInterface />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
