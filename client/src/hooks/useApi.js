import { useEffect, useMemo, useState } from 'react';
import { fetchPeptidesAndDisclaimer, getOfflineData } from '@/lib/api';
import { DEFAULT_LEGAL_FOOTER } from '@/lib/constants';

export function useApi() {
  const [peptides, setPeptides] = useState([]);
  const [disclaimer, setDisclaimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchPeptidesAndDisclaimer();
        setPeptides(data.peptides);
        setDisclaimer(data.disclaimer);
      } catch {
        setOfflineMode(true);
        const offline = getOfflineData();
        setPeptides(offline.peptides);
        setDisclaimer(offline.disclaimer);
        setError('Backend unreachable; using offline demo data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const legalFooter = useMemo(() => {
    const items = disclaimer?.legal_footer;
    if (Array.isArray(items)) {
      const cleaned = items.filter((item) => typeof item === 'string' && item.trim());
      if (cleaned.length > 0) return cleaned;
    }
    return DEFAULT_LEGAL_FOOTER;
  }, [disclaimer]);

  return { peptides, disclaimer, loading, error, setError, offlineMode, legalFooter };
}
