import type { SshSession } from "@/types/server-monitor";
import { timeAgo } from "@/lib/utils/format";

type ActiveUsersSectionProps = {
  sessions: SshSession[];
};

export function ActiveUsersSection({ sessions }: ActiveUsersSectionProps) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          접속 중
        </h3>
        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
          {sessions.length}명
        </span>
      </div>

      {sessions.length === 0 ? (
        <p className="text-xs text-gray-300">
          현재 접속 중인 사용자가 없습니다
        </p>
      ) : (
        <div className="space-y-1.5">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">
                  {session.username}
                </span>
                <span className="text-gray-400 font-mono">
                  {session.remote_host}
                </span>
              </div>
              <span className="text-gray-400">
                {timeAgo(new Date(session.login_at))} 접속
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
