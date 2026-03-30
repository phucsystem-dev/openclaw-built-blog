#!/usr/bin/env python3
"""
Daily Exchange Rate Fetcher for AUD/VND
Fetches exchange rates from currency APIs and stores them in markdown files.
"""

import os
import json
import requests
import datetime
import pytz
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Melbourne timezone
MELBOURNE_TZ = pytz.timezone('Australia/Melbourne')

def get_current_melbourne_time():
    """Get current time in Melbourne timezone"""
    return datetime.datetime.now(MELBOURNE_TZ)

def generate_mock_exchange_data():
    """
    Generate realistic mock exchange rate data.
    In production, replace with actual API calls to:
    - ExchangeRate-API: https://www.exchangerate-api.com/
    - Open Exchange Rates: https://openexchangerates.org/
    - Fixer.io: https://fixer.io/
    """
    current_time = get_current_melbourne_time()
    
    # Base AUD/VND rate with realistic variations
    # Current approximate rate: 1 AUD ≈ 16,500 VND
    base_rate = 16500
    
    # Add realistic daily variation (±1%)
    import random
    variation = random.uniform(-0.01, 0.01)
    current_rate = round(base_rate * (1 + variation), 2)
    
    # Generate data for multiple banks/rates
    data = {
        'timestamp': current_time.isoformat(),
        'date': current_time.strftime('%Y-%m-%d'),
        'time': current_time.strftime('%H:%M:%S'),
        'base_currency': 'AUD',
        'target_currency': 'VND',
        'rates': {
            'mid_market': {
                'rate': current_rate,
                'source': 'Mid-market average',
                'buy': current_rate * 0.995,  # 0.5% spread
                'sell': current_rate * 1.005   # 0.5% spread
            },
            'commonwealth_bank': {
                'rate': current_rate * 1.02,  # 2% markup
                'source': 'Commonwealth Bank',
                'buy': current_rate * 1.015,
                'sell': current_rate * 1.025
            },
            'westpac': {
                'rate': current_rate * 1.019,
                'source': 'Westpac',
                'buy': current_rate * 1.014,
                'sell': current_rate * 1.024
            },
            'anz': {
                'rate': current_rate * 1.021,
                'source': 'ANZ',
                'buy': current_rate * 1.016,
                'sell': current_rate * 1.026
            },
            'nab': {
                'rate': current_rate * 1.018,
                'source': 'NAB',
                'buy': current_rate * 1.013,
                'sell': current_rate * 1.023
            },
            'wise': {
                'rate': current_rate * 1.005,  # Low fee
                'source': 'Wise (TransferWise)',
                'buy': current_rate * 1.002,
                'sell': current_rate * 1.008
            },
            'xe': {
                'rate': current_rate,
                'source': 'XE.com',
                'buy': current_rate * 0.998,
                'sell': current_rate * 1.002
            }
        },
        'statistics': {
            'average_rate': current_rate * 1.012,
            'min_rate': current_rate * 1.002,
            'max_rate': current_rate * 1.025,
            'spread_avg': current_rate * 0.01  # 1% average spread
        }
    }
    
    return data

def fetch_real_exchange_rates():
    """
    Fetch real exchange rates from currency APIs.
    This is a placeholder - you need to add your API keys.
    """
    # Uncomment and configure with your API keys
    
    # Option 1: ExchangeRate-API (free tier available)
    # API_URL = "https://api.exchangerate-api.com/v4/latest/AUD"
    # response = requests.get(API_URL)
    # data = response.json()
    # vnd_rate = data['rates']['VND']
    
    # Option 2: Open Exchange Rates (requires API key)
    # API_URL = "https://openexchangerates.org/api/latest.json"
    # params = {
    #     "app_id": "YOUR_OPENEXCHANGERATES_API_KEY",
    #     "base": "AUD",
    #     "symbols": "VND"
    # }
    # response = requests.get(API_URL, params=params)
    # data = response.json()
    # vnd_rate = data['rates']['VND']
    
    # Option 3: Fixer.io (requires API key)
    # API_URL = "http://data.fixer.io/api/latest"
    # params = {
    #     "access_key": "YOUR_FIXER_API_KEY",
    #     "base": "AUD",
    #     "symbols": "VND"
    # }
    
    # For now, use mock data
    logger.info("Using mock data. Configure API keys for real exchange rates.")
    return generate_mock_exchange_data()

