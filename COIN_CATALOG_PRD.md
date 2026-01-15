# Coin Catalog & Pricing System - Product Requirements Document

## Project Overview
Build a comprehensive coin catalog system with static coin specifications and dynamic market pricing. Initial phase focuses on Morgan dollars only.

## Goals
1. Replace static mock coin data with real catalog data from Numista
2. Implement monthly automated price scraping from PCGS/NGC
3. Store all data in Cloudflare D1 for fast, persistent access
4. Enable users to see authentic coin specs and current market prices

---

## Scope - Phase 1: Morgan Dollars Only

### Coins Covered
- **Series**: Morgan Dollar (1878-1904, 1921)
- **Total Coins**: ~91 distinct coins (all year/mint mark combinations)

### Data Coverage by Field

#### Static Catalog Data (From Numista API - One-time)
- [x] Coin name/identifier (e.g., "1921-S Morgan Dollar")
- [x] Year (1878-1921)
- [x] Mint mark (P, O, S, CC, D)
- [x] Series (Morgan Dollar)
- [x] Denomination ($1)
- [x] Mintage (total coins minted)
- [x] Weight (26.73 grams)
- [x] Diameter (38.1 mm)
- [x] Metal composition (90% Silver, 10% Copper)
- [x] Fineness (0.900)
- [x] Designer (George T. Morgan, John Flanagan)
- [x] Mint location (Philadelphia, New Orleans, San Francisco, Carson City, Denver)
- [x] ASW/Metal weight (troy oz of pure silver)
- [x] Surviving population (estimated)
- [x] Obverse/Reverse descriptions

#### Dynamic Price Data (From PCGS/NGC - Monthly Updates)
- [x] Grade-specific pricing
  - PCGS grades: P-1, FR-2, AG-3, G-4, G-6, VG-8, VG-10, F-12, F-15, VF-20, VF-25, VF-30, VF-35, XF-40, XF-45, AU-50, AU-55, AU-58, MS-60, MS-61, MS-62, MS-63, MS-64, MS-65, MS-66, MS-67, MS-68, MS-69, MS-70
- [x] Prices from PCGS
- [x] Prices from NGC
- [x] Average/market price
- [x] Last updated timestamp

---

## Database Schema

### Table 1: `coin_catalog`
**Purpose**: Static coin specifications (one-time population)

