import { useTheme } from '@/contexts/ThemeContext';
import { Message } from '@/types/chat';
import { User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { theme } = useTheme();
  const isUser = message.sender === 'user';

  // --- PRODUCT PARSER ---
  const parseProductMarkdown = (text: string) => {
    const productRegex = /\*\*Product Name\*\*:([\s\S]*?)\*\*Image URL\*\*: !\[.*?\]\((.*?)\)/g;

    let match;
    const products = [];
    let firstIndex = -1;
    let lastIndex = -1;

    while ((match = productRegex.exec(text)) !== null) {
      const block = match[0];
      const start = match.index;
      const end = start + block.length;

      if (firstIndex === -1) firstIndex = start;
      lastIndex = end;

      const titleMatch = block.match(/\*\*Product Name\*\*: (.*?)(\n|$)/);
      const descriptionMatch = block.match(/\*\*Description\*\*: (.*?)(\n|$)/);
      const urlMatch = block.match(/\*\*Product URL\*\*: \[.*?\]\((.*?)\)/);
      const imageMatch = block.match(/\*\*Image URL\*\*: !\[.*?\]\((.*?)\)/);

      products.push({
        title: titleMatch?.[1] ?? '',
        description: descriptionMatch?.[1] ?? '',
        url: urlMatch?.[1] ?? '',
        image: imageMatch?.[1] ?? '',
      });
    }

    return {
      products,
      textBefore: text.slice(0, firstIndex).trim(),
      textAfter: text.slice(lastIndex).trim(),
    };
  };

  // --- CARD RENDER ---
  const renderProductCards = (text: string) => {
    const { products, textBefore, textAfter } = parseProductMarkdown(text);

    return (
      <div className="space-y-4">
        {textBefore && (
          <p
            className="text-sm text-white"
            dangerouslySetInnerHTML={{ __html: formatMessage(textBefore) }}
          />
        )}

        <div className="grid gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-[#1f2937] border border-[#374151] rounded-xl p-3 w-[260px] text-white shadow-lg"
            >
              <img
                src={product.image}
                alt={product.title}
                className="rounded-lg w-full h-40 object-cover mb-3"
              />
              <h3 className="text-white1 font-semibold text-base mb-1">{product.title}</h3>
              <p className="text-sm textcolor">{product.description}</p>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full text-center1 bg-green-600 hover:bg-green-700 transition text-white rounded-md py-1"
              >
                View Product
              </a>
            </div>
          ))}
        </div>

        {textAfter && (
          <p
            className="text-sm text-white"
            dangerouslySetInnerHTML={{ __html: formatMessage(textAfter) }}
          />
        )}
      </div>
    );
  };

  // --- DEFAULT TEXT FORMATTER ---
  const formatMessage = (text: string) => {
    return text
      .replace(/^###\s+(.*)$/gm, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" class="underline text-blue-400">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/^\*\s+(.*)$/gm, '• $1')
      .replace(/\n/g, '<br/>');
  };

  const isProductRecommendation =
    typeof message.content === 'string' &&
    /\*\*Product Name\*\*:/.test(message.content) &&
    /\*\*Image URL\*\*:/.test(message.content);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[70vw] sm:max-w-[300px] lg:max-w-[300px] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Compact Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-plum-500 to-plum-600 flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-md bg-white">
              <img
                src={theme.logoUrl}
                alt={theme.brandName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Compact Message Bubble */}
        <div
          className={`relative p-3 rounded-xl ${isUser
            ? 'bg-gradient-to-r from-plum-500 to-plum-600 backdrop-blur-md border border-plum-400/30 text-white1 ml-auto shadow-md'
            : 'bg-gradient-to-r from-white/30 to-plum-50/30 backdrop-blur-md border border-plum-200/30 text-plum-900 shadow-md'} shadow-lg`}
        >
          {isProductRecommendation ? (
            renderProductCards(message.content as string)
          ) : (
            <p
              className="text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content as string) }}
            />
          )}

          <p className={`text-xs mt-1 ${isUser ? 'text-white1' : 'text-plum-600'}`}>
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>

          {/* Compact Tail */}
          <div className={`absolute top-3 ${isUser ? 'right-0 translate-x-1' : 'left-0 -translate-x-1'}`}>
            <div
              className={`w-2.5 h-2.5 rotate-45 ${isUser
                ? 'bg-gradient-to-r from-plum-500 to-plum-600 border-l border-t border-plum-400/30'
                : 'bg-gradient-to-r from-white/30 to-plum-50/30 border-l border-t border-plum-200/30'}`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

