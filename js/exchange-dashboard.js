// AUD to VND Exchange Rate Dashboard
console.log('Exchange rate dashboard loading...');

class ExchangeRateDashboard {
    constructor() {
        this.data = null;
        this.charts = {};
        this.currentTimeScale = '1week';
        this.currentDirection = 'audToVnd';
        
        this.timeScales = {
            '1week': { days: 7, label: '1 Week' },
            '1month': { days: 30, label: '1 Month' },
            '3months': { days: 90, label: '3 Months' },
            '1year': { days: 365, label: '1 Year' }
        };
        
        this.providers = [
            { id: 'mid_market', name: 'Mid-market', color: '#3b82f6' },
            { id: 'commonwealth_bank', name: 'CommBank', color: '#ef4444' },
            { id: 'westpac', name: 'Westpac', color: '#10b981' },
            { id: 'anz', name: 'ANZ', color: '#8b5cf6' },
            { id: 'nab', name: 'NAB', color: '#f59e0b' },
            { id: 'wise', name: 'Wise', color: '#06b6d4' },
            { id: 'xe', name: 'XE.com', color: '#84cc16' }
        ];
        
        this.commonConversions = [
            { aud: 1, description: 'Single dollar' },
            { aud: 10, description: 'Small purchase' },
            { aud: 50, description: 'Dinner out' },
            { aud: 100, description: 'Weekly groceries' },
            { aud: 500, description: 'Monthly expenses' },
            { aud: 1000, description: 'Rent/bills' },
            { aud: 5000, description: 'Travel money' },
            { aud: 10000, description: 'Large transfer' }
        ];
        
        this.init();
    }

    async init() {
        console.log('Initializing exchange rate dashboard...');
        
        // Load data
        await this.loadData();
        
        // Setup UI
        this.setupEventListeners();
        
        // Render dashboard
        this.renderDashboard();
        
        console.log('Exchange rate dashboard initialized');
    }

