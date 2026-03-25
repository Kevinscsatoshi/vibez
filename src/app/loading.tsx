export default function Loading() {
  return (
    <div className="app-loading-screen">
      <div className="app-loading-wordmark" aria-live="polite" aria-busy="true">
        <span>VibeZ</span>
        <span className="app-loading-caret" aria-hidden="true" />
      </div>
    </div>
  );
}
