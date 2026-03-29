#!/usr/bin/env python3
"""
Daily Gold Price Fetcher for Vietnam Gold Dashboard
Fetches gold prices from Vietnamese gold APIs and stores them in markdown files.
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

def generate_mock_data():
    """
    Generate realistic mock gold price data.
    In production, replace with actual API calls to:
    - VNAppMob API: https://api.vnappmob.com/api/v2/gold
    - MetalPriceAPI: https://api.metalpriceapi.com/v1/latest
    """
    current_time = get_current_melbourne_time()
    
    # Base prices with realistic variations
    base_prices = {
        'sjc': {
            'hcm': {'buy': 84500000, 'sell': 84700000},
            'hn': {'buy': 84400000, 'sell': 84600000}
        },
        'doji': {
            'hcm': {'buy': 84300000, 'sell': 84500000},
            'hn': {'buy': 84200000, 'sell': 84400000}
        },
        'pnj': {
            'hcm': {'buy': 84200000, 'sell': 84400000},
            'hn': {'buy': 84100000, 'sell': 84300000}
        }
    }
    
    # Add small random variations (±0.5%)
    import random
    data = []
    for brand, cities in base_prices.items():
        for city, prices in cities.items():
            variation = random.uniform(-0.005, 0.005)
            buy_price = int(prices['buy'] * (1 + variation))
            sell_price = int(prices['sell'] * (1 + variation))
            
            data.append({
                'brand': brand.upper(),
                'city': 'Ho Chi Minh City' if city == 'hcm' else 'Hanoi',
                'buy_price': buy_price,
                'sell_price': sell_price,
                'spread': sell_price - buy_price,
                'timestamp': current_time.isoformat(),
                'date': current_time.strftime('%Y-%m-%d'),
                'time': current_time.strftime('%H:%M:%S')
            })
    
    return data

def fetch_real_gold_prices():
    """
    Fetch real gold prices from Vietnamese gold APIs.
    This is a placeholder - you need to add your API keys.
    """
    # Uncomment and configure with your API keys
    
    # Option 1: VNAppMob API (Vietnamese gold prices)
    # API_URL = "https://api.vnappmob.com/api/v2/gold"
    # headers = {
    #     "Authorization": "Bearer YOUR_VNAPPMOB_API_KEY",
    #     "Content-Type": "application/json"
    # }
    
    # Option 2: MetalPriceAPI (International gold prices)
    # API_URL = "https://api.metalpriceapi.com/v1/latest"
    # params = {
    #     "api_key": "YOUR_METALPRICEAPI_KEY",
    #     "base": "XAU",  # Gold
    #     "currencies": "VND"
    # }
    
    # For now, use mock data
    logger.info("Using mock data. Configure API keys for real data.")
    return generate_mock_data()

def save_to_markdown(data, output_dir="data"):
    """Save gold price data to markdown file"""
    
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    current_time = get_current_melbourne_time()
    
    # Create filename: gold-prices-YYYY-MM-DD.md
    filename = f"gold-prices-{current_time.strftime('%Y-%m-%d')}.md"
    filepath = os.path.join(output_dir, filename)
    
    # Format markdown content
    markdown_content = f"""# Gold Prices - {current_time.strftime('%A, %d %B %Y')}

**Last Updated:** {current_time.strftime('%H:%M:%S %Z')} (Melbourne Time)

## Summary
- **Date:** {current_time.strftime('%Y-%m-%d')}
- **Total Records:** {len(data)}
- **Brands:** SJC, DOJI, PNJ
- **Cities:** Ho Chi Minh City, Hanoi

## Price Data

| Brand | City | Buy Price (VND/tael) | Sell Price (VND/tael) | Spread | Timestamp |
|-------|------|---------------------|----------------------|--------|-----------|
"""
    
    # Add data rows
    for item in data:
        markdown_content += f"| {item['brand']} | {item['city']} | {item['buy_price']:,} | {item['sell_price']:,} | {item['spread']:,} | {item['time']} |\n"
    
    # Add JSON data for programmatic access
    markdown_content += f"""

## Raw Data (JSON)
```json
{json.dumps(data, indent=2, ensure_ascii=False)}
```

## Notes
- Prices are in Vietnamese Dong (VND) per tael (37.5g)
- Data collected at 7:00 AM Melbourne time daily
- Spread = Sell Price - Buy Price
- For real-time data, configure API keys in the script
"""
    
    # Write to file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    logger.info(f"Data saved to {filepath}")
    return filepath

def update_summary_file(data_dir="data"):
    """Update summary markdown file with latest data"""
    
    summary_path = os.path.join(data_dir, "GOLD_PRICES_SUMMARY.md")
    
    # Get all gold price files
    gold_files = sorted([f for f in os.listdir(data_dir) if f.startswith('gold-prices-') and f.endswith('.md')])
    
    if not gold_files:
        logger.warning("No gold price files found")
        return
    
    summary_content = """# Gold Prices Summary

## Overview
Daily collection of Vietnam gold prices (SJC, DOJI, PNJ) for Ho Chi Minh City and Hanoi.

## Available Data
| Date | File | Records |
|------|------|---------|
"""
    
    # Add file listings
    for gold_file in gold_files[-30:]:  # Last 30 days
        filepath = os.path.join(data_dir, gold_file)
        date_str = gold_file.replace('gold-prices-', '').replace('.md', '')
        
        # Count records (simplified - in production, parse the file)
        record_count = 6  # Default for our data structure
        
        summary_content += f"| {date_str} | [{gold_file}]({gold_file}) | {record_count} |\n"
    
    # Add statistics section
    summary_content += f"""

## Statistics
- **Total data files:** {len(gold_files)}
- **Date range:** {gold_files[0].replace('gold-prices-', '').replace('.md', '')} to {gold_files[-1].replace('gold-prices-', '').replace('.md', '')}
- **Update schedule:** Daily at 7:00 AM Melbourne time

## Usage
1. Each daily file contains prices for SJC, DOJI, PNJ in Ho Chi Minh City and Hanoi
2. Data includes buy/sell prices and spreads
3. JSON format available for programmatic access
4. Use for historical analysis and visualization

## Visualization
Visit the [Gold Dashboard](https://phucsystem-dev.github.io/openclaw-built-blog/gold-prices.html) for interactive charts.
"""
    
    with open(summary_path, 'w', encoding='utf-8') as f:
        f.write(summary_content)
    
    logger.info(f"Summary updated: {summary_path}")

def main():
    """Main function to fetch and save gold prices"""
    logger.info("Starting gold price data collection...")
    
    try:
        # Fetch gold prices
        gold_data = fetch_real_gold_prices()
        
        # Save to markdown file
        saved_file = save_to_markdown(gold_data)
        
        # Update summary file
        update_summary_file()
        
        logger.info(f"Gold price collection completed: {saved_file}")
        
        # Return success
        return {
            "status": "success",
            "file": saved_file,
            "records": len(gold_data),
            "timestamp": get_current_melbourne_time().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error collecting gold prices: {e}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": get_current_melbourne_time().isoformat()
        }

if __name__ == "__main__":
    result = main()
    print(json.dumps(result, indent=2))