```
id (TEXT, PRIMARY KEY)               -- "morgan-1921-s"
numista_id (TEXT, UNIQUE)            -- Numista's ID
name (TEXT)                          -- "1921-S Morgan Dollar"
year (INTEGER)                       -- 1921
mint_mark (TEXT)                     -- "S", "O", "CC", etc.
series (TEXT)                        -- "Morgan Dollar"
denomination (TEXT)                 -- "$1"
country (TEXT)                       -- "United States"
weight (REAL)                        -- 26.73 grams
diameter (REAL)                      -- 38.1 mm
thickness (REAL)                     -- 2.4 mm
edge (TEXT)                          -- "Reeded"
composition (TEXT)                   -- "90% Silver, 10% Copper"
metal_type (TEXT)                    -- "Silver"
fineness (REAL)                      -- 0.900
metal_weight (REAL)                  -- ASW in troy oz (0.7734)
mintage (INTEGER)                    -- Total minted
surviving_population (INTEGER)       -- Estimated surviving
designer (TEXT)                      -- "George T. Morgan"
mint_location (TEXT)                 -- "San Francisco"
obverse_description (TEXT)           -- Detailed description
reverse_description (TEXT)           -- Detailed description
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Table 2: `coin_prices`
**Purpose**: Grade-specific prices (updated monthly)

```
id (TEXT, PRIMARY KEY)               -- UUID
catalog_id (TEXT, FOREIGN KEY)       -- References coin_catalog.id
grade (TEXT)                         -- "MS-65", "VF-30"
source (TEXT)                        -- "PCGS", "NGC", "AVERAGE"
price (REAL)                         -- USD price
scraped_at (TIMESTAMP)               -- When this was scraped
created_at (TIMESTAMP)
```

### Table 3: `coins` (Existing - Add Column)
**Purpose**: User's coin collection (links to catalog)

```
[existing fields...]
catalog_id (TEXT, FOREIGN KEY)       -- Links to coin_catalog.id
```

---

## Data Sources

### Numista API
**Purpose**: Fetch one-time static catalog data
- **URL**: https://numista.com/api/
- **Tier**: Free (500 requests/day)
- **What we fetch**: Coin specs, weight, purity, composition, mintage, designer
- **Frequency**: One-time (can re-run to update specs)
- **Fields returned**: Full coin metadata from Numista database

### PCGS Price Guide
**Purpose**: Scrape monthly price data
- **URL**: https://www.pcgs.com/prices
- **Method**: Web scraping (HTML with cheerio)
- **What we scrape**: Grade-specific prices for each coin
- **Frequency**: Monthly (1st of month via cron job)
- **Grades**: P-1 through MS-70

### NGC Price Guide
**Purpose**: Scrape monthly price data
- **URL**: https://www.ngccoin.com/price-guide/
- **Method**: Web scraping (HTML with cheerio)
- **What we scrape**: Grade-specific prices for each coin
- **Frequency**: Monthly (1st of month via cron job)
- **Grades**: Similar grading scale

---

## Implementation Phases

### Phase 1: Database Schema
- Create `coin_catalog` table
- Create `coin_prices` table
- Add `catalog_id` column to `coins` table
- Generate and apply migrations

### Phase 2: Numista Integration
- Create Numista API client
- Implement caching (7-day TTL)
- Create seeding script for Morgan dollars
- Populate `coin_catalog` table with ~91 Morgan dollars

### Phase 3: Price Scrapers
- Build PCGS scraper (cheerio + fetch)
- Build NGC scraper (cheerio + fetch)
- Implement retry logic and rate limiting
- Create price service to coordinate both

### Phase 4: Scheduled Scraping
- Configure Cloudflare Workers cron trigger
- Set monthly schedule (1st of month at 00:00 UTC)
- Create cron handler to run price updates

### Phase 5: Frontend Integration
- Update Lookup page to use real catalog data + prices
- Update Explore page (future: expand beyond Morgan)
- Create catalog API client

### Phase 6: Testing & Launch
- Populate database with Morgan dollars
- Test price scraping manually
- Verify cron job execution
- Deploy to production

---

## Technical Specifications

### Technology Stack
- **Database**: Cloudflare D1 (SQLite)
- **API Client**: Numista (REST)
- **Web Scraping**: Cheerio + native Fetch
- **Scheduling**: Cloudflare Workers Cron Triggers
- **ORM**: Drizzle ORM
- **Framework**: Hono (Cloudflare Workers)

### Rate Limiting
- **Numista API**: 500 requests/day (free tier) - used for one-time seeding
- **PCGS/NGC**: 2-second delay between requests, max 100 coins per run
- **Retry Logic**: 3 attempts with exponential backoff (1s, 2s, 4s)

### Error Handling
- Failed coin scrapes log error but don't stop entire batch
- Graceful degradation if price source unavailable
- Manual trigger endpoint for emergency updates

### Data Validation
- Verify price format and range
- Validate grade exists in standard grading scale
- Check mintage/population numbers are reasonable

---

## Cost Analysis

| Service | Free Tier | Estimated Usage | Cost |
|---------|-----------|-----------------|------|
| Numista API | 500 req/day | ~100 req (one-time) | $0 |
| Cloudflare D1 | 5GB, 5M reads/day, 100k writes/day | ~50k reads/month, ~1k writes/month | $0 |
| Cloudflare Workers | 100k req/day | ~1k requests/month | $0 |
| **TOTAL** | | | **$0** |

---

## Success Criteria

- [x] All 91 Morgan dollars in catalog with complete specs
- [x] PCGS prices scraped for all grades
- [x] NGC prices scraped for all grades
- [x] Prices update monthly automatically
- [x] Lookup page displays real data with price tiers
- [x] No manual data entry needed after initial seeding
- [x] Zero cost (stays within free tier limits)

---

## Future Phases (Post-Morgan Launch)

### Phase 2: Expand to More Series
- Peace Dollars
- American Silver Eagles
- Gold Eagles
- Walking Liberty Half Dollars
- Other popular series

### Phase 3: Advanced Features
- Price history tracking
- Portfolio value tracking
- Price alerts
- Image integration (Numista provides images)
- Variety tracking (mint errors, double dies)
- World coins
- Ancient/historical coins

### Phase 4: Enhanced Analytics
- Price trend charts
- Rarity analysis
- Market trends
- Export to spreadsheet

---

## Risk & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| PCGS/NGC HTML structure changes | Medium | Monitor scraper failures, version selectors, have fallback sources |
| Numista API rate limit | Low | Only used once for initial seeding, cache results |
| Cron job failures | Medium | Manual trigger endpoint, error notifications, retry logic |
| Incomplete data from sources | Low | Verify Morgan dollar data manually, use multiple sources |
| Cloudflare Workers runtime limits | Low | Scrape in batches, limit coins per run to 100 |

---

## File Structure

### Backend Files to Create
```
backend/src/
├── clients/
│   └── numistaClient.ts           (Numista API wrapper)
├── scrapers/
│   ├── pcgsScraper.ts             (PCGS price scraper)
│   └── ngcScraper.ts              (NGC price scraper)
├── services/
│   └── priceService.ts            (Price orchestration)
├── routes/
│   └── catalog.ts                 (Catalog API endpoints)
├── cron/
│   └── priceUpdateCron.ts         (Monthly scheduled job)
└── scripts/
    └── seedCatalog.ts             (Initial data population)
```

### Backend Files to Modify
```
backend/
├── wrangler.toml                  (Add cron config, API key)
├── src/
│   ├── db/schema.ts               (Add catalog + prices tables)
│   ├── index.ts                   (Wire up routes, cron handler)
│   └── routes/prices.ts           (Update endpoints)
└── package.json                   (Add seed script)
```

### Frontend Files to Modify
```
frontend/src/
├── lib/
│   └── catalogApi.ts              (API client for catalog)
└── pages/
    ├── Lookup.tsx                 (Use real Morgan data)
    └── Explore.tsx                (Use real catalog data)
```

---

## Timeline Estimate

- Phase 1 (DB Schema): 30 minutes
- Phase 2 (Numista): 2 hours
- Phase 3 (Scrapers): 3 hours
- Phase 4 (Cron): 1 hour
- Phase 5 (Frontend): 1.5 hours
- Phase 6 (Testing): 1 hour

**Total**: 8-12 hours for complete implementation

---

## Contact & Questions
Saved for implementation: December 26, 2025
