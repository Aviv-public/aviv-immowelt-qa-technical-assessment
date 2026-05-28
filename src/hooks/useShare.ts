import { useState } from 'react';

export const useShare = () => {
  const [error, setError] = useState<string | null>(null);

  const shareProperty = async (title: string) => {
    try {
      // First try to use the clipboard API as a fallback
      await navigator.clipboard.writeText(window.location.href);
      setError('Link copied to clipboard!');
      setTimeout(() => setError(null), 2000);
    } catch (err) {
      // If clipboard fails, show a manual copy message
      setError('To share, copy this page URL from your browser address bar');
      setTimeout(() => setError(null), 3000);
    }
  };

  return { shareProperty, error };
};