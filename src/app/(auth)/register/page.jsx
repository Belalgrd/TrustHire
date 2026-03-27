import Image from 'next/image';
import RegisterForm from '@/components/auth/RegisterForm';
import AuthRedirect from '@/components/auth/AuthRedirect';

export const metadata = {
  title: 'Sign Up — TrustHire',
};

export default function RegisterPage() {
  return (
    <AuthRedirect>
      <div className="min-h-[80vh] flex">
        {/* ========== LEFT SIDE - FORM ========== */}
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
              <h1 className="text-3xl font-bold text-gray-900">
                Create Your Account 🚀
              </h1>
              <p className="text-gray-600 mt-2">
                Join TrustHire — verified accounts only
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <RegisterForm />
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
              <span>🔒</span>
              <span>Email verified accounts only</span>
            </div>
          </div>
        </div>

        {/* ========== RIGHT SIDE - IMAGE ========== */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-l-3xl">
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
              Your Next Career Move Starts Here
            </h2>
            <p className="text-white/80 text-lg">
              Trusted by 10,000+ companies worldwide for smarter hiring.
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
      </div>
    </AuthRedirect>
  );
}