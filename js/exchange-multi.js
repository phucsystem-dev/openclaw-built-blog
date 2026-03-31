// Multi-Currency Exchange Rate Dashboard
console.log('Multi-currency exchange dashboard loading...');

class MultiCurrencyDashboard {
    constructor() {
        // Use configuration from BlogConfig
        this.config = window.BlogConfig || {
            currencies: {
                tracked: ['USD', 'EUR', 'GBP', 'AUD', 'VND'],
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
            }
        };
        
        // Build currencies object from config
        this.currencies = {};
        this.config.currencies.tracked.forEach(currency => {
            this.currencies[currency] = {
                name: this.getCurrencyName(currency),
                symbol: this.config.currencies.symbols[currency] || '💵',
                color: this.config.currencies.colors[currency] || '#666666'
            };
        });
        
        this.providers = [
            { id: 'mid_market', name: 'Mid-market', type: 'benchmark' },
            { id: 'wise', name: 'Wise', type: 'transfer' },
            { id: 'xe', name: 'XE.com', type: 'transfer' },
            { id: 'vietcombank', name: 'Vietcombank', type: 'bank' },
            { id: 'techcombank', name: 'Techcombank', type: 'bank' },
            { id: 'bidv', name: 'BIDV', type: 'bank' }
        ];
        
        this.exchangeRates = {};
        this.charts = {};
        
        this.init();
    }
    
    getCurrencyName(code) {
        const names = {
            'USD': 'US Dollar',
            'EUR': 'Euro',
            'GBP': 'British Pound',
            'AUD': 'Australian Dollar',
            'VND': 'Vietnamese Dong'
        };
        return names[code] || code;
    }

    async init() {
        console.log('Initializing multi-currency dashboard...');
        
        // Load data
        await this.loadData();
        
        // Setup UI
        this.setupEventListeners();
        
        // Render dashboard
        this.renderDashboard();
        
        console.log('Multi-currency dashboard initialized');
    }

