#!/usr/bin/env python3
"""
Update navigation bar on all HTML pages to be consistent.
"""

import os
import re

# Consistent navigation for all pages
CONSISTENT_NAV = '''                <ul class="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/#posts">Blog Posts</a></li>
                    <li><a href="/gold-prices.html">Gold Prices</a></li>
                    <li><a href="/exchange-rates.html">Exchange Rates</a></li>
                    <li><a href="/exchange-multi.html">Multi-Currency</a></li>
                    <li><a href="/#about">About</a></li>
                    <li><a href="/#contact">Contact</a></li>
                </ul>'''

def update_navigation_in_file(filepath, current_page):
    """Update navigation in a single HTML file"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the navigation section
    nav_pattern = r'<ul class="nav-links">.*?</ul>'
    
    if re.search(nav_pattern, content, re.DOTALL):
        # Update active class based on current page
        updated_nav = CONSISTENT_NAV
        
        # Set active class for current page
        if current_page == 'home':
            updated_nav = updated_nav.replace('href="/">Home<', 'href="/" class="active">Home<')
        elif current_page == 'gold-prices':
            updated_nav = updated_nav.replace('href="/gold-prices.html">Gold Prices<', 'href="/gold-prices.html" class="active">Gold Prices<')
        elif current_page == 'exchange-rates':
            updated_nav = updated_nav.replace('href="/exchange-rates.html">Exchange Rates<', 'href="/exchange-rates.html" class="active">Exchange Rates<')
        elif current_page == 'exchange-multi':
            updated_nav = updated_nav.replace('href="/exchange-multi.html">Multi-Currency<', 'href="/exchange-multi.html" class="active">Multi-Currency<')
        elif current_page == 'gold-prices-enhanced':
            # For enhanced gold page, still highlight Gold Prices
            updated_nav = updated_nav.replace('href="/gold-prices.html">Gold Prices<', 'href="/gold-prices.html" class="active">Gold Prices<')
        
        # Replace the navigation
        new_content = re.sub(nav_pattern, updated_nav, content, flags=re.DOTALL)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True
    else:
        print(f"  Warning: Could not find navigation in {filepath}")
        return False

def main():
    """Update navigation on all HTML files"""
    
    files_to_update = [
        ('index.html', 'home'),
        ('gold-prices.html', 'gold-prices'),
        ('gold-prices-enhanced.html', 'gold-prices-enhanced'),
        ('exchange-rates.html', 'exchange-rates'),
        ('exchange-multi.html', 'exchange-multi')
    ]
    
    print("Updating navigation on all HTML files...")
    print("=" * 50)
    
    for filename, page_type in files_to_update:
        if os.path.exists(filename):
            print(f"Updating {filename}...")
            if update_navigation_in_file(filename, page_type):
                print(f"  ✓ {filename} updated successfully")
            else:
                print(f"  ✗ Failed to update {filename}")
        else:
            print(f"  ✗ {filename} not found")
    
    print("\n" + "=" * 50)
    print("Navigation update complete!")
    print("\nNew navigation structure:")
    print(CONSISTENT_NAV)

if __name__ == "__main__":
    main()