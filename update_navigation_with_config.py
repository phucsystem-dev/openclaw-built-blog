#!/usr/bin/env python3
"""
Update navigation to use configurable base URL.
This script updates all HTML files to use relative paths instead of absolute URLs.
Relative paths work better with configurable domains.
"""

import os
import re

# Updated navigation with relative paths
RELATIVE_NAV = '''                <ul class="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/#posts">Blog Posts</a></li>
                    <li><a href="gold-prices.html">Gold Prices</a></li>
                    <li><a href="exchange-rates.html">Exchange Rates</a></li>
                    <li><a href="exchange-multi.html">Multi-Currency</a></li>
                    <li><a href="/#about">About</a></li>
                    <li><a href="/#contact">Contact</a></li>
                </ul>'''

def update_navigation_in_file(filepath, current_page):
    """Update navigation in a single HTML file to use relative paths"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the navigation section
    nav_pattern = r'<ul class="nav-links">.*?</ul>'
    
    if re.search(nav_pattern, content, re.DOTALL):
        # Start with relative navigation
        updated_nav = RELATIVE_NAV
        
        # Set active class based on current page
        if current_page == 'home':
            updated_nav = updated_nav.replace('href="/">Home<', 'href="/" class="active">Home<')
        elif current_page == 'gold-prices':
            updated_nav = updated_nav.replace('href="gold-prices.html">Gold Prices<', 'href="gold-prices.html" class="active">Gold Prices<')
        elif current_page == 'gold-prices-enhanced':
            # For enhanced gold page, still highlight Gold Prices
            updated_nav = updated_nav.replace('href="gold-prices.html">Gold Prices<', 'href="gold-prices.html" class="active">Gold Prices<')
        elif current_page == 'exchange-rates':
            updated_nav = updated_nav.replace('href="exchange-rates.html">Exchange Rates<', 'href="exchange-rates.html" class="active">Exchange Rates<')
        elif current_page == 'exchange-multi':
            updated_nav = updated_nav.replace('href="exchange-multi.html">Multi-Currency<', 'href="exchange-multi.html" class="active">Multi-Currency<')
        
        # Replace the navigation
        new_content = re.sub(nav_pattern, updated_nav, content, flags=re.DOTALL)
        
        # Also update any other absolute URLs to relative
        new_content = new_content.replace('href="/gold-prices.html"', 'href="gold-prices.html"')
        new_content = new_content.replace('href="/exchange-rates.html"', 'href="exchange-rates.html"')
        new_content = new_content.replace('href="/exchange-multi.html"', 'href="exchange-multi.html"')
        
        # Update CSS and JS paths if they're absolute
        new_content = new_content.replace('href="/css/', 'href="css/')
        new_content = new_content.replace('src="/js/', 'src="js/')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True
    else:
        print(f"  Warning: Could not find navigation in {filepath}")
        return False

def add_config_script_to_file(filepath):
    """Add config.js script to HTML file if not already present"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if config.js is already included
    if 'js/config.js' in content:
        return False
    
    # Add config.js before other scripts
    # Look for closing </head> or first <script> tag
    if '</head>' in content:
        new_content = content.replace('</head>', '    <script src="js/config.js"></script>\n</head>')
    elif '<script src="js/' in content:
        # Insert before first JS script
        first_js = re.search(r'<script src="js/[^>]+>', content)
        if first_js:
            js_pos = first_js.start()
            new_content = content[:js_pos] + '    <script src="js/config.js"></script>\n' + content[js_pos:]
        else:
            # Add before closing body tag
            new_content = content.replace('</body>', '    <script src="js/config.js"></script>\n</body>')
    else:
        # Add before closing body tag
        new_content = content.replace('</body>', '    <script src="js/config.js"></script>\n</body>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

def main():
    """Update navigation and add config to all HTML files"""
    
    files_to_update = [
        ('index.html', 'home'),
        ('gold-prices.html', 'gold-prices'),
        ('gold-prices-enhanced.html', 'gold-prices-enhanced'),
        ('exchange-rates.html', 'exchange-rates'),
        ('exchange-multi.html', 'exchange-multi')
    ]
    
    print("Updating navigation to use relative paths...")
    print("=" * 60)
    
    for filename, page_type in files_to_update:
        if os.path.exists(filename):
            print(f"Updating {filename}...")
            
            # Update navigation
            if update_navigation_in_file(filename, page_type):
                print(f"  ✓ Navigation updated")
            else:
                print(f"  ✗ Navigation update failed")
            
            # Add config.js
            if add_config_script_to_file(filename):
                print(f"  ✓ Config.js added")
            else:
                print(f"  ✓ Config.js already present")
                
        else:
            print(f"  ✗ {filename} not found")
    
    print("\n" + "=" * 60)
    print("Update complete!")
    print("\nBenefits of this approach:")
    print("1. ✅ Relative paths work with any domain")
    print("2. ✅ Easy to change base URL in one place (js/config.js)")
    print("3. ✅ Better for local development")
    print("4. ✅ Consistent navigation across all pages")
    print("5. ✅ Centralized configuration for all features")

if __name__ == "__main__":
    main()