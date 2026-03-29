// Vietnam Gold Price Dashboard for OpenClaw Blog

class GoldDashboard {
    constructor() {
        this.data = null;
        this.chart = null;
        this.currentBrand = 'all';
        this.currentCity = 'all';
        this.currentPriceType = 'buy';
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupTheme();
        await this.loadData();
        this.renderDashboard();
        this.updateLastUpdated();
        this.setupAutoRefresh();
    }

    setupEventListeners() {
        document.getElementById('brandSelect').addEventListener('change', (e) => {
            this.currentBrand = e.target.value;
            this.renderDashboard();
        });

        document.getElementById('citySelect').addEventListener('change', (e) => {
            this.currentCity = e.target.value;
            this.renderDashboard();
        });

        document.getElementById('priceType').addEventListener('change', (e) => {
            this.currentPriceType = e.target.value;
            this.renderDashboard();
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        // Use existing theme toggle from main.js
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setupTheme() {
        // Check if theme is already set by main.js
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
        
        // Update chart colors if chart exists
        if (this.chart) {
            this.chart.update();
        }
    }

    async loadData() {
        try {
            // For now, use mock data
            // In production, you would fetch from an API like:
            // const response = await fetch('/api/gold-prices');
            // this.data = await response.json();
            
            this.data = this.generateMockData();
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = this.generateMockData();
        }
    }

    generateMockData() {
        const brands = ['sjc', 'doji', 'pnj'];
        const cities = ['hcm', 'hn'];
        const data = [];
        
        const basePrices = {
            'sjc': { hcm: { buy: 84500000, sell: 84700000 }, hn: { buy: 84400000, sell: 84600000 } },
            'doji': { hcm: { buy: 84300000, sell: 84500000 }, hn: { buy: 84200000, sell: 84400000 } },
            'pnj': { hcm: { buy: 84200000, sell: 84400000 }, hn: { buy: 84100000, sell: 84300000 } }
        };
        
        // Generate data for last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            for (const brand of brands) {
                for (const city of cities) {
                    // Add realistic price variations
                    const variation = (Math.random() - 0.5) * 500000; // +/- 500,000 VND
                    const buyPrice = Math.round(basePrices[brand][city].buy + variation);
                    const sellPrice = Math.round(basePrices[brand][city].sell + variation);
                    
                    data.push({
                        date: dateStr,
                        brand: brand,
                        city: city,
                        buy_price: buyPrice,
                        sell_price: sellPrice,
                        timestamp: date.toISOString()
                    });
                }
            }
        }
        
        return data;
    }

    renderDashboard() {
        if (!this.data) return;
        
        // Hide loading, show dashboard
        document.getElementById('loading').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        
        // Filter data based on selections
        const filteredData = this.filterData();
        
        // Update statistics cards
        this.updateStatistics(filteredData);
        
        // Update chart
        this.updateChart(filteredData);
        
        // Update data table
        this.updateDataTable(filteredData);
    }

    filterData() {
        let filtered = this.data;
        
        // Filter by brand
        if (this.currentBrand !== 'all') {
            filtered = filtered.filter(item => item.brand === this.currentBrand);
        }
        
        // Filter by city
        if (this.currentCity !== 'all') {
            filtered = filtered.filter(item => item.city === this.currentCity);
        }
        
        // Sort by date
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return filtered;
    }

    updateStatistics(data) {
        if (data.length === 0) return;
        
        // Calculate statistics for each brand
        const brands = ['sjc', 'doji', 'pnj'];
        
        brands.forEach(brand => {
            const brandData = data.filter(item => item.brand === brand);
            if (brandData.length === 0) return;
            
            // Get latest and previous prices for this brand
            const latest = brandData[brandData.length - 1];
            const previous = brandData.length > 1 ? brandData[brandData.length - 2] : latest;
            
            // Calculate price and change
            const currentPrice = this.currentPriceType === 'buy' ? latest.buy_price : latest.sell_price;
            const previousPrice = this.currentPriceType === 'buy' ? previous.buy_price : previous.sell_price;
            const change = currentPrice - previousPrice;
            const changePercent = ((change / previousPrice) * 100).toFixed(2);
            
            // Update DOM
            const priceElement = document.getElementById(`${brand}Price`);
            const changeElement = document.getElementById(`${brand}Change`);
            
            if (priceElement) {
                priceElement.textContent = this.formatPrice(currentPrice);
            }
            
            if (changeElement) {
                changeElement.className = `stat-change ${change >= 0 ? 'positive' : 'negative'}`;
                changeElement.innerHTML = `
                    <span>${change >= 0 ? '+' : ''}${this.formatPrice(change)}</span>
                    <i class="fas fa-arrow-${change >= 0 ? 'up' : 'down'}"></i>
                    <span>${change >= 0 ? '+' : ''}${changePercent}%</span>
                `;
            }
        });
        
        // Calculate overall trend
        const allPrices = data.map(item => 
            this.currentPriceType === 'buy' ? item.buy_price : item.sell_price
        );
        
        if (allPrices.length >= 2) {
            const firstPrice = allPrices[0];
            const lastPrice = allPrices[allPrices.length - 1];
            const trendChange = lastPrice - firstPrice;
            const trendPercent = ((trendChange / firstPrice) * 100).toFixed(2);
            
            const trendValueElement = document.getElementById('trendValue');
            const trendChangeElement = document.getElementById('trendChange');
            
            if (trendValueElement) {
                trendValueElement.textContent = this.formatPrice(lastPrice);
            }
            
            if (trendChangeElement) {
                trendChangeElement.className = `stat-change ${trendChange >= 0 ? 'positive' : 'negative'}`;
                trendChangeElement.innerHTML = `
                    <span>${trendChange >= 0 ? '+' : ''}${this.formatPrice(trendChange)}</span>
                    <i class="fas fa-arrow-${trendChange >= 0 ? 'up' : 'down'}"></i>
                    <span>${trendChange >= 0 ? '+' : ''}${trendPercent}%</span>
                `;
            }
        }
    }

    updateChart(data) {
        const ctx = document.getElementById('priceChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Group data by date
        const dates = [...new Set(data.map(item => item.date))].sort();
        
        // Prepare datasets based on selected brands
        const brands = this.currentBrand === 'all' 
            ? ['sjc', 'doji', 'pnj'] 
            : [this.currentBrand];
        
        const datasets = brands.map(brand => {
            const brandColor = {
                'sjc': '#d4af37', // Gold
                'doji': '#10b981', // Green
                'pnj': '#6366f1'  // Blue
            }[brand] || '#94a3b8';
            
            return {
                label: brand.toUpperCase(),
                data: dates.map(date => {
                    const dayData = data.filter(d => d.date === date && d.brand === brand);
                    if (dayData.length === 0) return null;
                    
                    // Calculate average price for the day
                    const prices = dayData.map(d => 
                        this.currentPriceType === 'buy' ? d.buy_price : d.sell_price
                    );
                    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
                }),
                borderColor: brandColor,
                backgroundColor: this.hexToRgba(brandColor, 0.1),
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            };
        }).filter(dataset => dataset.data.some(price => price !== null));
        
        // Create new chart
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates.map(date => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-AU', { 
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    });
                }),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatPrice(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                            drawBorder: false
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light'),
                            maxRotation: 0
                        }
                    },
                    y: {
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                            drawBorder: false
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light'),
                            callback: (value) => this.formatPrice(value, true)
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    updateDataTable(data) {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';
        
        // Group by date and brand/city
        const groupedData = {};
        data.forEach(item => {
            const key = `${item.date}-${item.brand}-${item.city}`;
            if (!groupedData[key]) {
                groupedData[key] = item;
            }
        });
        
        // Convert to array and sort by date (newest first)
        const tableData = Object.values(groupedData)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Populate table
        tableData.forEach(item => {
            // Find previous day's price for change calculation
            const previous = data.find(d => 
                d.date < item.date && 
                d.brand === item.brand && 
                d.city === item.city
            );
            
            const buyPrice = item.buy_price;
            const sellPrice = item.sell_price;
            const spread = sellPrice - buyPrice;
            const previousBuyPrice = previous ? previous.buy_price : buyPrice;
            const change = buyPrice - previousBuyPrice;
            const changePercent = ((change / previousBuyPrice) * 100).toFixed(2);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(item.date).toLocaleDateString('en-AU')}</td>
                <td><strong>${item.brand.toUpperCase()}</strong></td>
                <td>${item.city === 'hcm' ? 'Ho Chi Minh' : 'Hanoi'}</td>
                <td>${this.formatPrice(buyPrice)}</td>
                <td>${this.formatPrice(sellPrice)}</td>
                <td>${this.formatPrice(spread)}</td>
                <td class="${change >= 0 ? 'positive' : 'negative'}">
                    ${change >= 0 ? '+' : ''}${this.formatPrice(change)} (${change >= 0 ? '+' : ''}${changePercent}%)
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    formatPrice(price, short = false) {
        if (price === null || price === undefined) return '--';
        
        // Format as Vietnamese Dong (VND)
        if (short && price >= 1000000) {
            // Format as millions for chart labels
            const millions = price / 1000000;
            return `${millions.toFixed(millions >= 10 ? 0 : 1)}M`;
        }
        
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    async refreshData() {
        const refreshBtn = document.getElementById('refreshBtn');
        const originalHtml = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        document.getElementById('loading').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
        
        try {
            await this.loadData();
            this.renderDashboard();
            this.updateLastUpdated();
        } catch (error) {
            console.error('Error refreshing data:', error);
            // Show error message
            const loadingElement = document.getElementById('loading');
            loadingElement.innerHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                    <p>Failed to refresh data. Please try again.</p>
                    <button class="btn-gold" onclick="window.location.reload()">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        } finally {
            refreshBtn.innerHTML = originalHtml;
            refreshBtn.disabled = false;
        }
    }

    updateLastUpdated() {
        const now = new Date();
        const lastUpdatedElement = document.getElementById('lastUpdated');
        
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = now.toLocaleString('en-AU', {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: 'Australia/Melbourne'
            });
        }
        
        // Calculate next update (7 AM Melbourne time tomorrow)
        const melbourneTime = new Date(now.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
        let nextUpdate = new Date(melbourneTime);
        nextUpdate.setHours(7, 0, 0, 0);
        
        if (melbourneTime >= nextUpdate) {
            nextUpdate.setDate(nextUpdate.getDate() + 1);
        }
        
        const localNextUpdate = new Date(nextUpdate.toLocaleString('en-US', { timeZone: 'UTC' }));
        const nextUpdateElement = document.getElementById('nextUpdate');
        
        if (nextUpdateElement) {
            nextUpdateElement.textContent = localNextUpdate.toLocaleString('en-AU', {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: 'Australia/Melbourne'
            });
        }
    }

    setupAutoRefresh() {
        // Refresh data every 30 minutes
        setInterval(() => {
            this.refreshData();
        }, 30 * 60 * 1000);
    }
}

// Initialize dashboard