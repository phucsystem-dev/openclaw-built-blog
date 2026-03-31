# OPENCLAW BLOG - COMPACT CONTEXT
*Last updated: 2026-03-31 03:18 UTC*

## 🎯 CURRENT STATE
✅ **All 5 pages deployed and working**
✅ **Navigation consistent** across all pages
✅ **Config system active** - Edit `js/config.js` for domain changes
✅ **Real exchange rates** - USD/EUR/GBP/AUD→VND via ExchangeRate-API
✅ **Daily automation configured** - 7 AM Melbourne time (20:00 UTC)

## 🔗 LIVE PAGES
1. **Home**: https://phucsystem-dev.github.io/openclaw-built-blog/
2. **Gold Prices**: + /gold-prices.html
3. **Gold Prices Enhanced**: + /gold-prices-enhanced.html  
4. **Exchange Rates**: + /exchange-rates.html
5. **Multi-Currency**: + /exchange-multi.html

## ⚙️ CONFIGURATION (One file to rule them all)
**File**: `js/config.js`
**Change**: `BASE_URL` variable
**Current**: `https://phucsystem-dev.github.io/openclaw-built-blog`
**Features enabled**: Real exchange rates, charts, converter, dark mode

## ⏰ AUTOMATION SYSTEM
**Workflow**: `.github/workflows/daily-data-collection.yml`
**Schedule**: 20:00 UTC daily (7 AM Melbourne next day)
**Tasks**: 
- Gold prices (mock data - can upgrade to real API)
- 4 currency pairs: USD/EUR/GBP/AUD→VND (real API)

## 📊 DATA COLLECTION STATUS
**Last run**: 2026-03-30 22:56 UTC (test)
**Next scheduled**: 2026-03-31 20:00 UTC
**Data storage**: `data/` directory as markdown files
**Real rates source**: ExchangeRate-API (free tier, 1,500 req/month)

## 🛠️ KEY FILES (Essential only)
1. `js/config.js` - Central configuration
2. `.github/workflows/daily-data-collection.yml` - Automation
3. `exchange-multi.html` + `js/exchange-multi.js` - Multi-currency dashboard
4. All HTML files - Updated navigation with relative paths

## 🎨 NAVIGATION STRUCTURE (All pages)
1. Home (active on home)
2. Blog Posts (links to #posts)
3. Gold Prices (active on gold pages)
4. Exchange Rates (active on AUD/VND page)
5. Multi-Currency (active on multi-currency page)
6. About (links to #about)
7. Contact (links to #contact)

## 📈 NEXT ACTIONS
1. **Monitor** today's 20:00 UTC automation run
2. **Verify** data collection worked (check GitHub Actions)
3. **Consider** upgrading gold prices to real API (VNAppMob/MetalPriceAPI)
4. **Optional**: Add more currencies (JPY, CNY, SGD)

## 🔍 QUICK CHECK COMMANDS
```bash
# Check all pages
for page in "" "gold-prices.html" "exchange-rates.html" "exchange-multi.html"; do
  curl -s -o /dev/null -w "$page: %{http_code}\n" "https://phucsystem-dev.github.io/openclaw-built-blog/$page"
done

# Check automation status
gh run list --repo phucsystem-dev/openclaw-built-blog --workflow=daily-data-collection.yml --limit=1
```

## 🚨 TROUBLESHOOTING
- **Page not loading**: Check GitHub Actions deployment status
- **Navigation broken**: Verify `js/config.js` is loaded
- **No real rates**: ExchangeRate-API might be rate-limited
- **Automation failed**: Check workflow permissions in repo settings

## 📝 CHANGE LOG (Recent)
- 2026-03-31: Clean up test files (7aeda59f)
- 2026-03-31: Added configurable domain system (`js/config.js`)
- 2026-03-31: Fixed navigation consistency across all pages
- 2026-03-30: Added multi-currency dashboard with real API

---
*Context size: ~2KB (vs 50KB+ previously)*
*Updated automatically on significant changes*