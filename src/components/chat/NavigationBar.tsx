
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, Clock, HelpCircle, Home } from 'lucide-react';
import { ChatState } from '@/types/chat';

interface NavigationBarProps {
  currentView: ChatState;
  onNavigate: (view: ChatState) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ currentView, onNavigate }) => {
  const { theme } = useTheme();

  const navItems = [
    { id: 'welcome' as ChatState, icon: Home, label: 'Home' },
    { id: 'history' as ChatState, icon: MessageCircle, label: 'Chats' },
    { id: 'faq' as ChatState, icon: HelpCircle, label: 'FAQ' },
  ];

  return (
    <div className="bg-gradient-to-r from-purple-700/20 to-purple-800/20 backdrop-blur-md border-t border-purple-500/30 p-2">
      <div className="flex justify-around">
       {navItems.map((item) => {
  const Icon = item.icon;
  const isActive = currentView === item.id;

  return (
    <button
      key={item.id}
      onClick={() => onNavigate(item.id)}
      className={`group flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 min-w-[70px] hover:scale-105 ${
        isActive 
          ? 'bg-gradient-to-r from-purple-700 to-purple-800 textcolor shadow-md border border-purple-600/50 transform scale-105'
          : 'text-purple-700 hover:text-purple-900 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-purple-700/20 border border-transparent hover:border-purple-500/30'
      }`}
    >
      <Icon
        className={`w-5 h-5 ${
          isActive 
            ? 'textcolor' 
            : item.id === 'history' || item.id === 'faq'
              ? 'text-purple-700 group-hover:text-white'
              : 'text-purple-700'
        }`}
      />
      <span className="text-xs font-medium">{item.label}</span>
    </button>
  );
})}

      </div>
    </div>
  );
};

export default NavigationBar;
