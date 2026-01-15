# Coin Inventory Platform
## Product Specification & User Stories

---

## Core Vision

A free inventory tracking platform for coin collectors and stackers that provides immediate value through simple portfolio management, then progressively reveals advanced features like rarity data, community rankings, profit tracking, and integrated content.

---

## Key Design Principles

- **Entry Point:** Single, simple value proposition - "Track Your Coin Collection - Free"
- **Progressive Discovery:** Features unlock organically through use, never overwhelming
- **Auto-Pricing:** Automatic current value lookup eliminates manual work
- **Self-Service Grading:** Users estimate their own grades using PCGS grading scale reference charts
- **Community Engagement:** Public registries, rankings, and social proof drive retention
- **Content Integration:** Platform creator's videos and insights embedded throughout

---

## Platform Features

### Phase 1: Core Entry Point (Months 1-3)
**Priority: CRITICAL - Must launch first**

| Feature | Description | User Value |
|---------|-------------|------------|
| **Free Inventory Tracker** | Add coins to collection, track what you own | Know exactly what you have, organized in one place |
| **Auto-Pricing Integration** | Automatic current market value lookup | See portfolio value instantly without manual research |
| **PCGS Grading Scale Reference** | Visual grading scale with example images scraped from PCGS | Users can estimate their own grades accurately using reference photos |
| **Mobile-Friendly Interface** | Responsive design, works on any device | Track coins anywhere, anytime |
| **Simple Add Flow** | Quick coin entry: type, year, mint mark, estimated grade | Fast onboarding, low friction to start |

### Phase 2: Discovery Features (Months 3-6)
**Priority: HIGH VALUE - Drives engagement**

| Feature | Description | User Value |
|---------|-------------|------------|
| **Public Registry (Opt-in)** | Make collection public, share with community | Show off collection, get recognition |
| **Community Rankings** | Leaderboards by collection type, value, completion | Gamification drives daily engagement and competition |
| **Rarity Data & Analytics** | Estimated survival rates, mintage numbers, population reports | Investment intelligence, find undervalued coins |
| **Set Completion Tracking** | Track progress toward complete sets (e.g., Morgan Dollars 47/96) | Clear goals, visual progress motivates collecting |
| **Content Integration** | Break videos, haul videos, educational content embedded | Learn from creator, see platform in action |

### Phase 3: Monetization Features (Months 6-12)
**Priority: PREMIUM - Revenue generation**

| Feature | Description | User Value |
|---------|-------------|------------|
| **Profit Tracking (Premium)** | See gains/losses, percentage returns, total portfolio performance | Serious investors need ROI visibility |
| **Price Alerts (Premium)** | Notifications when coins hit target prices or show arbitrage opportunities | Automated deal-finding saves time |
| **Integrated Storefront** | Creator's coins for sale, linked to public registry | Seamless buying from trusted source |
| **Advanced Analytics (Premium)** | Historical price trends, portfolio composition, detailed reports | Deep insights for serious collectors |
| **Break Bags Integration** | Copper bullion break bags with odds, entertainment value | Fun product offering, additional revenue |

---

## User Stories

### User Type 1: The Stacker (Investment-Focused)

**Meet Sarah - 32, buys silver/gold as savings alternative**

#### Day 1: Discovery

Sarah sees a YouTube video where the creator mentions tracking their collection on the platform. She clicks the link and lands on a simple page: "Track Your Stack - Free."

- Signs up in under 30 seconds
- Adds her 10 silver eagles from last month's purchase
- Platform auto-fills current market price - she sees she's up $40
- Uses PCGS grading reference to estimate grades (most are MS-64/65)

**Hook:** "Oh cool, I can see my gains without doing math."

#### Week 2: Building Habit

Sarah adds more coins as she buys them each week. She starts checking the platform regularly.

- Notices "Public Registry" toggle - ignores it for now
- Sees "Stackworth" tab with a badge - clicks out of curiosity
- Discovers profit tracking, percentage gains, total value over time chart

**Value:** "This is actually useful for my portfolio - better than my spreadsheet."

#### Month 2: Deep Engagement

Sarah is getting more serious about her collecting. She explores the platform further.

- Sees "Rarity Data" badge on one of her 1921 Morgan dollars
- Clicks and learns this date/mintmark is rarer than she thought
- Discovers estimated survival rates and population data
- Starts checking prices daily, comparing to other stackers' public registries

**Discovery:** Intelligence tools she didn't know she needed.

#### Month 4: Premium Conversion

Sarah is now a power user and sees the value in premium features.

