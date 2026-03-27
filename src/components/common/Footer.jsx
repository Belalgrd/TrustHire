import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold text-white">
                Trust<span className="text-indigo-400">Hire</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Where commitment meets opportunity. The first job portal where
              candidates can signal genuine interest through a refundable
              challenge fee.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/jobs" className="hover:text-white transition-colors">
                Browse Jobs
              </Link>
              <Link href="/register" className="hover:text-white transition-colors">
                Sign Up
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                Login
              </Link>
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-white font-semibold mb-4">How It Works</h3>
            <div className="flex flex-col gap-2">
              <span>📋 Apply for free or boost</span>
              <span>💰 Refundable challenge fee</span>
              <span>⭐ Priority review</span>
              <span>🔄 Auto-refund system</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} TrustHire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}