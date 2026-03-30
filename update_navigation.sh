#!/bin/bash

# Update navigation in all HTML files to include Exchange Rates

echo "Updating navigation in HTML files..."

# Files to update
FILES="index.html gold-prices.html gold-prices-enhanced.html exchange-rates.html"

for file in $FILES; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        
        # Create backup
        cp "$file" "$file.bak"
        
        # Update navigation
        sed -i 's|<li><a href="gold-prices.html">Gold Prices</a></li>|<li><a href="gold-prices.html">Gold Prices</a></li>\n                    <li><a href="exchange-rates.html">Exchange Rates</a></li>|' "$file"
        
        # Update active class for each file
        if [ "$file" = "index.html" ]; then
            sed -i 's|<li><a href="/" class="active">Home</a></li>|<li><a href="/" class="active">Home</a></li>|' "$file"
            sed -i 's|<li><a href="exchange-rates.html">Exchange Rates</a></li>|<li><a href="exchange-rates.html">Exchange Rates</a></li>|' "$file"
        elif [ "$file" = "gold-prices.html" ]; then
            sed -i 's|<li><a href="gold-prices.html">Gold Prices</a></li>|<li><a href="gold-prices.html" class="active">Gold Prices</a></li>|' "$file"
            sed -i 's|<li><a href="exchange-rates.html">Exchange Rates</a></li>|<li><a href="exchange-rates.html">Exchange Rates</a></li>|' "$file"
        elif [ "$file" = "gold-prices-enhanced.html" ]; then
            sed -i 's|<li><a href="gold-prices-enhanced.html" class="active">Advanced View</a></li>|<li><a href="gold-prices-enhanced.html" class="active">Advanced View</a></li>|' "$file"
            sed -i 's|<li><a href="exchange-rates.html">Exchange Rates</a></li>|<li><a href="exchange-rates.html">Exchange Rates</a></li>|' "$file"
        elif [ "$file" = "exchange-rates.html" ]; then
            sed -i 's|<li><a href="exchange-rates.html" class="active">Exchange Rates</a></li>|<li><a href="exchange-rates.html" class="active">Exchange Rates</a></li>|' "$file"
        fi
        
        echo "  $file updated"
    else
        echo "  $file not found"
    fi
done

echo "Navigation update complete!"