- Upgrades to premium for price alerts when coins hit target values
- Watches creator's break videos to learn what to buy next
- Buys a coin from the integrated storefront because she trusts the creator's picks

**Outcome:** Active community member, paying customer, brand advocate.

---

### User Type 2: The Collector (Completion-Focused)

**Meet Mike - 48, collects Morgan dollars, wants complete set**

#### Day 1: First Impression

Mike hears about the platform from a coin collecting forum. Skeptical but curious, he signs up.

- Signs up and sees "Track Your Collection - Free"
- Adds his 47 Morgan dollars one by one
- Uses PCGS grading chart to estimate each coin's grade
- Platform shows: "Morgan Dollar Set: 47/96 Complete"

**Hook:** "Oh damn, I can see my progress toward a full set!"

#### Week 1: Obsessive Adding

Mike is hooked. He spends hours cataloging his entire collection.

- Adds photos of each coin for his own reference
- Compares his grades against PCGS examples
- Platform shows exactly which dates he's missing

**Value:** "This is way better than my old Excel spreadsheet."

#### Week 3: Community Discovery

Mike discovers the social features of the platform.

- Sees "Public Registry" feature and decides to make his collection public
- Checks leaderboard - he's ranked #23 for Morgan Dollar collectors
- Competitive itch activated: "I need to move up this ranking"

**Discovery:** Gamification drives engagement.

#### Month 2: Deep in the Ecosystem

Mike is now part of the platform community and actively participating.

- Checks leaderboard weekly to see his progress
- Sees top collector has a rare 1893-S Morgan dollar
- Clicks their profile and discovers they're selling duplicates
- Watches creator's videos for tips on grading and storage

**Discovery:** Marketplace connections and educational content.

#### Month 6: Loyal Member

Mike is now a premium subscriber and active community member.

- Premium subscriber for set completion alerts (notified when missing coins become available)
- Participates in creator's break videos trying to get missing dates
- Shows off his collection to other collectors, recruits them to join

**Outcome:** Engaged user, content viewer, customer, community advocate.

---

### Common User Journey Patterns

Both Sarah and Mike follow similar engagement patterns, despite different motivations:

1. **Enter for ONE simple thing:** track my collection
2. **Get immediate value:** see what I have, current prices
3. **Discover features organically:** progressive unlocking based on usage
4. **Competitive/social element activates:** rankings, public collections
5. **Start consuming creator's content:** learn, improve, build trust
6. **Eventually purchase:** premium subscription, creator's coins, break bags

---

## Technical Specifications

### PCGS Grading Scale Integration

Users will estimate their own coin grades using a visual reference chart scraped from PCGS grading standards. This approach:

- Provides standardized grading terminology (Poor-1 through MS-70)
- Shows visual examples for each grade level
- Helps users make consistent, educated estimates
- Eliminates need for immediate AI grading (future enhancement)
- Builds user grading knowledge over time

**Implementation:** Display grading chart as modal/sidebar when users are adding or editing coins. Include close-up photos of key grade indicators like luster, wear patterns, and strike quality.

### Auto-Pricing Data Sources

Automatic price lookup requires integration with coin pricing APIs or data sources:

- PCGS Price Guide API (if available)
- NGC Price Guide
- eBay sold listings data
- Dealer wholesale price sheets
- Real-time spot metal prices for bullion

---

## Revenue Model

### Freemium Subscription Tiers

**Free Tier:**
- Unlimited coin tracking
- Basic current pricing
- Public registry (opt-in)
- Community rankings
- Basic rarity data

**Premium Tier ($9.99/month):**
- Profit tracking with historical performance
- Price alerts and notifications
- Advanced analytics and reports
- Historical price charts
- Arbitrage opportunity alerts
- Set completion notifications
- Export data for taxes

### Additional Revenue Streams

- **Direct Coin Sales:** Integrated storefront selling creator's inventory
- **Break Bags:** Copper bullion mystery bags with odds-based rewards
- **Content/Ad Revenue:** YouTube integration, sponsored content
- **Marketplace Commission:** Future user-to-user sales (Phase 4)
- **White-Label Services:** Build tools for partners (auction host, etc.)

---

## Success Metrics

### Phase 1 Goals (Months 1-3)
- 100+ active users tracking collections
- 5,000+ coins added to platform
- Daily active usage (users checking portfolio 3+ times/week)
- Low churn rate (>80% retention after 30 days)

