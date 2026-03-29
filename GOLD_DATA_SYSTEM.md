# Gold Price Data Collection System

## Overview
Automated system for collecting, storing, and visualizing Vietnam gold price data daily at 7 AM Melbourne time.

## Architecture

### 1. **Data Collection** (`scripts/fetch_gold_prices.py`)
- Runs daily via GitHub Actions
- Fetches gold prices from Vietnamese gold APIs (currently mock data)
- Stores data in markdown files in `data/` directory
- Creates one file per day: `gold-prices-YYYY-MM-DD.md`

### 2. **Storage Format**
Each markdown file contains:
- Human-readable price table
- JSON data for programmatic access
- Metadata (timestamp, record count, etc.)
- Files are version-controlled in Git

### 3. **Visualization** (`gold-prices-enhanced.html`)
- Interactive dashboard with multiple time scales
- Three chart types: Price Trend, Brand Comparison, Spread Analysis
- Filter by brand, city, and time scale
- Export data as CSV or JSON

### 4. **Automation** (`.github/workflows/daily-gold-prices.yml`)
- Scheduled daily at 7 AM Melbourne time (20:00 UTC)
- Automatically commits new data files
- Updates visualization with historical data

## Files Structure

```
openclaw-built-blog/
├── .github/workflows/
│   └── daily-gold-prices.yml      # GitHub Actions workflow
├── scripts/
│   ├── fetch_gold_prices.py       # Data collection script
│   ├── update_dashboard.py        # Dashboard update script
│   └── requirements.txt           # Python dependencies
├── data/                          # Historical data storage
│   ├── gold-prices-2024-03-29.md  # Daily data files
│   ├── gold-prices-2024-03-30.md
│   └── GOLD_PRICES_SUMMARY.md     # Data summary
├── js/
│   ├── gold-dashboard-enhanced.js # Enhanced dashboard logic
│   └── gold-data.js              # Auto-generated data (from update_dashboard.py)
├── gold-prices.html              # Simple current prices view
├── gold-prices-enhanced.html     # Advanced historical view
└── GOLD_DATA_SYSTEM.md           # This documentation
```

## Setup Instructions

### 1. **Enable GitHub Actions**
The workflow is already configured. It will run automatically.

### 2. **Configure API Keys (Optional)**
For real gold price data, add API keys as GitHub Secrets:

1. **VNAppMob API** (Vietnamese gold prices):
   - Get API key: https://api.vnappmob.com/api/request_api_key?scope=gold
   - Add secret: `VNAPPMOB_API_KEY`

2. **MetalPriceAPI** (International gold prices):
   - Get API key: https://metalpriceapi.com/
   - Add secret: `METALPRICEAPI_KEY`

Then update `scripts/fetch_gold_prices.py` to use the real APIs.

### 3. **Manual Testing**
```bash
# Test the data collection script
cd scripts
python fetch_gold_prices.py

# Test the dashboard update
python update_dashboard.py
```

## Usage

### **Simple View** (`/gold-prices.html`)
- Current gold prices only
- Basic table format
- Quick loading

### **Advanced View** (`/gold-prices-enhanced.html`)
- Historical data visualization
- Multiple time scales (1 week to 1 year)
- Interactive charts
- Data filtering and export

### **Accessing Data Programmatically**
```javascript
// After gold-data.js loads
const latestPrices = window.goldPriceData.getLatestPrices();
const brandData = window.goldPriceData.getBrandData('SJC');
const dateRangeData = window.goldPriceData.getDateRangeData('2024-03-01', '2024-03-31');
```

## Time Scales Available

| Scale | Days | Description |
|-------|------|-------------|
| 1 Week | 7 | Recent price movements |
| 2 Weeks | 14 | Short-term trends |
| 1 Month | 30 | Monthly analysis |
| 3 Months | 90 | Quarterly trends |
| 6 Months | 180 | Half-year analysis |
| 1 Year | 365 | Annual trends |

## Data Schema

Each record includes:
```json
{
  "date": "2024-03-29",
  "brand": "SJC",
  "city": "Ho Chi Minh City",
  "avg_buy": 84500000,
  "avg_sell": 84700000,
  "spread": 2000000,
  "cities": ["Ho Chi Minh City"]
}
```

## Maintenance

### **Adding New Brands**
1. Update `scripts/fetch_gold_prices.py` base prices
2. Update brand colors in `js/gold-dashboard-enhanced.js`
3. Add to brand filter in `gold-prices-enhanced.html`

### **Adding New Cities**
1. Update data collection script
2. Update city filter options
3. Update visualization logic

### **Extending Time Scales**
Add new entries to `timeScales` object in `js/gold-dashboard-enhanced.js`

## Monitoring

### **GitHub Actions**
- Check workflow runs: `https://github.com/username/repo/actions`
- View logs for debugging
- Manual trigger available

### **Data Quality**
- Review generated markdown files in `data/` directory
- Check `GOLD_PRICES_SUMMARY.md` for overview
- Monitor data consistency

## Troubleshooting

### **Workflow Not Running**
1. Check GitHub Actions permissions
2. Verify cron schedule (20:00 UTC = 7 AM Melbourne winter time)
3. Check workflow file syntax

### **No Data Showing**
1. Check if data files exist in `data/` directory
2. Verify JavaScript console for errors
3. Check if `gold-data.js` is generated

### **Charts Not Loading**
1. Verify Chart.js is loaded
2. Check browser console for errors
3. Ensure data is properly formatted

## Future Enhancements

1. **Real API Integration** - Connect to Vietnamese gold price APIs
2. **Email Alerts** - Notify when prices cross thresholds
3. **Mobile App** - Native app for price tracking
4. **Predictive Analytics** - Price forecasting
5. **Multi-currency** - Convert to USD, AUD, etc.
6. **Social Sharing** - Share price charts on social media

## License
MIT License - See main repository LICENSE file

## Support
For issues or questions:
1. Check GitHub Actions logs
2. Review generated data files
3. Open GitHub issue in the repository