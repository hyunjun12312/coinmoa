export default function AdBanner({ slot = 'default', className = '' }: { slot?: string; className?: string }) {
  return (
    <div className={`ad-slot ${className}`}>
      <div className="text-center p-4">
        <p className="text-[var(--text-secondary)] text-xs mb-1">Ad Area</p>
        <p className="text-[var(--text-secondary)] text-[10px]">AD SLOT: {slot}</p>
        {/* 
          실제 애드센스 코드:
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXX"
            data-ad-slot="YYYYYYY"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        */}
      </div>
    </div>
  );
}