### Phase 2 Goals (Months 3-6)
- 500+ active users
- 50+ public registries
- Regular engagement with content (video views, time on platform)
- Community interactions (profile views, collection comparisons)

### Phase 3 Goals (Months 6-12)
- 1,000+ active users
- 5-10% premium conversion rate
- Regular storefront sales
- Break bag purchases
- Sustainable revenue covering platform costs

---

## Competitive Advantages

- **Creator-Led Community:** Built-in audience from YouTube/content, trust factor
- **Progressive Discovery UX:** Not overwhelming like traditional numismatic software
- **Retail-Focused:** Not targeting dealers, focused on collectors and stackers
- **Gamification:** Rankings, set completion, social proof drive engagement
- **Integrated Content:** Educational videos show platform in action
- **Self-Service Grading:** PCGS reference empowers users without expensive AI
- **Community Marketplace:** Future buyer/seller connections within trusted environment

---

## Advanced Tools (Future Development)

| Tool | Description | Use Case | Timeline |
|------|-------------|----------|----------|
| **Quick Lookup Tool** | Fast pricing checks during live auctions | Speed up your bidding decisions | Phase 2-3 |
| **Stream Listening Tool** | Audio recognition + auto-pricing | Listen to auction stream, auto-lookup coins mentioned | Advanced/Future |
| **Coin Grading AI** | Train software to grade coins from photos | Assist with grading, scale your expertise | Long-term R&D |
| **Arbitrage Alert System** | Notify when coins are underpriced vs rarity | Premium feature, find deals automatically | Phase 3 |

---

## First-Time User Experience (Screen-by-Screen)

### Landing Page
- **Headline:** "Track Your Coin Collection"
- **Subheadline:** "Free inventory tool with live pricing"
- **One Button:** "Start Tracking" (no signup yet, just gets them in)
- **Visual:** Clean interface showing example collection

### Sign Up Flow
- Email + password (or social login)
- Under 30 seconds
- No credit card required
- Immediate access to dashboard

### Dashboard (Empty State)
- **Big CTA:** "Add Your First Coin"
- Simple form:
  - Coin type (dropdown: Morgan Dollar, Peace Dollar, Silver Eagle, etc.)
  - Year
  - Mint mark (optional)
  - Estimated grade (link to grading chart)
  - Quantity (default: 1)
- **Submit button:** "Add to Collection"

### After First Coin Added
- Shows coin card with:
  - Photo (stock image from database)
  - Current value (auto-populated)
  - Your estimated grade
  - Purchase date (optional, for profit tracking later)
- **Celebration moment:** "Great start! Add more coins to build your collection."
- **Secondary CTA:** "Add Another Coin" or "See Grading Chart"

### Grading Chart Modal
- Visual grid showing coin grades from Poor-1 to MS-70
- Photos for each grade level
- Key indicators explained (luster, wear, strike)
- **Close button** returns to dashboard

### Progressive Feature Discovery
- After 5 coins: Badge appears - "See how your collection compares" → Public Registry feature
- After 10 coins: Badge appears - "Track your profit" → Stackworth feature
- After 20 coins: Badge appears - "Find rare coins" → Rarity Data feature

---

## Platform Name Options

We discussed several naming options:

**KAP-Based Names:**
- KAP Stack (main platform)
- KAPital (wordplay on capital/investment)
- KAPture (capture your collection)

**Standalone Names:**
- Stackworth (taken)
- Vault
- Trove
- Stash
- Mintmark

**Decision:** Keep brainstorming, but lean toward KAP Stack as the main platform with internal feature names like "Stackworth" for profit tracking, "The Vault" for inventory, etc.

---

## Development Priorities

### Must Have (Phase 1 - Launch)
1. User authentication (email/password, social login)
2. Coin database (types, years, mint marks)
3. Manual coin entry form
4. Auto-pricing integration (at least one data source)
5. PCGS grading chart reference (modal/sidebar)
6. Portfolio view (list of coins with current values)
7. Mobile-responsive design

### Should Have (Phase 2 - Growth)
1. Public registry (opt-in profile sharing)
2. Community rankings/leaderboards
3. Rarity data integration
4. Set completion tracking
5. Content section (embedded videos)
6. Social features (view other collections)

### Nice to Have (Phase 3 - Monetization)
1. Premium subscription tier
2. Profit tracking
3. Price alerts
4. Advanced analytics
5. Integrated storefront
6. Break bags product

### Future Exploration (Phase 4+)
1. User-to-user marketplace
2. Grading AI
3. Stream listening tool
4. Mobile app (native iOS/Android)
5. API for third-party integrations
