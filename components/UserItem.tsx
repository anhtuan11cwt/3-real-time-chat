import Image from "next/image";

interface UserItemProps {
  isOnline?: boolean;
  onClick?: () => void;
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
}

export default function UserItem({
  user,
  isOnline = false,
  onClick,
}: UserItemProps) {
  return (
    <button
      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-800 transition-colors w-full text-left"
      onClick={onClick}
      type="button"
    >
      <div className="relative flex-shrink-0">
        {user.profileImage ? (
          <Image
            alt={user.name || user.email}
            className="w-10 h-10 rounded-full object-cover"
            height={40}
            src={user.profileImage}
            width={40}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
        )}
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
        )}
      </div>

      <span className="text-white truncate">{user.name || user.email}</span>
    </button>
  );
}