    async loadData() {
        try {
            // Try to load exchange rate data
            if (typeof window.exchangeRateData !== 'undefined') {
                this.data = window.exchangeRateData;
                console.log('Loaded exchange rate data');
            } else {
                // Fallback to mock data
                console.log('Exchange rate data not found, using mock data');
                this.data = this.generateMockData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = this.generateMockData();
        }
    }

    generateMockData() {
        // Generate mock exchange rate data
        const currentRate = 16500;
        const data = {
            timestamp: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
            rates: {
                mid_market: { rate: currentRate, buy: currentRate * 0.995, sell: currentRate * 1.005 },
                commonwealth_bank: { rate: currentRate * 1.02, buy: currentRate * 1.015, sell: currentRate * 1.025 },
                westpac: { rate: currentRate * 1.019, buy: currentRate * 1.014, sell: currentRate * 1.024 },
                anz: { rate: currentRate * 1.021, buy: currentRate * 1.016, sell: currentRate * 1.026 },
                nab: { rate: currentRate * 1.018, buy: currentRate * 1.013, sell: currentRate * 1.023 },
                wise: { rate: currentRate * 1.005, buy: currentRate * 1.002, sell: currentRate * 1.008 },
                xe: { rate: currentRate, buy: currentRate * 0.998, sell: currentRate * 1.002 }
            },
            historical: this.generateHistoricalData()
        };
        
        return data;
    }

    generateHistoricalData() {
        const historical = [];
        const baseRate = 16500;
        
        // Generate 90 days of historical data
        for (let i = 90; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Add some variation and trend
            const trend = Math.sin(i / 30) * 100; // Monthly cycle
            const random = (Math.random() - 0.5) * 50; // Random noise
            
            const rate = baseRate + trend + random;
            
            historical.push({
                date: dateStr,
                rate: rate,
                change: i > 0 ? rate - (baseRate + Math.sin((i+1) / 30) * 100) : 0
            });
        }
        
        return historical;
    }

    setupEventListeners() {
        // Currency calculator
        document.getElementById('audAmount').addEventListener('input', (e) => {
            this.updateConversion('audToVnd', parseFloat(e.target.value) || 0);
        });
        
        document.getElementById('vndResult').addEventListener('input', (e) => {
            const vndValue = parseFloat(e.target.value.replace(/,/g, '')) || 0;
            this.updateConversion('vndToAud', vndValue);
        });
        
        // Swap currencies
        document.getElementById('swapCurrencies').addEventListener('click', () => {
            this.swapCurrencies();
        });
        
        // Time scale buttons
        document.querySelectorAll('.time-scale-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active button
                document.querySelectorAll('.time-scale-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update chart
                this.currentTimeScale = e.target.dataset.scale;
                this.renderRateTrendChart();
            });
        });
    }

    renderDashboard() {
        console.log('Rendering exchange rate dashboard...');
        
        // Update main rate display
        this.updateMainRate();
        
        // Update provider comparison
        this.renderProviderComparison();
        
        // Update conversion calculator
        this.updateConversion('audToVnd', 100);
        
        // Update common conversions table
        this.renderConversionTable();
        
        // Update charts
        this.renderRateTrendChart();
        this.renderProviderChart();
        
        // Update last updated time
        this.updateLastUpdated();
        
        console.log('Exchange rate dashboard rendered');
    }

    updateMainRate() {
        const midMarketRate = this.data.rates.mid_market.rate;
        document.getElementById('mainRate').textContent = midMarketRate.toLocaleString('en-AU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        document.getElementById('vndAmount').textContent = midMarketRate.toLocaleString('en-AU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        document.getElementById('currentRate').textContent = midMarketRate.toLocaleString('en-AU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        // Calculate daily change (mock)
        const changePercent = 0.5; // Mock 0.5% increase
        const changeElement = document.getElementById('rateChange');
        changeElement.innerHTML = `
            <i class="fas fa-arrow-${changePercent >= 0 ? 'up' : 'down'}"></i>
            <span>${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}% today</span>
        `;
        changeElement.className = `rate-change ${changePercent >= 0 ? 'positive' : 'negative'}`;
    }

    renderProviderComparison() {
        const providerGrid = document.getElementById('providerGrid');
        providerGrid.innerHTML = '';
        
        // Find best and worst rates
        const rates = Object.values(this.data.rates).map(r => r.rate);
        const minRate = Math.min(...rates);
        const maxRate = Math.max(...rates);
        
        // Create provider cards
        this.providers.forEach(provider => {
            const rateData = this.data.rates[provider.id];
            if (!rateData) return;
            
            const spread = rateData.sell - rateData.buy;
            const spreadPercent = (spread / rateData.rate) * 100;
            
            const isBest = Math.abs(rateData.rate - minRate) < 0.01;
            const isWorst = Math.abs(rateData.rate - maxRate) < 0.01;
            
            const card = document.createElement('div');
            card.className = `provider-card ${isBest ? 'best' : ''} ${isWorst ? 'worst' : ''}`;
            card.innerHTML = `
                <div class="card-subtitle">${provider.name}</div>
                <div class="provider-rate">${rateData.rate.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</div>
                <div class="provider-spread">
                    <div>Buy: ${rateData.buy.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</div>
                    <div>Sell: ${rateData.sell.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</div>
                    <div>Spread: ${spread.toFixed(2)} (${spreadPercent.toFixed(2)}%)</div>
                </div>
                ${isBest ? '<div class="badge badge-success" style="margin-top: 0.5rem;">Best Rate</div>' : ''}
                ${isWorst ? '<div class="badge badge-danger" style="margin-top: 0.5rem;">Highest Fee</div>' : ''}
            `;
            
            providerGrid.appendChild(card);
        });
    }

    updateConversion(direction, amount) {
        const midMarketRate = this.data.rates.mid_market.rate;
        
        if (direction === 'audToVnd') {
            const vndAmount = amount * midMarketRate;
            document.getElementById('vndResult').value = vndAmount.toLocaleString('en-AU', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            this.currentDirection = 'audToVnd';
        } else {
            const audAmount = amount / midMarketRate;
            document.getElementById('audAmount').value = audAmount.toFixed(2);
            this.currentDirection = 'vndToAud';
        }
    }

    swapCurrencies() {
        const audInput = document.getElementById('audAmount');
        const vndInput = document.getElementById('vndResult');
        
        if (this.currentDirection === 'audToVnd') {
            const vndValue = parseFloat(vndInput.value.replace(/,/g, '')) || 0;
            this.updateConversion('vndToAud', vndValue);
        } else {
            const audValue = parseFloat(audInput.value) || 0;
            this.updateConversion('audToVnd', audValue);
        }
    }

    renderConversionTable() {
        const tableBody = document.getElementById('conversionTable');
        tableBody.innerHTML = '';
        
        const midMarketRate = this.data.rates.mid_market.rate;
        
        this.commonConversions.forEach(conversion => {
            const vndAmount = conversion.aud * midMarketRate;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${conversion.aud.toLocaleString('en-AU')} AUD</td>
                <td><strong>${vndAmount.toLocaleString('en-AU', { minimumFractionDigits: 0 })} VND</strong></td>
                <td>${conversion.description}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    renderRateTrendChart() {
        const ctx = document.getElementById('rateTrendChart').getContext('2d');
        
        // Filter historical data based on time scale
        const days = this.timeScales[this.currentTimeScale].days;
        const filteredData = this.data.historical.slice(-days);
        
        // Prepare data
        const dates = filteredData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
        });
        
        const rates = filteredData.map(item => item.rate);
        const changes = filteredData.map(item => item.change);
        
        // Create or update chart
        if (this.charts.rateTrend) {
            this.charts.rateTrend.destroy();
        }
        
        this.charts.rateTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'AUD to VND Rate',
                        data: rates,
                        borderColor: '#3b82f6',
                        backgroundColor: this.hexToRgba('#3b82f6', 0.1),
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Daily Change',
                        data: changes,
                        borderColor: '#10b981',
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        fill: false,
                        yAxisID: 'y1',
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Exchange Rate Trend (${this.timeScales[this.currentTimeScale].label})`
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                if (context.datasetIndex === 0) {
                                    return `Rate: 1 AUD = ${context.raw.toLocaleString('en-AU', { minimumFractionDigits: 2 })} VND`;
                                } else {
                                    return `Change: ${context.raw >= 0 ? '+' : ''}${context.raw.toFixed(2)}`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Exchange Rate (VND per AUD)'
                        },
                        ticks: {
                            callback: (value) => value.toLocaleString('en-AU', { minimumFractionDigits: 0 })
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Daily Change'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    renderProviderChart() {
        const ctx = document.getElementById('providerChart').getContext('2d');
        
        // Prepare data
        const providers = this.providers.filter(p => this.data.rates[p.id]);
        const labels = providers.map(p => p.name);
        const rates = providers.map(p => this.data.rates[p.id].rate);
        const colors = providers.map(p => p.color);
        
        // Calculate spreads
        const spreads = providers.map(p => {
            const rateData = this.data.rates[p.id];
            return rateData.sell - rateData.buy;
        });
        
        // Create or update chart
        if (this.charts.provider) {
            this.charts.provider.destroy();
        }
        
        this.charts.provider = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Exchange Rate',
                        data: rates,
                        backgroundColor: colors,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Spread',
                        data: spreads,
                        backgroundColor: colors.map(c => this.hexToRgba(c, 0.5)),
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Provider Comparison'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                if (context.datasetIndex === 0) {
                                    return `Rate: ${context.raw.toLocaleString('en-AU', { minimumFractionDigits: 2 })} VND`;
                                } else {
                                    return `Spread: ${context.raw.toFixed(2)} VND`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Exchange Rate (VND per AUD)'
                        },
                        ticks: {
                            callback: (value) => value.toLocaleString('en-AU', { minimumFractionDigits: 0 })
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Spread (VND)'
                        },
                        grid: {
                            drawOnChartArea: false
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
            nextUpdate.setDate(nextUpdate.getDate() +