import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';
import AuthRedirect from '@/components/auth/AuthRedirect';

export const metadata = {
  title: 'Login — TrustHire',
};

export default function LoginPage() {
  return (
    <AuthRedirect>
      <div className="min-h-[80vh] flex">
        {/* ========== LEFT SIDE - IMAGE ========== */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-r-3xl">
          <Image
            src="/trusthire-banner.png"
            alt="TrustHire - Trusted Hiring Platform"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <h2 className="text-3xl font-bold mb-2">
              Find Trusted Talent, Build Stronger Teams
            </h2>
            <p className="text-white/80 text-lg">
              Join thousands of companies hiring smarter with TrustHire.
            </p>
            <div className="flex gap-8 mt-6">
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-white/60 text-sm">Companies</p>
              </div>
              <div>
                <p className="text-2xl font-bold">500K+</p>
                <p className="text-white/60 text-sm">Candidates</p>
              </div>
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-white/60 text-sm">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* ========== RIGHT SIDE - FORM ========== */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-12 py-12 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <Image
                src="/icon.png"
                alt="TrustHire Logo"
                width={45}
                height={45}
                className="rounded-xl"
              />
              <span className="text-2xl font-bold">
                <span className="text-blue-600">Trust</span>
                <span className="text-orange-500">Hire</span>
              </span>
            </div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back 👋</h1>
              <p className="text-gray-600 mt-2">
                Login to your TrustHire account
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </AuthRedirect>
  );
}