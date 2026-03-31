#!/bin/bash

echo "=== COMPREHENSIVE NAVIGATION CHECK ==="
echo "Checking all pages on GitHub Pages..."
echo ""

pages=(
    "Home:"
    "Gold Prices:gold-prices.html"
    "Gold Prices (Enhanced):gold-prices-enhanced.html"
    "Exchange Rates:exchange-rates.html"
    "Multi-Currency:exchange-multi.html"
)

for page in "${pages[@]}"; do
    IFS=':' read -r name url <<< "$page"
    
    if [ -z "$url" ]; then
        url=""
        name="Home"
    fi
    
    echo "=== $name ==="
    echo "URL: https://phucsystem-dev.github.io/openclaw-built-blog/$url"
    
    # Check if page exists
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://phucsystem-dev.github.io/openclaw-built-blog/$url")
    echo "HTTP Status: $status"
    
    if [ "$status" = "200" ]; then
        # Get navigation section
        nav=$(curl -s "https://phucsystem-dev.github.io/openclaw-built-blog/$url" | grep -A20 "nav-links" | head -25)
        
        echo "Navigation links found:"
        echo "$nav" | grep -o '<li>.*</li>' | sed 's/<[^>]*>//g' | sed 's/^/  • /'
        
        # Check active class
        echo -n "Active page: "
        echo "$nav" | grep 'class="active"' | sed 's/.*>\([^<]*\)<.*/\1/' || echo "None found"
    else
        echo "ERROR: Page not found!"
    fi
    
    echo ""
done

echo "=== SUMMARY ==="
echo "All 5 pages should have consistent navigation with:"
echo "  • Home"
echo "  • Blog Posts" 
echo "  • Gold Prices"
echo "  • Exchange Rates"
echo "  • Multi-Currency"
echo "  • About"
echo "  • Contact"
echo ""
echo "Each page should highlight its own link with class=\"active\""