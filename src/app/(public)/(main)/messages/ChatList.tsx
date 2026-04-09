/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'

export function ChatList({ chats, selectedId, onSelect, isLoading }: any) {
  if (isLoading)
    return (
      <div className="p-4 text-center text-slate-400">Загрузка чатов...</div>
    )

  return (
    <div className="divide-y divide-slate-50">
      {chats.map((chat: any) => (
        <button
          key={chat.id}
          onClick={() => onSelect(chat)}
          className={`flex w-full items-start gap-4 p-4 transition-colors hover:bg-slate-50 ${
            selectedId === chat.id
              ? 'border-primary-brand border-r-4 bg-emerald-50/50'
              : ''
          }`}
        >
          <div className="relative shrink-0">
            <Image
              src={chat.partner?.avatarUrl || '/default-avatar.png'}
              className="h-12 w-12 rounded-full border border-slate-100 object-cover"
              width={48}
              height={48}
              alt=""
            />
            {chat.type === 'EVENT' && (
              <div className="absolute -right-1 -bottom-1 rounded-full border-2 border-white bg-blue-500 p-1 text-white">
                <div className="px-0.5 text-[8px] font-bold uppercase">
                  Event
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start overflow-hidden">
            <div className="flex w-full items-baseline justify-between gap-2">
              <span className="truncate font-bold text-slate-900">
                {chat.partner?.name || 'Общий чат'}
              </span>
              <span className="text-[10px] text-slate-400">
                {new Date(chat.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className="text-primary-brand mb-0.5 truncate text-xs font-medium">
              {chat.title}
            </p>
            <p className="w-full truncate text-left text-sm text-slate-500 italic">
              {chat.lastMessage}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
