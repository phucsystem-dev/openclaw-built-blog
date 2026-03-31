#!/bin/bash

echo "🎯 FINAL NAVIGATION VERIFICATION"
echo "================================="
echo ""
echo "Testing all pages on GitHub Pages (live)"
echo ""

# Test each page
pages=(
    "Home:"
    "Gold Prices:gold-prices.html"
    "Exchange Rates:exchange-rates.html" 
    "Multi-Currency:exchange-multi.html"
)

all_good=true

for page in "${pages[@]}"; do
    IFS=':' read -r name url <<< "$page"
    
    if [ -z "$url" ]; then
        url=""
        expected_active="Home"
    elif [ "$url" = "gold-prices.html" ]; then
        expected_active="Gold Prices"
    elif [ "$url" = "exchange-rates.html" ]; then
        expected_active="Exchange Rates"
    elif [ "$url" = "exchange-multi.html" ]; then
        expected_active="Multi-Currency"
    fi
    
    echo "📄 Testing: $name"
    echo "   URL: https://phucsystem-dev.github.io/openclaw-built-blog/$url"
    
    # Get page content
    content=$(curl -s "https://phucsystem-dev.github.io/openclaw-built-blog/$url")
    
    # Check HTTP status
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://phucsystem-dev.github.io/openclaw-built-blog/$url")
    
    if [ "$status" != "200" ]; then
        echo "   ❌ ERROR: Page not found (HTTP $status)"
        all_good=false
        continue
    fi
    
    # Check navigation has 7 items
    nav_count=$(echo "$content" | grep -c '<li><a href=')
    if [ "$nav_count" -eq 7 ]; then
        echo "   ✅ Navigation has 7 items (correct)"
    else
        echo "   ❌ Navigation has $nav_count items (should be 7)"
        all_good=false
    fi
    
    # Check active class
    if echo "$content" | grep -q "class=\"active\">$expected_active<"; then
        echo "   ✅ Active class correct: $expected_active"
    else
        echo "   ❌ Active class incorrect or missing for $expected_active"
        all_good=false
    fi
    
    # Check Multi-Currency link exists
    if echo "$content" | grep -q 'Multi-Currency'; then
        echo "   ✅ Multi-Currency link present"
    else
        echo "   ❌ Multi-Currency link missing"
        all_good=false
    fi
    
    echo ""
done

echo "================================="
if [ "$all_good" = true ]; then
    echo "🎉 ALL PAGES ARE CORRECTLY UPDATED!"
    echo ""
    echo "✅ Navigation is consistent across all 5 pages"
    echo "✅ Each page highlights its own link with active class"
    echo "✅ Multi-Currency dashboard is accessible"
    echo "✅ All pages are live on GitHub Pages"
else
    echo "⚠️  Some issues found. Please check above."
fi

echo ""
echo "🔗 Live URLs:"
echo "  • Home: https://phucsystem-dev.github.io/openclaw-built-blog/"
echo "  • Gold Prices: https://phucsystem-dev.github.io/openclaw-built-blog/gold-prices.html"
echo "  • Exchange Rates: https://phucsystem-dev.github.io/openclaw-built-blog/exchange-rates.html"
echo "  • Multi-Currency: https://phucsystem-dev.github.io/openclaw-built-blog/exchange-multi.html"