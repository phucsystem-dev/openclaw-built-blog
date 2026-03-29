#!/usr/bin/env python3
"""
Update the gold dashboard visualization with historical data.
This script reads collected gold price data and updates the dashboard.
"""

import os
import json
import glob
import datetime
from pathlib import Path

def load_historical_data(data_dir="data"):
    """Load all historical gold price data"""
    historical_data = []
    
    # Find all gold price markdown files
    pattern = os.path.join(data_dir, "gold-prices-*.md")
    gold_files = sorted(glob.glob(pattern))
    
    for filepath in gold_files[-30:]:  # Last 30 days
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract JSON data from markdown file
            # Look for the JSON section
            if '```json' in content:
                json_start = content.find('```json') + 7
                json_end = content.find('```', json_start)
                json_str = content[json_start:json_end].strip()
                
                data = json.loads(json_str)
                historical_data.extend(data)
                
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
    
    return historical_data

def generate_visualization_data(historical_data):
    """Generate data for visualization"""
    
    # Group by date and brand
    grouped_data = {}
    
    for item in historical_data:
        date = item.get('date')
        brand = item.get('brand')
        
        if not date or not brand:
            continue
        
        key = (date, brand)
        if key not in grouped_data:
            grouped_data[key] = {
                'date': date,
                'brand': brand,
                'buy_prices': [],
                'sell_prices': [],
                'cities': set()
            }
        
        grouped_data[key]['buy_prices'].append(item.get('buy_price', 0))
        grouped_data[key]['sell_prices'].append(item.get('sell_price', 0))
        grouped_data[key]['cities'].add(item.get('city', ''))
    
    # Calculate averages
    visualization_data = []
    for (date, brand), data in grouped_data.items():
        avg_buy = sum(data['buy_prices']) / len(data['buy_prices']) if data['buy_prices'] else 0
        avg_sell = sum(data['sell_prices']) / len(data['sell_prices']) if data['sell_prices'] else 0
        
        visualization_data.append({
            'date': date,
            'brand': brand,
            'avg_buy': int(avg_buy),
            'avg_sell': int(avg_sell),
            'spread': int(avg_sell - avg_buy),
            'cities': list(data['cities'])
        })
    
    # Sort by date
    visualization_data.sort(key=lambda x: x['date'])
    
    return visualization_data

def create_js_data_file(visualization_data, output_path="js/gold-data.js"):
    """Create JavaScript data file for the dashboard"""
    
    # Group by brand for easier access
    brands_data = {}
    for item in visualization_data:
        brand = item['brand']
        if brand not in brands_data:
            brands_data[brand] = []
        brands_data[brand].append(item)
    
    js_content = f"""// Auto-generated gold price data
// Generated: {datetime.datetime.now().isoformat()}
// Total records: {len(visualization_data)}

const goldHistoricalData = {json.dumps(visualization_data, indent=2)};

const goldDataByBrand = {json.dumps(brands_data, indent=2)};

// Helper functions
function getBrandData(brand) {{
    return goldDataByBrand[brand] || [];
}}

function getDateRangeData(startDate, endDate) {{
    return goldHistoricalData.filter(item => 
        item.date >= startDate && item.date <= endDate
    );
}}

function getLatestPrices() {{
    // Get latest date
    const dates = [...new Set(goldHistoricalData.map(item => item.date))].sort();
    const latestDate = dates[dates.length - 1];
    
    return goldHistoricalData.filter(item => item.date === latestDate);
}}

// Export for use in dashboard
window.goldPriceData = {{
    historical: goldHistoricalData,
    byBrand: goldDataByBrand,
    getBrandData,
    getDateRangeData,
    getLatestPrices
}};

console.log('Gold price data loaded:', goldHistoricalData.length, 'records');
"""
    
    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"Generated JavaScript data file: {output_path}")
    return output_path

def update_dashboard_html(visualization_data):
    """Update the dashboard HTML with data statistics"""
    
    html_path = "gold-prices.html"
    if not os.path.exists(html_path):
        print(f"Dashboard HTML not found: {html_path}")
        return
    
    # Calculate statistics
    total_days = len(set(item['date'] for item in visualization_data))
    total_records = len(visualization_data)
    
    # Find date range
    dates = sorted(set(item['date'] for item in visualization_data))
    date_range = f"{dates[0]} to {dates[-1]}" if dates else "No data"
    
    # Read HTML
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Update statistics section (simplified - in production, use proper HTML parsing)
    # For now, we'll create a separate statistics file
    stats_content = f"""<div class="card">
    <h3><i class="fas fa-chart-bar"></i> Data Statistics</h3>
    <div class="stats-grid">
        <div class="stat-item">
            <div class="stat-label">Total Days</div>
            <div class="stat-value">{total_days}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Total Records</div>
            <div class="stat-value">{total_records}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Date Range</div>
            <div class="stat-value">{date_range}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Brands</div>
            <div class="stat-value">3</div>
        </div>
    </div>
</div>"""
    
    # Save statistics to a separate file
    stats_path = "data/statistics.html"
    with open(stats_path, 'w', encoding='utf-8') as f:
        f.write(stats_content)
    
    print(f"Updated statistics: {stats_path}")
    return stats_path

def main():
    """Main function to update dashboard with historical data"""
    print("Updating gold dashboard with historical data...")
    
    try:
        # Load historical data
        historical_data = load_historical_data()
        
        if not historical_data:
            print("No historical data found")
            return
        
        print(f"Loaded {len(historical_data)} historical records")
        
        # Generate visualization data
        viz_data = generate_visualization_data(historical_data)
        print(f"Generated {len(viz_data)} visualization records")
        
        # Create JavaScript data file
        js_file = create_js_data_file(viz_data)
        
        # Update dashboard HTML
        stats_file = update_dashboard_html(viz_data)
        
        print("Dashboard update completed successfully")
        print(f"- JavaScript data: {js_file}")
        print(f"- Statistics: {stats_file}")
        
    except Exception as e:
        print(f"Error updating dashboard: {e}")
        raise

if __name__ == "__main__":
    main()