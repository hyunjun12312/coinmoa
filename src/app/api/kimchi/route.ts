import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 업비트 KRW 마켓 가져오기
    const marketsRes = await fetch('https://api.upbit.com/v1/market/all?is_details=false');
    if (!marketsRes.ok) throw new Error('Upbit markets error');
    const markets = await marketsRes.json();
    
    const krwMarkets = markets
      .filter((m: { market: string }) => m.market.startsWith('KRW-'))
      .slice(0, 30);
    
    const marketIds = krwMarkets.map((m: { market: string }) => m.market).join(',');
    
    // 업비트 시세
    const upbitRes = await fetch(`https://api.upbit.com/v1/ticker?markets=${marketIds}`);
    if (!upbitRes.ok) throw new Error('Upbit ticker error');
    const upbitData = await upbitRes.json();
    
    // 바이낸스 시세 (USDT 마켓)
    const binanceRes = await fetch('https://api.binance.com/api/v3/ticker/price');
    if (!binanceRes.ok) throw new Error('Binance error');
    const binanceData: { symbol: string; price: string }[] = await binanceRes.json();
    
    // 환율 가져오기
    const rateRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=krw');
    let exchangeRate = 1350;
    if (rateRes.ok) {
      const rateData = await rateRes.json();
      exchangeRate = rateData.tether?.krw || 1350;
    }
    
    // 김프 계산
    const kimchiData = upbitData.map((upbit: {
      market: string;
      trade_price: number;
      signed_change_rate: number;
      acc_trade_price_24h: number;
    }) => {
      const symbol = upbit.market.replace('KRW-', '');
      const binanceItem = binanceData.find(b => b.symbol === `${symbol}USDT`);
      
      if (!binanceItem) return null;
      
      const binancePrice = parseFloat(binanceItem.price);
      const binancePriceKRW = binancePrice * exchangeRate;
      const premiumPercent = ((upbit.trade_price - binancePriceKRW) / binancePriceKRW) * 100;
      
      return {
        coinId: symbol.toLowerCase(),
        symbol,
        name: symbol,
        upbitPrice: upbit.trade_price,
        binancePrice,
        binancePriceKRW: Math.round(binancePriceKRW),
        premiumPercent: Math.round(premiumPercent * 100) / 100,
        exchangeRate: Math.round(exchangeRate),
        changeRate24h: upbit.signed_change_rate * 100,
        volume24h: upbit.acc_trade_price_24h,
      };
    }).filter(Boolean);
    
    // 프리미엄 높은 순으로 정렬
    kimchiData.sort((a: { premiumPercent: number } | null, b: { premiumPercent: number } | null) => 
      (b?.premiumPercent || 0) - (a?.premiumPercent || 0)
    );
    
    return NextResponse.json({
      data: kimchiData,
      exchangeRate,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate kimchi premium' }, { status: 500 });
  }
}
