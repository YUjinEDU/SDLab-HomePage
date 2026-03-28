// 공개 포털은 내용이 자주 바뀌지 않으므로 1시간 캐시.
// 매 방문마다 DB를 조회하지 않음 — Vercel이 캐시된 페이지를 서빙하고
// 백그라운드에서 재생성. DB 부하 및 응답속도 모두 개선.
export const revalidate = 3600;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