def save_to_markdown(data, output_dir="data/exchange"):
    """Save exchange rate data to markdown file"""
    
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    current_time = get_current_melbourne_time()
    
    # Create filename: exchange-aud-vnd-YYYY-MM-DD.md
    filename = f"exchange-aud-vnd-{current_time.strftime('%Y-%m-%d')}.md"
    filepath = os.path.join(output_dir, filename)
    
    # Format markdown content
    markdown_content = f"""# AUD to VND Exchange Rates - {current_time.strftime('%A, %d %B %Y')}

**Last Updated:** {current_time.strftime('%H:%M:%S %Z')} (Melbourne Time)

## Summary
- **Date:** {current_time.strftime('%Y-%m-%d')}
- **Base Currency:** AUD (Australian Dollar)
- **Target Currency:** VND (Vietnamese Dong)
- **Mid-market Rate:** 1 AUD = {data['rates']['mid_market']['rate']:,.2f} VND
- **Best Rate:** 1 AUD = {data['statistics']['min_rate']:,.2f} VND (Wise)
- **Worst Rate:** 1 AUD = {data['statistics']['max_rate']:,.2f} VND (ANZ)

## Exchange Rates by Provider

| Provider | Rate (1 AUD → VND) | Buy Rate | Sell Rate | Spread |
|----------|-------------------|----------|-----------|--------|
"""
    
    # Add rate rows
    for provider, rate_data in data['rates'].items():
        spread = rate_data['sell'] - rate_data['buy']
        spread_percent = (spread / rate_data['rate']) * 100
        
        markdown_content += f"| {rate_data['source']} | {rate_data['rate']:,.2f} | {rate_data['buy']:,.2f} | {rate_data['sell']:,.2f} | {spread:,.2f} ({spread_percent:.2f}%) |\n"
    
    # Add statistics section
    markdown_content += f"""

## Statistics
- **Average Rate:** {data['statistics']['average_rate']:,.2f} VND per AUD
- **Minimum Rate:** {data['statistics']['min_rate']:,.2f} VND per AUD
- **Maximum Rate:** {data['statistics']['max_rate']:,.2f} VND per AUD
- **Average Spread:** {data['statistics']['spread_avg']:,.2f} VND ({data['statistics']['spread_avg']/data['rates']['mid_market']['rate']*100:.2f}%)

## Conversion Examples

| AUD Amount | VND Equivalent (Mid-market) |
|------------|-----------------------------|
| 1 AUD | {data['rates']['mid_market']['rate']:,.0f} VND |
| 10 AUD | {data['rates']['mid_market']['rate'] * 10:,.0f} VND |
| 50 AUD | {data['rates']['mid_market']['rate'] * 50:,.0f} VND |
| 100 AUD | {data['rates']['mid_market']['rate'] * 100:,.0f} VND |
| 500 AUD | {data['rates']['mid_market']['rate'] * 500:,.0f} VND |
| 1,000 AUD | {data['rates']['mid_market']['rate'] * 1000:,.0f} VND |

## Raw Data (JSON)
```json
{json.dumps(data, indent=2, ensure_ascii=False)}
```

## Notes
- Rates are for informational purposes only
- Actual rates may vary by provider and transaction size
- Bank rates typically include fees and margins
- Mid-market rate is the average between buy and sell rates
- Data collected daily at 7:00 AM Melbourne time
"""
    
    # Write to file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    logger.info(f"Exchange rate data saved to {filepath}")
    return filepath

def update_summary_file(data_dir="data/exchange"):
    """Update summary markdown file with latest data"""
    
    summary_path = os.path.join(data_dir, "EXCHANGE_RATES_SUMMARY.md")
    
    # Get all exchange rate files
    exchange_files = sorted([f for f in os.listdir(data_dir) if f.startswith('exchange-aud-vnd-') and f.endswith('.md')])
    
    if not exchange_files:
        logger.warning("No exchange rate files found")
        return
    
    summary_content = """# AUD to VND Exchange Rates Summary

## Overview
Daily collection of AUD to VND exchange rates from various providers.

## Available Data
| Date | File | Mid-market Rate |
|------|------|-----------------|
"""
    
    # Add file listings
    for exchange_file in exchange_files[-30:]:  # Last 30 days
        filepath = os.path.join(data_dir, exchange_file)
        date_str = exchange_file.replace('exchange-aud-vnd-', '').replace('.md', '')
        
        # Try to extract rate from file
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                # Extract mid-market rate (simplified)
                import re
                rate_match = re.search(r'Mid-market Rate: 1 AUD = ([0-9,]+\.?[0-9]*) VND', content)
                rate = rate_match.group(1) if rate_match else 'N/A'
        except:
            rate = 'N/A'
        
        summary_content += f"| {date_str} | [{exchange_file}]({exchange_file}) | {rate} |\n"
    
    # Add statistics section
    summary_content += f"""

## Statistics
- **Total data files:** {len(exchange_files)}
- **Date range:** {exchange_files[0].replace('exchange-aud-vnd-', '').replace('.md', '')} to {exchange_files[-1].replace('exchange-aud-vnd-', '').replace('.md', '')}
- **Update schedule:** Daily at 7:00 AM Melbourne time

## Providers Tracked
1. **Mid-market average** - Theoretical average rate
2. **Commonwealth Bank** - Major Australian bank
3. **Westpac** - Major Australian bank
4. **ANZ** - Major Australian bank
5. **NAB** - Major Australian bank
6. **Wise** - Low-cost international transfer service
7. **XE.com** - Currency data provider

## Usage
1. Compare rates across different providers
2. Track historical exchange rate trends
3. Calculate conversion amounts
4. Identify best times to exchange currency

## Visualization
Visit the [Exchange Rate Dashboard](/exchange-rates.html) for interactive charts and calculators.
"""
    
    with open(summary_path, 'w', encoding='utf-8') as f:
        f.write(summary_content)
    
    logger.info(f"Exchange rate summary updated: {summary_path}")

def main():
    """Main function to fetch and save exchange rates"""
    logger.info("Starting exchange rate data collection...")
    
    try:
        # Fetch exchange rates
        exchange_data = fetch_real_exchange_rates()
        
        # Save to markdown file
        saved_file = save_to_markdown(exchange_data)
        
        # Update summary file
        update_summary_file()
        
        logger.info(f"Exchange rate collection completed: {saved_file}")
        
        # Return success
        return {
            "status": "success",
            "file": saved_file,
            "timestamp": get_current_melbourne_time().isoformat(),
            "mid_market_rate": exchange_data['rates']['mid_market']['rate']
        }
        
    except Exception as e:
        logger.error(f"Error collecting exchange rates: {e}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": get_current_melbourne_time().isoformat()
        }

if __name__ == "__main__":
    result = main()
    print(json.dumps(result, indent=2))