import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import Header from '@/components/Header';
import { PeptideDirectoryPanel } from '@/components/PeptideDirectory';
import Calculator from '@/components/Calculator';
import HarmReductionCallouts from '@/components/HarmReductionCallouts';
import CitationsModal from '@/components/CitationsModal';
import Footer from '@/components/Footer';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';
import SuppliesSection from '@/components/SuppliesSection';

export default function App() {
  const { peptides, disclaimer, loading, error, setError, offlineMode, legalFooter } = useApi();
  const [query, setQuery] = useState('');
  const [citationsFor, setCitationsFor] = useState(null);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header disclaimer={disclaimer} offlineMode={offlineMode} />

        <main className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 items-start">
          <PeptideDirectoryPanel
            peptides={peptides}
            loading={loading}
            error={error}
            query={query}
            setQuery={setQuery}
            onViewCitations={setCitationsFor}
          />

          <div className="flex flex-col gap-4 lg:sticky lg:top-4">
            <Calculator setError={setError} />
            <HarmReductionCallouts />
          </div>
        </main>

        <div className="mt-6 space-y-5">
          <AffiliateDisclosure />
          <SuppliesSection />
        </div>

        <Footer disclaimer={disclaimer} legalFooter={legalFooter} />
      </div>

      <CitationsModal peptide={citationsFor} onClose={() => setCitationsFor(null)} />
    </div>
  );
}
