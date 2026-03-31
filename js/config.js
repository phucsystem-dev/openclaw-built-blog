// Configuration for OpenClaw Blog
// Centralized configuration for easy domain/URL changes

const BlogConfig = {
    // Base URL configuration
    BASE_URL: 'https://phucsystem-dev.github.io/openclaw-built-blog',
    
    // Page URLs (auto-generated from base URL)
    get urls() {
        return {
            home: this.BASE_URL + '/',
            goldPrices: this.BASE_URL + '/gold-prices.html',
            goldPricesEnhanced: this.BASE_URL + '/gold-prices-enhanced.html',
            exchangeRates: this.BASE_URL + '/exchange-rates.html',
            exchangeMulti: this.BASE_URL + '/exchange-multi.html',
            posts: this.BASE_URL + '/#posts',
            about: this.BASE_URL + '/#about',
            contact: this.BASE_URL + '/#contact'
        };
    },
    
    // API endpoints
    get apis() {
        return {
            exchangeRateAPI: 'https://api.exchangerate-api.com/v4/latest',
            goldPriceAPI: 'https://api.vnappmob.com/api/v2/gold',
            fallbackGoldAPI: 'https://api.metalpriceapi.com/v1/latest'
        };
    },
    
    // Update schedule
    updateSchedule: {
        time: '07:00', // Melbourne time
        timezone: 'Australia/Melbourne',
        utcOffset: '+11:00', // AEDT
        utcTime: '20:00' // UTC equivalent
    },
    
    // Currency configuration
    currencies: {
        primary: 'VND',
        tracked: ['USD', 'EUR', 'GBP', 'AUD'],
        symbols: {
            'USD': '🇺🇸',
            'EUR': '🇪🇺', 
            'GBP': '🇬🇧',
            'AUD': '🇦🇺',
            'VND': '🇻🇳'
        },
        colors: {
            'USD': '#3b82f6',
            'EUR': '#10b981',
            'GBP': '#ef4444',
            'AUD': '#f59e0b',
            'VND': '#dc2626'
        }
    },
    
    // Gold brands
    goldBrands: ['SJC', 'DOJI', 'PNJ', 'Phu Quy', 'Bao Tin Minh Chau'],
    
    // Data storage
    dataPaths: {
        gold: 'data/gold',
        exchange: 'data/exchange',
        summary: 'data'
    },
    
    // Feature flags
    features: {
        realExchangeRates: true,
        realGoldPrices: false, // Requires API key
        historicalCharts: true,
        currencyConverter: true,
        darkMode: true
    },
    
    // Version
    version: '1.2.0',
    
    // Helper methods
    getFullUrl(path) {
        return this.BASE_URL + (path.startsWith('/') ? path : '/' + path);
    },
    
    getPageUrl(pageName) {
        const urlMap = this.urls;
        return urlMap[pageName] || this.BASE_URL + '/';
    },
    
    // Log configuration (for debugging)
    logConfig() {
        console.log('📋 Blog Configuration:');
        console.log('Base URL:', this.BASE_URL);
        console.log('Version:', this.version);
        console.log('Features:', this.features);
        console.log('Update Schedule:', this.updateSchedule);
    }
};

// Make it globally available
window.BlogConfig = BlogConfig;

// Auto-log in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    BlogConfig.logConfig();
}