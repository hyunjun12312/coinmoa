import { InfluencerProfile } from '@/types';
import type { Locale } from '@/i18n/config';

// ======== SEO Constants ========
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptopulse.site';
export const SITE_NAME = 'CryptoPulse';

// OpenGraph locale mapping for international SEO
export const OG_LOCALE_MAP: Record<Locale, string> = {
  en: 'en_US',
  ko: 'ko_KR',
  ja: 'ja_JP',
  zh: 'zh_CN',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  pt: 'pt_BR',
  ru: 'ru_RU',
  ar: 'ar_SA',
  vi: 'vi_VN',
  th: 'th_TH',
  tr: 'tr_TR',
  hi: 'hi_IN',
  id: 'id_ID',
};

// 크립토 주요 인플루언서 목록
export const CRYPTO_INFLUENCERS: InfluencerProfile[] = [
  {
    name: 'Elon Musk',
    handle: 'elonmusk',
    platform: 'twitter',
    followers: '200M+',
    description: 'Tesla & SpaceX CEO. DOGE, BTC 관련 발언으로 시장 영향력 극대',
    verified: true,
  },
  {
    name: 'Michael Saylor',
    handle: 'saborlife',
    platform: 'twitter',
    followers: '4M+',
    description: 'MicroStrategy 회장. 비트코인 최대 기업 보유자',
    verified: true,
  },
  {
    name: 'CZ (Changpeng Zhao)',
    handle: 'caborlife',
    platform: 'twitter',
    followers: '10M+',
    description: '바이낸스 창업자. 크립토 업계 핵심 인물',
    verified: true,
  },
  {
    name: 'Vitalik Buterin',
    handle: 'VitalikButerin',
    platform: 'twitter',
    followers: '5M+',
    description: '이더리움 창시자. ETH 생태계 방향성 결정',
    verified: true,
  },
  {
    name: 'Brian Armstrong',
    handle: 'brian_armstrong',
    platform: 'twitter',
    followers: '2M+',
    description: 'Coinbase CEO. 미국 규제 동향 선도',
    verified: true,
  },
  {
    name: 'Justin Sun',
    handle: 'justinsuntron',
    platform: 'twitter',
    followers: '3M+',
    description: 'TRON 창시자. DeFi/알트코인 영향력',
    verified: true,
  },
  {
    name: 'Cathie Wood',
    handle: 'CathieDWood',
    platform: 'twitter',
    followers: '1.5M+',
    description: 'ARK Invest CEO. BTC ETF & 기관 투자 선도',
    verified: true,
  },
  {
    name: 'PlanB',
    handle: '100trillionUSD',
    platform: 'twitter',
    followers: '2M+',
    description: 'S2F 모델 창시자. 비트코인 가격 예측 분석가',
    verified: true,
  },
  {
    name: 'Willy Woo',
    handle: 'woonomic',
    platform: 'twitter',
    followers: '1M+',
    description: '온체인 분석가. 비트코인 온체인 데이터 전문',
    verified: true,
  },
  {
    name: 'Cobie',
    handle: 'coaborlife',
    platform: 'twitter',
    followers: '700K+',
    description: 'UpOnly 팟캐스트. 크립토 트레이더 & 분석가',
    verified: true,
  },
];

// 코인별 한글 정보
export const COIN_KO_INFO: Record<string, { name: string; description: string }> = {
  bitcoin: { name: '비트코인', description: '최초의 탈중앙화 디지털 화폐. 모든 암호화폐의 시작.' },
  ethereum: { name: '이더리움', description: '스마트 컨트랙트 플랫폼. DeFi, NFT 생태계의 기반.' },
  tether: { name: '테더', description: '미국 달러에 1:1 연동된 스테이블코인.' },
  ripple: { name: '리플', description: '글로벌 결제 네트워크. 은행 간 송금 솔루션.' },
  solana: { name: '솔라나', description: '초고속 블록체인. 낮은 수수료와 빠른 트랜잭션.' },
  cardano: { name: '카르다노', description: '학술 연구 기반 블록체인. 지속 가능한 개발.' },
  dogecoin: { name: '도지코인', description: '밈 코인의 시작. 일론 머스크의 지지.' },
  'shiba-inu': { name: '시바이누', description: '도지코인 킬러. 커뮤니티 중심 밈 토큰.' },
  polkadot: { name: '폴카닷', description: '멀티체인 프로토콜. 블록체인 간 상호운용성.' },
  avalanche: { name: '아발란체', description: '고성능 스마트 컨트랙트 플랫폼.' },
  chainlink: { name: '체인링크', description: '탈중앙화 오라클 네트워크. 스마트 컨트랙트와 실세계 데이터 연결.' },
  polygon: { name: '폴리곤', description: '이더리움 레이어2 확장 솔루션.' },
};

// 뉴스 카테고리
export const NEWS_CATEGORIES = [
  { id: 'all', label: '전체', emoji: '📰' },
  { id: 'bitcoin', label: '비트코인', emoji: '₿' },
  { id: 'ethereum', label: '이더리움', emoji: '⟠' },
  { id: 'defi', label: 'DeFi', emoji: '🏦' },
  { id: 'nft', label: 'NFT', emoji: '🎨' },
  { id: 'regulation', label: '규제', emoji: '⚖️' },
  { id: 'altcoin', label: '알트코인', emoji: '🪙' },
  { id: 'exchange', label: '거래소', emoji: '📊' },
];
