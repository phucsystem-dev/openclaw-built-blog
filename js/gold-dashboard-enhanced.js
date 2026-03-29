// Enhanced Gold Dashboard with Historical Data Visualization
console.log('Enhanced gold dashboard loading...');

class EnhancedGoldDashboard {
    constructor() {
        this.data = null;
        this.charts = {};
        this.currentTimeScale = '1week';
        this.currentBrand = 'all';
        this.currentCity = 'all';
        
        this.timeScales = {
            '1week': { days: 7, label: '1 Week' },
            '2weeks': { days: 14, label: '2 Weeks' },
            '1month': { days: 30, label: '1 Month' },
            '3months': { days: 90, label: '3 Months' },
            '6months': { days: 180, label: '6 Months' },
            '1year': { days: 365, label: '1 Year' }
        };
        
        this.init();
    }

    async init() {
        console.log('Initializing enhanced dashboard...');
        
        // Show loading
        this.showLoading(true);
        
        // Load data
        await this.loadData();
        
        // Setup UI
        this.setupEventListeners();
        this.setupTheme();
        
        // Render dashboard
        this.renderDashboard();
        
        // Hide loading
        this.showLoading(false);
        
        console.log('Enhanced dashboard initialized');
    }

    showLoading(show) {
        const loadingEl = document.getElementById('loading');
        const dashboardEl = document.getElementById('dashboard');
        
        if (show) {
            loadingEl.style.display = 'flex';
            dashboardEl.style.display = 'none';
        } else {
            loadingEl.style.display = 'none';
            dashboardEl.style.display = 'block';
        }
    }

    async loadData() {
        try {
            // Try to load historical data
            if (typeof window.goldPriceData !== 'undefined') {
                this.data = window.goldPriceData.historical;
                console.log('Loaded historical data:', this.data.length, 'records');
            } else {
                // Fallback to mock data
                console.log('Historical data not found, using mock data');
                this.data = this.generateMockHistoricalData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = this.generateMockHistoricalData();
        }
    }

    generateMockHistoricalData() {
        const data = [];
        const brands = ['SJC', 'DOJI', 'PNJ'];
        const cities = ['Ho Chi Minh City', 'Hanoi'];
        
        // Generate 30 days of historical data
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            for (const brand of brands) {
                for (const city of cities) {
                    // Base prices with realistic trends
                    const basePrice = {
                        'SJC': 84500000,
                        'DOJI': 84300000,
                        'PNJ': 84200000
                    }[brand];
                    
                    // Add some variation and trend
                    const trend = Math.sin(i / 7) * 500000; // Weekly cycle
                    const random = (Math.random() - 0.5) * 200000; // Random noise
                    
                    const buyPrice = Math.round(basePrice + trend + random);
                    const sellPrice = Math.round(buyPrice + 2000000); // 2M spread
                    
                    data.push({
                        date: dateStr,
                        brand: brand,
                        city: city,
                        avg_buy: buyPrice,
                        avg_sell: sellPrice,
                        spread: sellPrice - buyPrice,
                        cities: [city]
                    });
                }
            }
        }
        
        return data;
    }

