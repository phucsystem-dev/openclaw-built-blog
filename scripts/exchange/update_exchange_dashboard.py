#!/usr/bin/env python3
"""
Update the exchange rate dashboard with historical data.
This script reads collected exchange rate data and updates the dashboard.
"""

import os
import json
import glob
import datetime
from pathlib import Path

def load_historical_exchange_data(data_dir="data/exchange"):
    """Load all historical exchange rate data"""
    historical_data = []
    
    # Find all exchange rate markdown files
    pattern = os.path.join(data_dir, "exchange-aud-vnd-*.md")
    exchange_files = sorted(glob.glob(pattern))
    
    for filepath in exchange_files[-90:]:  # Last 90 days
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract JSON data from markdown file
            if '```json' in content:
                json_start = content.find('```json') + 7
                json_end = content.find('```', json_start)
                json_str = content[json_start:json_end].strip()
                
                data = json.loads(json_str)
                historical_data.append(data)
                
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
    
    return historical_data

def generate_exchange_visualization_data(historical_data):
    """Generate data for exchange rate visualization"""
    
    visualization_data = []
    
    for item in historical_data:
        date = item.get('date')
        if not date:
            continue
        
        # Extract rates
        rates = item.get('rates', {})
        mid_market = rates.get('mid_market', {})
        
        visualization_data.append({
            'date': date,
            'mid_market_rate': mid_market.get('rate', 0),
            'average_rate': item.get('statistics', {}).get('average_rate', 0),
            'min_rate': item.get('statistics', {}).get('min_rate', 0),
            'max_rate': item.get('statistics', {}).get('max_rate', 0)
        })
    
    # Sort by date
    visualization_data.sort(key=lambda x: x['date'])
    
    return visualization_data

def create_exchange_js_data_file(visualization_data, historical_data=None, output_path="js/exchange-data.js"):
    """Create JavaScript data file for the exchange dashboard"""
    
    # Get latest data for current rates
    latest_data = visualization_data[-1] if visualization_data else {}
    
    # Prepare provider rates from latest data
    provider_rates = {}
    if historical_data and len(historical_data) > 0:
        latest_full_data = historical_data[-1]
        rates = latest_full_data.get('rates', {})
        for provider_id, rate_data in rates.items():
            provider_rates[provider_id] = rate_data
    
    js_content = f"""// Auto-generated exchange rate data
// Generated: {datetime.datetime.now().isoformat()}
// Total records: {len(visualization_data)}

const exchangeHistoricalData = {json.dumps(visualization_data, indent=2)};

const exchangeCurrentRates = {json.dumps(latest_data, indent=2)};

const exchangeProviderRates = {json.dumps(provider_rates, indent=2)};

// Helper functions
function getExchangeRateByDate(date) {{
    return exchangeHistoricalData.find(item => item.date === date);
}}

function getDateRangeExchangeData(startDate, endDate) {{
    return exchangeHistoricalData.filter(item => 
        item.date >= startDate && item.date <= endDate
    );
}}

function getLatestExchangeRate() {{
    return exchangeHistoricalData[exchangeHistoricalData.length - 1] || {{}};
}}

function convertAUDtoVND(audAmount, rateType = 'mid_market_rate') {{
    const latest = getLatestExchangeRate();
    const rate = latest[rateType] || latest.mid_market_rate || 16500;
    return audAmount * rate;
}}

function convertVNDtoAUD(vndAmount, rateType = 'mid_market_rate') {{
    const latest = getLatestExchangeRate();
    const rate = latest[rateType] || latest.mid_market_rate || 16500;
    return vndAmount / rate;
}}

// Export for use in dashboard
window.exchangeRateData = {{
    historical: exchangeHistoricalData,
    current: exchangeCurrentRates,
    providers: exchangeProviderRates,
    getExchangeRateByDate,
    getDateRangeExchangeData,
    getLatestExchangeRate,
    convertAUDtoVND,
    convertVNDtoAUD
}};

console.log('Exchange rate data loaded:', exchangeHistoricalData.length, 'records');
"""
    
    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"Generated JavaScript exchange data file: {output_path}")
    return output_path

def update_exchange_dashboard_html(visualization_data):
    """Update the exchange dashboard HTML with data statistics"""
    
    html_path = "exchange-rates.html"
    if not os.path.exists(html_path):
        print(f"Exchange dashboard HTML not found: {html_path}")
        return
    
    # Calculate statistics
    total_days = len(visualization_data)
    
    if total_days > 0:
        # Find date range
        dates = [item['date'] for item in visualization_data]
        date_range = f"{dates[0]} to {dates[-1]}"
        
        # Calculate average rate
        avg_rate = sum(item['mid_market_rate'] for item in visualization_data) / total_days
        
        # Calculate min/max
        min_rate = min(item['mid_market_rate'] for item in visualization_data)
        max_rate = max(item['mid_market_rate'] for item in visualization_data)
        
        stats_content = f"""<div class="card">
    <h3><i class="fas fa-chart-bar"></i> Exchange Rate Statistics</h3>
    <div class="stats-grid">
        <div class="stat-item">
            <div class="stat-label">Total Days</div>
            <div class="stat-value">{total_days}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Date Range</div>
            <div class="stat-value">{date_range}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Average Rate</div>
            <div class="stat-value">{avg_rate:,.2f}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Range</div>
            <div class="stat-value">{min_rate:,.0f}-{max_rate:,.0f}</div>
        </div>
    </div>
</div>"""
    else:
        stats_content = """<div class="card">
    <h3><i class="fas fa-chart-bar"></i> Exchange Rate Statistics</h3>
    <p>No historical data available yet. Data will appear after the first daily collection.</p>
</div>"""
    
    # Save statistics to a separate file
    stats_path = "data/exchange/statistics.html"
    with open(stats_path, 'w', encoding='utf-8') as f:
        f.write(stats_content)
    
    print(f"Updated exchange statistics: {stats_path}")
    return stats_path

def main():
    """Main function to update exchange dashboard with historical data"""
    print("Updating exchange dashboard with historical data...")
    
    try:
        # Load historical data
        historical_data = load_historical_exchange_data()
        
        if not historical_data:
            print("No historical exchange data found")
            # Create empty data structure
            visualization_data = []
        else:
            print(f"Loaded {len(historical_data)} historical exchange records")
            
            # Generate visualization data
            visualization_data = generate_exchange_visualization_data(historical_data)
            print(f"Generated {len(visualization_data)} visualization records")
        
        # Create JavaScript data file
        js_file = create_exchange_js_data_file(visualization_data, historical_data)
        
        # Update dashboard HTML
        stats_file = update_exchange_dashboard_html(visualization_data)
        
        print("Exchange dashboard update completed successfully")
        print(f"- JavaScript data: {js_file}")
        print(f"- Statistics: {stats_file}")
        
    except Exception as e:
        print(f"Error updating exchange dashboard: {e}")
        raise

if __name__ == "__main__":
    main()