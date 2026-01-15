# Price Scraping Setup Guide

## Overview
This system scrapes PCGS and NGC prices for Morgan Dollars across all grades and stores them in Cloudflare D1 database.

## Database Schema

### `coin_prices` Table
Stores individual coin prices:
- `id`: Unique identifier
- `series`: Coin series (e.g., "Morgan Dollar")
- `year`: Coin year (1878-1921 for Morgans)
- `mint_mark`: Mint mark (S, O, CC, D, or null for Philadelphia)
- `grade`: Grade (G-4 through MS-70)
- `variety`: Optional variety/VAM number
- `price_source`: "PCGS" or "NGC"
- `price`: Current price in USD
- `last_updated`: When this price was last scraped
- `created_at`: When the record was created

### `price_scrape_log` Table
Tracks scraping runs:
- `id`: Unique identifier
- `price_source`: Which service was scraped
- `scrape_date`: When the scrape ran
- `status`: "running", "success", or "failed"
- `coins_updated`: How many prices were updated
- `error_message`: If failed, the error details

## API Endpoints

### 1. Lookup Price
```
GET /api/prices/lookup?series=Morgan%20Dollar&year=1921&mintMark=S&grade=MS-65&source=PCGS
```

Returns the price for a specific coin.

### 2. Get Prices for User's Coin
```
GET /api/prices/coin/:coinId
```

Returns all available prices (all grades) for one of the user's coins.

### 3. Manual Scrape Trigger (Admin)
```
POST /api/prices/scrape
Body: { "source": "PCGS" } // or "NGC" or "all"
```

Manually trigger a price scrape.

### 4. View Scrape History
```
GET /api/prices/scrape-log
```

Returns recent scraping history.

## Setting Up Monthly Cron Job

### Option 1: Cloudflare Workers Cron Triggers (Recommended)

1. Add to `wrangler.toml`:
```toml
[triggers]
crons = ["0 0 1 * *"] # Run at midnight on the 1st of every month
```

2. Create a scheduled handler in `src/index.ts`:
```typescript
export default {
  async fetch(request: Request, env: Env) {
    // Your existing fetch handler
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Run monthly price scraping
    console.log('Running scheduled price scrape...')

    const db = createDb(env.DB)

    try {
      await scrapePCGSPrices(db)
      await scrapeNGCPrices(db)
      console.log('Scheduled scrape completed successfully')
    } catch (error) {
      console.error('Scheduled scrape failed:', error)
    }
  }
}
```

3. Deploy:
```bash
npx wrangler deploy
```

The cron will automatically run monthly.

### Option 2: External Cron Service

Use a service like cron-job.org or EasyCron to hit your API endpoint monthly:
```
POST https://coinapp-api.kapp-build.workers.dev/api/prices/scrape
Body: { "source": "all" }
```

## Implementing the Actual Scraping

The current `priceScraper.ts` is a placeholder. You need to implement the actual scraping logic.

### PCGS Scraping Options:

#### Option A: PCGS CoinFacts API (Paid, Recommended)
- Official API with reliable data
- Requires subscription
- Documentation: https://www.pcgs.com/coinfacts/api

#### Option B: Web Scraping (Free, More Complex)
```typescript
async function fetchPCGSPrice(series: string, year: number, mint: string, grade: string) {
  // Example URL structure (verify actual PCGS URLs)
  const url = `https://www.pcgs.com/prices/${series}/${year}${mint}`

  const response = await fetch(url)
  const html = await response.text()

  // Parse HTML to extract price for specific grade
  // Use a parser like cheerio or regex
  // IMPORTANT: Check PCGS Terms of Service first!

  return extractedPrice
}
```

**Important Legal Considerations:**
1. Check PCGS and NGC Terms of Service
2. Respect robots.txt
3. Add delays between requests (rate limiting)
4. Consider using their official APIs instead

### NGC Scraping Options:

Similar to PCGS - check if they have an official API or need to scrape their website.

## Data Storage

Prices are stored in **Cloudflare D1** (SQLite):
- ✅ Free tier: 5GB storage, 5M reads/day, 100K writes/day
- ✅ Fast global access via Cloudflare network
- ✅ Integrated with your existing Worker
- ✅ Indexed for fast lookups

## Testing

1. Apply the migration:
```bash
cd backend
npx wrangler d1 migrations apply coinapp-db --remote
```

2. Test manual scrape (placeholder will run but not insert data):
```bash
curl -X POST https://coinapp-api.kapp-build.workers.dev/api/prices/scrape \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source":"PCGS"}'
```

3. Check scrape log:
```bash
curl https://coinapp-api.kapp-build.workers.dev/api/prices/scrape-log \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

1. ✅ Apply database migration
2. ⏳ Decide on scraping approach (API vs web scraping)
3. ⏳ Implement actual scraping logic
4. ⏳ Test with a small subset of coins first
5. ⏳ Set up cron trigger
6. ⏳ Monitor scrape logs for errors

## Cost Estimate

### Cloudflare D1:
- **Free tier covers most use cases**
- ~280 Morgan varieties × 27 grades × 2 sources = ~15,000 price records
- Monthly updates = 15,000 writes/month (well within 100K limit)

### Scraping Costs:
- **Option A (PCGS API)**: Check PCGS pricing
- **Option B (Web Scraping)**: Free but more maintenance

## Security Notes

- Scraping endpoint requires authentication
- TODO: Add admin-only restriction
- Consider rate limiting to prevent abuse
