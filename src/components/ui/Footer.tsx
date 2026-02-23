import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <span className="text-lg font-bold bg-gradient-to-r from-violet-500 via-cyan-500 to-fuchsia-500 bg-clip-text text-transparent">
              BlogPoster
            </span>
            <p className="text-sm text-fg-muted leading-relaxed">
              커뮤니티와 함께 지식을 나누는<br />블로그 플랫폼입니다.
            </p>
          </div>

          {/* Col 2: Explore */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-fg-muted hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-sm text-fg-muted hover:text-foreground transition-colors">
                  Posts
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="text-sm text-fg-muted hover:text-foreground transition-colors">
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Info</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-fg-muted hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-fg-muted hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-fg-muted">&copy; 2026 blogposter. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-fg-muted hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
