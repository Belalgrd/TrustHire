import Loader from '@/components/common/Loader';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader size="lg" text="Loading..." />
    </div>
  );
}