'use client';

import { useState } from 'react';
import { useDictionary } from '@/i18n/DictionaryProvider';

export default function ToolsClient() {
  const { dictionary: t } = useDictionary();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ProfitCalculator t={t} />
      <PositionCalculator t={t} />
      <div className="lg:col-span-2">
        <CryptoConverter t={t} />
      </div>
    </div>
  );
}

/* ─── Profit Calculator ─── */
function ProfitCalculator({ t }: { t: any }) {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [fee, setFee] = useState('0.1');
  const [result, setResult] = useState<{
    investment: number;
    revenue: number;
    profit: number;
    profitRate: number;
  } | null>(null);

  const calculate = () => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseFloat(quantity);
    const feeRate = parseFloat(fee) / 100;
    if (isNaN(buy) || isNaN(sell) || isNaN(qty)) return;

    const investment = buy * qty;
    const revenue = sell * qty;
    const buyFee = investment * feeRate;
    const sellFee = revenue * feeRate;
    const profit = revenue - investment - buyFee - sellFee;
    const profitRate = (profit / investment) * 100;

    setResult({ investment, revenue, profit, profitRate });
  };

  return (
    <div className="card">
      <h3 className="text-[15px] font-bold mb-5">{t.tools.profitCalc.title}</h3>
      <div className="space-y-4">
        <InputField label={t.tools.profitCalc.buyPrice} value={buyPrice} onChange={setBuyPrice} type="number" />
        <InputField label={t.tools.profitCalc.sellPrice} value={sellPrice} onChange={setSellPrice} type="number" />
        <InputField label={t.tools.profitCalc.quantity} value={quantity} onChange={setQuantity} type="number" />
        <InputField label={t.tools.profitCalc.fee} value={fee} onChange={setFee} type="number" />

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-[var(--accent-blue)] py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          {t.tools.profitCalc.calculate}
        </button>

        {result && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <ResultCard label={t.tools.profitCalc.investment} value={`$${result.investment.toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
            <ResultCard label={t.tools.profitCalc.revenue} value={`$${result.revenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
            <ResultCard
              label={t.tools.profitCalc.profit}
              value={`${result.profit >= 0 ? '+' : ''}$${result.profit.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
              color={result.profit >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}
            />
            <ResultCard
              label={t.tools.profitCalc.profitRate}
              value={`${result.profitRate >= 0 ? '+' : ''}${result.profitRate.toFixed(2)}%`}
              color={result.profitRate >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Position Size Calculator ─── */
function PositionCalculator({ t }: { t: any }) {
  const [capital, setCapital] = useState('');
  const [riskPercent, setRiskPercent] = useState('2');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [result, setResult] = useState<{
    riskAmount: number;
    positionSize: number;
    quantity: number;
  } | null>(null);

  const calculate = () => {
    const cap = parseFloat(capital);
    const risk = parseFloat(riskPercent) / 100;
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    if (isNaN(cap) || isNaN(risk) || isNaN(entry) || isNaN(sl) || entry === sl) return;

    const riskAmount = cap * risk;
    const riskPerUnit = Math.abs(entry - sl);
    const qty = riskAmount / riskPerUnit;
    const posSize = qty * entry;

    setResult({ riskAmount, positionSize: posSize, quantity: qty });
  };

  return (
    <div className="card">
      <h3 className="text-[15px] font-bold mb-5">{t.tools.positionCalc.title}</h3>
      <div className="space-y-4">
        <InputField label={t.tools.positionCalc.totalCapital} value={capital} onChange={setCapital} type="number" />
        <InputField label={t.tools.positionCalc.riskPercent} value={riskPercent} onChange={setRiskPercent} type="number" />
        <InputField label={t.tools.positionCalc.entryPrice} value={entryPrice} onChange={setEntryPrice} type="number" />
        <InputField label={t.tools.positionCalc.stopLoss} value={stopLoss} onChange={setStopLoss} type="number" />

        <button
          onClick={calculate}
          className="w-full rounded-xl bg-[var(--accent-blue)] py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 shadow-[0_2px_8px_rgba(30,144,255,0.25)]"
        >
          {t.tools.positionCalc.calculate}
        </button>

        {result && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            <ResultCard label={t.tools.positionCalc.riskAmount} value={`$${result.riskAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
            <ResultCard label={t.tools.positionCalc.positionSize} value={`$${result.positionSize.toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
            <ResultCard label={t.tools.positionCalc.quantity} value={result.quantity.toFixed(6)} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Crypto Converter ─── */
function CryptoConverter({ t }: { t: any }) {
  const [amount, setAmount] = useState('1');
  const [fromCoin, setFromCoin] = useState('bitcoin');
  const [toCoin, setToCoin] = useState('ethereum');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const coins = [
    { id: 'bitcoin', label: 'Bitcoin (BTC)' },
    { id: 'ethereum', label: 'Ethereum (ETH)' },
    { id: 'tether', label: 'Tether (USDT)' },
    { id: 'binancecoin', label: 'BNB' },
    { id: 'ripple', label: 'XRP' },
    { id: 'solana', label: 'Solana (SOL)' },
    { id: 'cardano', label: 'Cardano (ADA)' },
    { id: 'dogecoin', label: 'Dogecoin (DOGE)' },
  ];

  const convert = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCoin},${toCoin}&vs_currencies=usd`);
      const data = await res.json();
      const fromPrice = data[fromCoin]?.usd;
      const toPrice = data[toCoin]?.usd;
      if (fromPrice && toPrice) {
        const converted = (parseFloat(amount) * fromPrice) / toPrice;
        setResult(converted.toLocaleString('en-US', { maximumFractionDigits: 8 }));
      }
    } catch {
      setResult('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-[15px] font-bold mb-5">{t.tools.converter.title}</h3>
      <div className="grid gap-4 md:grid-cols-4 items-end">
        <InputField label={t.tools.converter.amount} value={amount} onChange={setAmount} type="number" />
        <div>
          <label className="block text-[11px] text-[var(--text-tertiary)] mb-1">{t.tools.converter.from}</label>
          <select
            value={fromCoin}
            onChange={(e) => setFromCoin(e.target.value)}
            className="w-full rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] px-3 py-2 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
          >
            {coins.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-[var(--text-tertiary)] mb-1">{t.tools.converter.to}</label>
          <select
            value={toCoin}
            onChange={(e) => setToCoin(e.target.value)}
            className="w-full rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] px-3 py-2 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
          >
            {coins.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <button
          onClick={convert}
          disabled={loading}
          className="rounded-xl bg-[var(--accent-blue)] py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 shadow-[0_2px_8px_rgba(30,144,255,0.25)] disabled:opacity-50"
        >
          {loading ? '...' : '→'}
        </button>
      </div>
      {result && (
        <div className="mt-3 rounded-lg bg-[var(--bg-secondary)] p-4 text-center">
          <span className="text-[11px] text-[var(--text-tertiary)]">{t.tools.converter.result}</span>
          <div className="text-xl font-semibold mt-1 tabular-nums">{result}</div>
          <span className="text-[11px] text-[var(--text-tertiary)]">
            {coins.find(c => c.id === toCoin)?.label}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Shared Components ─── */
function InputField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] text-[var(--text-tertiary)] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] px-3 py-2 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors placeholder:text-[var(--text-tertiary)]"
        placeholder="0"
      />
    </div>
  );
}

function ResultCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-lg bg-[var(--bg-secondary)] px-4 py-3 text-center">
      <span className="text-[11px] text-[var(--text-tertiary)] block">{label}</span>
      <div className="text-sm font-semibold mt-1 tabular-nums" style={color ? { color } : undefined}>
        {value}
      </div>
    </div>
  );
}
