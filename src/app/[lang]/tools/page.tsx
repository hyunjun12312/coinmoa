'use client';

import AdBanner from '@/components/AdBanner';
import ToolsClient from '@/components/ToolsClient';
import { useDictionary } from '@/i18n/DictionaryProvider';

export default function ToolsPage() {
  const { dictionary: t } = useDictionary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">{t.tools.title}</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {t.tools.subtitle}
        </p>
      </div>

      <AdBanner slot="tools-top" className="min-h-[90px]" />

      <ToolsClient />

      <AdBanner slot="tools-bottom" className="min-h-[90px]" />
    </div>
  );
}
