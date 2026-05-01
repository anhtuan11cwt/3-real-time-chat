interface MessageBubbleProps {
  isOwnMessage: boolean;
  message: {
    id: string;
    text: string;
    createdAt: Date | string;
    senderId: string;
    receiverId: string;
  };
}

function formatTime(date: Date | string): string {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function MessageBubble({
  message,
  isOwnMessage,
}: MessageBubbleProps) {
  return (
    <div
      className={`flex mb-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-4 py-2 rounded-2xl max-w-[70%] ${
          isOwnMessage
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-slate-800 text-gray-200 rounded-bl-sm"
        }`}
      >
        <p className="break-words">{message.text}</p>
        <span
          className={`text-xs block mt-1 ${
            isOwnMessage ? "text-indigo-200" : "text-gray-500"
          }`}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