    setupEventListeners() {
        // Time scale selector
        document.getElementById('timeScale').addEventListener('change', (e) => {
            this.currentTimeScale = e.target.value;
            this.renderCharts();
        });
        
        // Brand filter
        document.getElementById('brandFilter').addEventListener('change', (e) => {
            this.currentBrand = e.target.value;
            this.renderCharts();
        });
        
        // City filter
        document.getElementById('cityFilter').addEventListener('change', (e) => {
            this.currentCity = e.target.value;
            this.renderCharts();
        });
        
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });
        
        // Export buttons
        document.getElementById('exportCSV').addEventListener('click', () => {
            this.exportData('csv');
        });
        
        document.getElementById('exportJSON').addEventListener('click', () => {
            this.exportData('json');
        });
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setupTheme() {
        // Check if theme is already set
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            const themeIcon = document.getElementById('themeToggle').querySelector('i');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const themeIcon = document.getElementById('themeToggle').querySelector('i');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
        
        // Update charts
        this.updateChartColors();
    }

    getFilteredData() {
        let filtered = this.data;
        
        // Filter by time scale
        const days = this.timeScales[this.currentTimeScale].days;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffStr = cutoffDate.toISOString().split('T')[0];
        
        filtered = filtered.filter(item => item.date >= cutoffStr);
        
        // Filter by brand
        if (this.currentBrand !== 'all') {
            filtered = filtered.filter(item => item.brand === this.currentBrand);
        }
        
        // Filter by city
        if (this.currentCity !== 'all') {
            filtered = filtered.filter(item => 
                item.cities && item.cities.includes(this.currentCity)
            );
        }
        
        return filtered;
    }

    renderDashboard() {
        console.log('Rendering dashboard...');
        
        // Update statistics
        this.updateStatistics();
        
        // Render charts
        this.renderCharts();
        
        // Update data table
        this.updateDataTable();
        
        // Update last updated time
        this.updateLastUpdated();
        
        console.log('Dashboard rendered');
    }

    updateStatistics() {
        const filteredData = this.getFilteredData();
        
        if (filteredData.length === 0) {
            console.warn('No data for statistics');
            return;
        }
        
        // Calculate statistics
        const brands = [...new Set(filteredData.map(item => item.brand))];
        const dates = [...new Set(filteredData.map(item => item.date))].sort();
        
        // Update UI
        document.getElementById('totalRecords').textContent = filteredData.length.toLocaleString();
        document.getElementById('dateRange').textContent = `${dates[0]} to ${dates[dates.length - 1]}`;
        document.getElementById('totalBrands').textContent = brands.length;
        document.getElementById('totalDays').textContent = dates.length;
    }

    renderCharts() {
        const filteredData = this.getFilteredData();
        
        if (filteredData.length === 0) {
            console.warn('No data for charts');
            return;
        }
        
        // Render price trend chart
        this.renderPriceTrendChart(filteredData);
        
        // Render brand comparison chart
        this.renderBrandComparisonChart(filteredData);
        
        // Render spread analysis chart
        this.renderSpreadAnalysisChart(filteredData);
    }

    renderPriceTrendChart(data) {
        const ctx = document.getElementById('priceTrendChart').getContext('2d');
        
        // Group data by date and brand
        const groupedData = {};
        const dates = [...new Set(data.map(item => item.date))].sort();
        const brands = [...new Set(data.map(item => item.brand))];
        
        // Initialize structure
        dates.forEach(date => {
            groupedData[date] = {};
            brands.forEach(brand => {
                groupedData[date][brand] = { buy: null, sell: null };
            });
        });
        
        // Fill data
        data.forEach(item => {
            if (groupedData[item.date] && groupedData[item.date][item.brand]) {
                groupedData[item.date][item.brand].buy = item.avg_buy;
                groupedData[item.date][item.brand].sell = item.avg_sell;
            }
        });
        
        // Prepare datasets
        const datasets = [];
        const brandColors = {
            'SJC': '#d4af37',
            'DOJI': '#10b981',
            'PNJ': '#6366f1'
        };
        
        brands.forEach(brand => {
            datasets.push({
                label: `${brand} Buy Price`,
                data: dates.map(date => groupedData[date][brand].buy),
                borderColor: brandColors[brand],
                backgroundColor: this.hexToRgba(brandColors[brand], 0.1),
                tension: 0.4,
                fill: false
            });
        });
        
        // Create or update chart
        if (this.charts.priceTrend) {
            this.charts.priceTrend.destroy();
        }
        
        this.charts.priceTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates.map(date => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
                }),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Gold Price Trend'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                return `${context.dataset.label}: ${this.formatPrice(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatPrice(value)
                        }
                    }
                }
            }
        });
    }

    renderBrandComparisonChart(data) {
        const ctx = document.getElementById('brandComparisonChart').getContext('2d');
        
        // Group by brand
        const brandData = {};
        data.forEach(item => {
            if (!brandData[item.brand]) {
                brandData[item.brand] = {
                    buyPrices: [],
                    sellPrices: []
                };
            }
            brandData[item.brand].buyPrices.push(item.avg_buy);
            brandData[item.brand].sellPrices.push(item.avg_sell);
        });
        
        // Calculate averages
        const brands = Object.keys(brandData);
        const avgBuyPrices = brands.map(brand => {
            const prices = brandData[brand].buyPrices;
            return prices.reduce((a, b) => a + b, 0) / prices.length;
        });
        
        const avgSellPrices = brands.map(brand => {
            const prices = brandData[brand].sellPrices;
            return prices.reduce((a, b) => a + b, 0) / prices.length;
        });
        
        // Create or update chart
        if (this.charts.brandComparison) {
            this.charts.brandComparison.destroy();
        }
        
        this.charts.brandComparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: brands,
                datasets: [
                    {
                        label: 'Average Buy Price',
                        data: avgBuyPrices,
                        backgroundColor: '#3b82f6'
                    },
                    {
                        label: 'Average Sell Price',
                        data: avgSellPrices,
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
                        text: 'Brand Comparison'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatPrice(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatPrice(value)
                        }
                    }
                }
            }
        });
    }

    renderSpreadAnalysisChart(data) {
        const ctx = document.getElementById('spreadAnalysisChart').getContext('2d');
        
        // Calculate spreads by brand
        const spreadData = {};
        data.forEach(item => {
            if (!spreadData[item.brand]) {
                spreadData[item.brand] = [];
            }
            spreadData[item.brand].push(item.spread);
        });
        
        // Prepare data
        const brands = Object.keys(spreadData);
        const spreads = brands.map(brand => {
            const brandSpreads = spreadData[brand];
            return brandSpreads.reduce((a, b) => a + b, 0) / brandSpreads.length;
        });
        
        // Create or update chart
        if (this.charts.spreadAnalysis) {
            this.charts.spreadAnalysis.destroy();
        }
        
        this.charts.spreadAnalysis = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: brands,
                datasets: [{
                    label: 'Average Spread',
                    data: spreads,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3b82f6',
                    pointBackgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Spread Analysis by Brand'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Spread: ${this.formatPrice(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        ticks: {
                            callback: (value) => this.formatPrice(value)
                        }
                    }
                }
            }
        });
    }

    updateDataTable() {
        const filteredData = this.getFilteredData();
        const tbody = document.getElementById('dataTableBody');
        
        if (!tbody) return;
        
        // Clear existing rows
        tbody.innerHTML = '';
        
        // Group by date and brand for display
        const groupedData = {};
        filteredData.forEach(item => {
            const key = `${item.date}-${item.brand}`;
            if (!groupedData[key]) {
                groupedData[key] = {
                    date: item.date,
                    brand: item.brand,
                    buyPrices: [],
                    sellPrices: [],
                    cities: new Set()
                };
            }
            groupedData[key].buyPrices.push(item.avg_buy);
            groupedData[key].sellPrices.push(item.avg_sell);
            if (item.cities) {
                item.cities.forEach(city => groupedData[key].cities.add(city));
            }
        });
        
        // Create rows
        Object.values(groupedData).forEach(item => {
            const avgBuy = item.buyPrices.reduce((a, b) => a + b, 0) / item.buyPrices.length;
            const avgSell = item.sellPrices.reduce((a, b) => a + b, 0) / item.sellPrices.length;
            const spread = avgSell - avgBuy;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(item.date).toLocaleDateString('en-AU')}</td>
                <td><strong>${item.brand}</strong></td>
                <td>${Array.from(item.cities).join(', ')}</td>
                <td>${this.formatPrice(avgBuy)}</td>
                <td>${this.formatPrice(avgSell)}</td>
                <td>${this.formatPrice(spread)}</td>
                <td>${(spread / avgBuy * 100).toFixed(2)}%</td>
            `;
            tbody.appendChild(row);
        });
    }

    updateLastUpdated() {
        const now = new Date();
        document.getElementById('lastUpdated').textContent = now.toLocaleString('en-AU', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    }

    updateChartColors() {
        // Update all charts when theme changes
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.update();
            }
        });
    }

    refreshData() {
        console.log('Refreshing data...');
        this.showLoading(true);
        
        setTimeout(async () => {
            await this.loadData();
            this.renderDashboard();
            this.showLoading(false);
            console.log('Data refreshed');
        }, 1000);
    }

    exportData(format) {
        const filteredData = this.getFilteredData();
        
        if (format === 'csv') {
            this.exportToCSV(filteredData);
        } else if (format === 'json') {
            this.exportToJSON(filteredData);
        }
    }

    exportToCSV(data) {
        if (data.length === 0) {
            alert('No data to export');
            return;
        }
        
        // Create CSV content
        const headers = ['Date', 'Brand', 'City', 'Buy Price', 'Sell Price', 'Spread', 'Spread %'];
        const rows = data.map(item => [
            item.date,
            item.brand,
            item.cities ? item.cities.join(', ') :