    async loadData() {
        try {
            // Try to load exchange rate data
            if (typeof window.multiCurrencyData !== 'undefined') {
                this.exchangeRates = window.multiCurrencyData.rates;
                console.log('Loaded multi-currency data');
            } else {
                // Try to fetch real data if feature is enabled
                if (this.config.features?.realExchangeRates) {
                    console.log('Fetching real exchange rates...');
                    await this.fetchRealExchangeRates();
                } else {
                    // Fallback to mock data
                    console.log('Using mock exchange rate data');
                    this.exchangeRates = this.generateMockData();
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.exchangeRates = this.generateMockData();
        }
    }
    
    async fetchRealExchangeRates() {
        try {
            // Use API from config
            const apiUrl = this.config.apis?.exchangeRateAPI || 'https://api.exchangerate-api.com/v4/latest';
            const currencies = this.config.currencies.tracked.filter(c => c !== 'VND');
            
            for (const currency of currencies) {
                try {
                    const response = await fetch(`${apiUrl}/${currency}`);
                    if (response.ok) {
                        const data = await response.json();
                        const rate = data.rates?.VND;
                        
                        if (rate) {
                            // Generate realistic rates based on mid-market
                            this.exchangeRates[currency] = {
                                mid_market: rate,
                                wise: rate * 1.005,
                                xe: rate * 1.002,
                                vietcombank: rate * 1.02,
                                techcombank: rate * 1.019,
                                bidv: rate * 1.021
                            };
                            console.log(`Fetched ${currency}/VND: ${rate}`);
                        }
                    }
                } catch (e) {
                    console.warn(`Failed to fetch ${currency} rates:`, e);
                }
            }
            
            // If no rates fetched, use mock data
            if (Object.keys(this.exchangeRates).length === 0) {
                this.exchangeRates = this.generateMockData();
            }
            
        } catch (error) {
            console.error('Error fetching real exchange rates:', error);
            this.exchangeRates = this.generateMockData();
        }
    }

    generateMockData() {
        // Base rates (approximate)
        const baseRates = {
            'USD': 25000,
            'EUR': 27000,
            'GBP': 31500,
            'AUD': 16500
        };
        
        const rates = {};
        
        // Generate rates for each currency
        Object.keys(baseRates).forEach(currency => {
            const baseRate = baseRates[currency];
            
            // Add small random variation
            const variation = (Math.random() - 0.5) * 0.01; // ±0.5%
            const currentRate = baseRate * (1 + variation);
            
            rates[currency] = {
                mid_market: currentRate,
                wise: currentRate * 1.005,
                xe: currentRate * 1.002,
                vietcombank: currentRate * 1.02,
                techcombank: currentRate * 1.019,
                bidv: currentRate * 1.021
            };
        });
        
        return rates;
    }

    setupEventListeners() {
        // Currency converter
        document.getElementById('fromAmount').addEventListener('input', (e) => {
            this.updateConversion();
        });
        
        document.getElementById('fromCurrency').addEventListener('change', () => {
            this.updateConversion();
        });
        
        document.getElementById('toCurrency').addEventListener('change', () => {
            this.updateConversion();
        });
        
        // Swap currencies
        document.getElementById('swapCurrencies').addEventListener('click', () => {
            this.swapCurrencies();
        });
    }

    renderDashboard() {
        console.log('Rendering multi-currency dashboard...');
        
        // Update currency cards
        this.updateCurrencyCards();
        
        // Update currency converter
        this.updateConversion();
        
        // Update comparison table
        this.renderComparisonTable();
        
        // Update charts
        this.renderCurrencyTrendChart();
        this.renderTodayRatesChart();
        
        // Update last updated time
        this.updateLastUpdated();
        
        console.log('Multi-currency dashboard rendered');
    }

    updateCurrencyCards() {
        Object.keys(this.currencies).forEach(currency => {
            if (currency === 'VND') return;
            
            const rate = this.exchangeRates[currency]?.mid_market;
            if (!rate) return;
            
            // Update rate display
            const rateElement = document.getElementById(`${currency.toLowerCase()}Rate`);
            if (rateElement) {
                rateElement.textContent = rate.toLocaleString('en-AU', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            }
            
            // Update VND equivalent
            const vndElement = document.getElementById(`${currency.toLowerCase()}Vnd`);
            if (vndElement) {
                vndElement.textContent = rate.toLocaleString('en-AU', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            }
            
            // Update change indicator (mock)
            const changeElement = document.getElementById(`${currency.toLowerCase()}Change`);
            if (changeElement) {
                const changePercent = (Math.random() - 0.5) * 0.01; // Random ±0.5%
                changeElement.innerHTML = `
                    <i class="fas fa-arrow-${changePercent >= 0 ? 'up' : 'down'}"></i>
                    <span>${changePercent >= 0 ? '+' : ''}${(changePercent * 100).toFixed(1)}%</span>
                `;
                changeElement.className = `currency-change ${changePercent >= 0 ? 'positive' : 'negative'}`;
            }
        });
    }

    updateConversion() {
        const fromCurrency = document.getElementById('fromCurrency').value;
        const toCurrency = document.getElementById('toCurrency').value;
        const amount = parseFloat(document.getElementById('fromAmount').value) || 0;
        
        // Update currency labels
        document.getElementById('fromCurrencyLabel').textContent = fromCurrency;
        document.getElementById('toCurrencyLabel').textContent = toCurrency;
        
        // Calculate exchange rate
        let exchangeRate;
        let convertedAmount;
        
        if (fromCurrency === toCurrency) {
            exchangeRate = 1;
            convertedAmount = amount;
        } else if (fromCurrency === 'VND') {
            // VND to other currency
            const toRate = this.exchangeRates[toCurrency]?.mid_market;
            if (toRate) {
                exchangeRate = 1 / toRate;
                convertedAmount = amount * exchangeRate;
            } else {
                exchangeRate = 0;
                convertedAmount = 0;
            }
        } else if (toCurrency === 'VND') {
            // Other currency to VND
            const fromRate = this.exchangeRates[fromCurrency]?.mid_market;
            if (fromRate) {
                exchangeRate = fromRate;
                convertedAmount = amount * fromRate;
            } else {
                exchangeRate = 0;
                convertedAmount = 0;
            }
        } else {
            // Currency to currency (via VND)
            const fromRate = this.exchangeRates[fromCurrency]?.mid_market;
            const toRate = this.exchangeRates[toCurrency]?.mid_market;
            if (fromRate && toRate) {
                exchangeRate = fromRate / toRate;
                convertedAmount = amount * exchangeRate;
            } else {
                exchangeRate = 0;
                convertedAmount = 0;
            }
        }
        
        // Update display
        document.getElementById('exchangeRate').textContent = exchangeRate.toLocaleString('en-AU', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        });
        
        document.getElementById('toAmount').value = convertedAmount.toLocaleString('en-AU', {
            minimumFractionDigits: toCurrency === 'VND' ? 0 : 2,
            maximumFractionDigits: toCurrency === 'VND' ? 0 : 2
        });
    }

    swapCurrencies() {
        const fromCurrency = document.getElementById('fromCurrency');
        const toCurrency = document.getElementById('toCurrency');
        const fromAmount = document.getElementById('fromAmount');
        const toAmount = document.getElementById('toAmount');
        
        // Swap currencies
        const tempCurrency = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = tempCurrency;
        
        // Swap amounts
        const tempAmount = fromAmount.value;
        fromAmount.value = parseFloat(toAmount.value.replace(/,/g, '')) || 0;
        
        // Update conversion
        this.updateConversion();
    }

    renderComparisonTable() {
        const tableBody = document.getElementById('comparisonTable');
        tableBody.innerHTML = '';
        
        this.providers.forEach(provider => {
            const row = document.createElement('tr');
            
            // Provider name with badge
            const badgeClass = {
                'benchmark': 'badge-benchmark',
                'transfer': 'badge-transfer',
                'bank': 'badge-bank'
            }[provider.type] || 'badge-benchmark';
            
            const providerCell = `
                <td>
                    <strong>${provider.name}</strong>
                    <span class="provider-badge ${badgeClass}">${provider.type}</span>
                </td>
            `;
            
            // Rate cells
            const rateCells = ['USD', 'EUR', 'GBP', 'AUD'].map(currency => {
                const rate = this.exchangeRates[currency]?.[provider.id];
                if (rate) {
                    return `<td>${rate.toLocaleString('en-AU', { minimumFractionDigits: 0 })}</td>`;
                }
                return '<td>-</td>';
            }).join('');
            
            // Type cell
            const typeCell = `<td><span class="provider-badge ${badgeClass}">${provider.type}</span></td>`;
            
            row.innerHTML = providerCell + rateCells + typeCell;
            tableBody.appendChild(row);
        });
    }

    renderCurrencyTrendChart() {
        const ctx = document.getElementById('currencyTrendChart').getContext('2d');
        
        // Generate mock historical data
        const days = 30;
        const dates = [];
        const datasets = [];
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }));
        }
        
