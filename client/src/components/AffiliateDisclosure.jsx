import { AFFILIATE_DISCLOSURE } from '@/lib/affiliates';

export default function AffiliateDisclosure() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-800">
      <p className="font-semibold mb-1">Affiliate Disclosure</p>
      <p>{AFFILIATE_DISCLOSURE}</p>
    </div>
  );
}
