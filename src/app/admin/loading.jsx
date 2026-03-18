// Suppress the root-level loading.jsx (PageLoader) for the admin route.
// The admin page manages its own loading state internally via checkingSession.
// Without this file, the full-screen PageLoader overlay (z-index: 9999) would
// cover the admin page during initial hydration and never self-dismiss.
export default function AdminLoading() {
  return null;
}