        // Create datasets for each currency
        ['USD', 'EUR', 'GBP', 'AUD'].forEach((currency, index) => {
            const baseRate = this.exchangeRates[currency]?.mid_market || 20000;
            const rates = [];
            
            for (let i = 0; i <= days; i++) {
                const trend = Math.sin(i / 7) * (baseRate * 0.01); // Weekly cycle
                const random = (Math.random() - 0.5) * (baseRate * 0.005); // Random noise
                rates.push(baseRate + trend + random);
            }
            
            datasets.push({
                label: `${currency}/VND`,
                data: rates,
                borderColor: this.currencies[currency].color,
                backgroundColor: this.hexToRgba(this.currencies[currency].color, 0.1),
                tension: 0.4,
                fill: false
            });
        });
        
        // Create or update chart
        if (this.charts.currencyTrend) {
            this.charts.currencyTrend.destroy();
        }
        
        this.charts.currencyTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '30-Day Currency Trends'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${context.raw.toLocaleString('en-AU', { minimumFractionDigits: 0 })} VND`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Exchange Rate (VND)'
                        },
                        ticks: {
                            callback: (value) => value.toLocaleString('en-AU', { minimumFractionDigits: 0 })
                        }
                    }
                }
            }
        });
    }

    renderTodayRatesChart() {
        const ctx = document.getElementById('todayRatesChart').getContext('2d');
        
        // Prepare data
        const currencies = ['USD', 'EUR', 'GBP', 'AUD'];
        const labels = currencies.map(c => this.currencies[c].name);
        
        const midMarketRates = currencies.map(c => this.exchangeRates[c]?.mid_market || 0);
        const bankRates = currencies.map(c => this.exchangeRates[c]?.vietcombank || 0);
        const transferRates = currencies.map(c => this.exchangeRates[c]?.wise || 0);
        
        // Create or update chart
        if (this.charts.todayRates) {
            this.charts.todayRates.destroy();
        }
        
        this.charts.todayRates = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Mid-market',
                        data: midMarketRates,
                        backgroundColor: '#8b5cf6'
                    },
                    {
                        label: 'Bank (Vietcombank)',
                        data: bankRates,
                        backgroundColor: '#3b82f6'
                    },
                    {
                        label: 'Transfer (Wise)',
                        data: transferRates,
                        backgroundColor: '#10b981'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: "Today's Exchange Rates by Provider"
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${context.raw.toLocaleString('en-AU', { minimumFractionDigits: 0 })} VND`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Exchange Rate (VND)'
                        },
                        ticks: {
                            callback: (value) => value.toLocaleString('en-AU', { minimumFractionDigits: 0 })
                        }
                    }
                }
            }
        });
    }

    updateLastUpdated() {
        const now = new Date();
        document.getElementById('lastUpdated').textContent = now.toLocaleString('en-AU', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
        
        // Calculate next update (7 AM tomorrow Melbourne time)
        const melbourneTime = new Date(now.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
        let nextUpdate = new Date(melbourneTime);
        nextUpdate.setHours(7, 0, 0, 0);
        
        if (melbourneTime >= nextUpdate) {
            nextUpdate.setDate(nextUpdate.getDate() + 1);
        }
        
        const localNextUpdate = new Date(nextUpdate.toLocaleString('en-US', { timeZone: 'UTC' }));
        document.getElementById('nextUpdate').textContent = localNextUpdate.toLocaleString('en-AU', {
            dateStyle: 'long',
            timeStyle: 'short',
            timeZone: 'Australia/Melbourne'
        });
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.multiCurrencyDashboard = new MultiCurrencyDashboard();
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const themeIcon = themeToggle.querySelector('i');
            
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            }
        });
        
        // Set initial theme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.querySelector('i').className = 'fas fa-sun';
        }
    }
});