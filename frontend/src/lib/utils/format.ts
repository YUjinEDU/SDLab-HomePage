/**
 * Format bytes to human-readable string (e.g., "1.2 TB", "800 GB", "24 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const k = 1024;
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  if (value >= 100) return `${Math.round(value)} ${units[i]}`;
  if (value >= 10) return `${value.toFixed(1)} ${units[i]}`;
  return `${value.toFixed(2)} ${units[i]}`;
}

/**
 * Format duration in seconds to Korean string (e.g., "2시간 30분", "45분", "3일")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return "0초";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    if (hours > 0) return `${days}일 ${hours}시간`;
    return `${days}일`;
  }
  if (hours > 0) {
    if (minutes > 0) return `${hours}시간 ${minutes}분`;
    return `${hours}시간`;
  }
  if (minutes > 0) return `${minutes}분`;
  return `${secs}초`;
}

/**
 * Get Tailwind color class based on usage percentage
 * green (<50%), yellow (50-80%), red (>80%)
 */
export function getStatusColor(percent: number): {
  bar: string;
  text: string;
  bg: string;
} {
  if (percent > 80) {
    return {
      bar: "bg-red-500",
      text: "text-red-600",
      bg: "bg-red-50",
    };
  }
  if (percent >= 50) {
    return {
      bar: "bg-amber-500",
      text: "text-amber-600",
      bg: "bg-amber-50",
    };
  }
  return {
    bar: "bg-emerald-500",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
  };
}

/**
 * Convert a date to a Korean "time ago" string (e.g., "30초 전", "2시간 전")
 */
export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 0) return "방금";
  if (diffSec < 60) return `${diffSec}초 전`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}분 전`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}일 전`;

  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}개월 전`;
}
