import Link from 'next/link';
import SmartCTALink from '@/components/common/SmartCTALink';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Now Open for Early Access
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Where Commitment
              <br />
              Meets{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Opportunity
              </span>
            </h1>

            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              The first job portal where candidates signal genuine interest
              through a refundable challenge fee — and recruiters see who is
              truly committed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SmartCTALink
                fallbackHref="/register"
                className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Free →
              </SmartCTALink>

              <Link
                href="/jobs"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Simple, transparent, and trust-driven
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-all">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                📋
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                1. Apply for Jobs
              </h3>
              <p className="text-gray-600">
                Browse and apply for free. Want to stand out? Add an optional
                refundable Challenge Fee to get priority review.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-all">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                ⭐
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                2. Get Priority Review
              </h3>
              <p className="text-gray-600">
                Recruiters see boosted applications first. Your commitment
                speaks louder than a polished resume.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-all">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                🔄
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3. Automatic Refund
              </h3>
              <p className="text-gray-600">
                Your fee is automatically refunded if rejected, not reviewed, or
                hired. Only forfeited if you skip an interview.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Policy */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Transparent Refund Policy
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Your money is safe. Here are the rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-green-700 mb-4">
                ✅ Fee is REFUNDED when:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700">Your application is rejected</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700">Not reviewed within the review window</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700">You are hired and join the company</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700">You attend the interview (regardless of outcome)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-red-700 mb-4">
                ❌ Fee is FORFEITED only when:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span className="text-gray-700">
                    You are invited to an interview but don&apos;t show up
                  </span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                <p className="text-amber-800 text-sm">
                  💡 That&apos;s the only case. The system is designed to be fair
                  and protect genuine candidates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold">100%</p>
              <p className="text-indigo-200 mt-1">Refund Rate*</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">⚡</p>
              <p className="text-indigo-200 mt-1">Priority Review</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">🔒</p>
              <p className="text-indigo-200 mt-1">Secure Payments</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">🤝</p>
              <p className="text-indigo-200 mt-1">Trust First</p>
            </div>
          </div>
          <p className="text-center text-indigo-200 text-sm mt-8">
            *For candidates who attend their interviews
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Stand Out?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Join TrustHire today and show recruiters you mean business.
          </p>
          <SmartCTALink
            fallbackHref="/register"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg"
          >
            Create Free Account →
          </SmartCTALink>
        </div>
      </section>
    </div>
  );
}