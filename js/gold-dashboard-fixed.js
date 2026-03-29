// Vietnam Gold Price Dashboard - Fixed Version
console.log('Gold dashboard script loaded');

// Simple gold price dashboard
function initGoldDashboard() {
    console.log('Initializing gold dashboard...');
    
    // Show loading initially
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    
    // Generate mock data
    const data = generateMockData();
    
    // Render dashboard after short delay
    setTimeout(() => {
        renderDashboard(data);
    }, 500);
}

function generateMockData() {
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
                const variation = (Math.random() - 0.5) * 500000;
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

function renderDashboard(data) {
    console.log('Rendering dashboard with', data.length, 'records');
    
    // Hide loading, show dashboard
    document.getElementById('loading').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    // Update statistics
    updateStatistics(data);
    
    // Update last updated time
    updateLastUpdated();
    
    // Setup event listeners
    setupEventListeners(data);
    
    // Initial chart render
    updateChart(data, 'all', 'all', 'buy');
    
    // Initial table render
    updateDataTable(data);
}

function updateStatistics(data) {
    // Update SJC price
    const sjcData = data.filter(d => d.brand === 'sjc' && d.city === 'hcm');
    if (sjcData.length > 0) {
        const latest = sjcData[sjcData.length - 1];
        const previous = sjcData.length > 1 ? sjcData[sjcData.length - 2] : latest;
        const change = latest.buy_price - previous.buy_price;
        const changePercent = ((change / previous.buy_price) * 100).toFixed(2);
        
        document.getElementById('sjcPrice').textContent = formatPrice(latest.buy_price);
        document.getElementById('sjcChange').innerHTML = `
            <span>${change >= 0 ? '+' : ''}${formatPrice(change)}</span>
            <i class="fas fa-arrow-${change >= 0 ? 'up' : 'down'}"></i>
            <span>${change >= 0 ? '+' : ''}${changePercent}%</span>
        `;
        document.getElementById('sjcChange').className = `stat-change ${change >= 0 ? 'positive' : 'negative'}`;
    }
    
    // Update DOJI price
    const dojiData = data.filter(d => d.brand === 'doji' && d.city === 'hn');
    if (dojiData.length > 0) {
        const latest = dojiData[dojiData.length - 1];
        const previous = dojiData.length > 1 ? dojiData[dojiData.length - 2] : latest;
        const change = latest.buy_price - previous.buy_price;
        const changePercent = ((change / previous.buy_price) * 100).toFixed(2);
        
        document.getElementById('dojiPrice').textContent = formatPrice(latest.buy_price);
        document.getElementById('dojiChange').innerHTML = `
            <span>${change >= 0 ? '+' : ''}${formatPrice(change)}</span>
            <i class="fas fa-arrow-${change >= 0 ? 'up' : 'down'}"></i>
            <span>${change >= 0 ? '+' : ''}${changePercent}%</span>
        `;
        document.getElementById('dojiChange').className = `stat-change ${change >= 0 ? 'positive' : 'negative'}`;
    }
    
    // Update PNJ price
    const pnjData = data.filter(d => d.brand === 'pnj' && d.city === 'hcm');
    if (pnjData.length > 0) {
        const latest = pnjData[pnjData.length - 1];
        const previous = pnjData.length > 1 ? pnjData[pnjData.length - 2] : latest;
        const change = latest.buy_price - previous.buy_price;
        const changePercent = ((change / previous.buy_price) * 100).toFixed(2);
        
        document.getElementById('pnjPrice').textContent = formatPrice(latest.buy_price);
        document.getElementById('pnjChange').innerHTML = `
            <span>${change >= 0 ? '+' : ''}${formatPrice(change)}</span>
            <i class="fas fa-arrow-${change >= 0 ? 'up' : 'down'}"></i>
            <span>${change >= 0 ? '+' : ''}${changePercent}%</span>
        `;
        document.getElementById('pnjChange').className = `stat-change ${change >= 0 ? 'positive' : 'negative'}`;
    }
}

function updateLastUpdated() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = now.toLocaleString('en-AU', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

function setupEventListeners(data) {
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        refreshData(data);
    });
    
    // Brand select
    document.getElementById('brandSelect').addEventListener('change', (e) => {
        updateChart(data, e.target.value, document.getElementById('citySelect').value, document.getElementById('priceType').value);
        updateDataTable(filterData(data, e.target.value, document.getElementById('citySelect').value));
    });
    
    // City select
    document.getElementById('citySelect').addEventListener('change', (e) => {
        updateChart(data, document.getElementById('brandSelect').value, e.target.value, document.getElementById('priceType').value);
        updateDataTable(filterData(data, document.getElementById('brandSelect').value, e.target.value));
    });
    
    // Price type select
    document.getElementById('priceType').addEventListener('change', (e) => {
        updateChart(data, document.getElementById('brandSelect').value, document.getElementById('citySelect').value, e.target.value);
    });
}

function filterData(data, brand, city) {
    let filtered = data;
    
    if (brand !== 'all') {
        filtered = filtered.filter(d => d.brand === brand);
    }
    
    if (city !== 'all') {
        filtered = filtered.filter(d => d.city === city);
    }
    
    return filtered;
}

let chartInstance = null;

function updateChart(data, brand, city, priceType) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // Destroy existing chart
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    // Filter data
    const filteredData = filterData(data, brand, city);
    
    // Group by date
    const dates = [...new Set(filteredData.map(d => d.date))].sort();
    
    // Prepare datasets
    const brandsToShow = brand === 'all' ? ['sjc', 'doji', 'pnj'] : [brand];
    const datasets = [];
    
    brandsToShow.forEach(brandName => {
        const brandData = filteredData.filter(d => d.brand === brandName);
        if (brandData.length === 0) return;
        
        const color = {
            'sjc': '#d4af37',
            'doji': '#10b981',
            'pnj': '#6366f1'
        }[brandName] || '#94a3b8';
        
        datasets.push({
            label: brandName.toUpperCase(),
            data: dates.map(date => {
                const dayData = brandData.filter(d => d.date === date);
                if (dayData.length === 0) return null;
                
                const prices = dayData.map(d => priceType === 'buy' ? d.buy_price : d.sell_price);
                return prices.reduce((sum, p) => sum + p, 0) / prices.length;
            }),
            borderColor: color,
            backgroundColor: hexToRgba(color, 0.1),
            tension: 0.4,
            fill: true
        });
    });
    
    // Create chart
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(d => {
                const date = new Date(d);
                return date.toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' });
            }),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

function updateDataTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    // Group by date and brand/city
    const grouped = {};
    data.forEach(item => {
        const key = `${item.date}-${item.brand}-${item.city}`;
        if (!grouped[key]) grouped[key] = item;
    });
    
    // Sort by date (newest first)
    const tableData = Object.values(grouped).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Populate table
    tableData.forEach(item => {
        const row = document.createElement('tr');
        const spread = item.sell_price - item.buy_price;
        
        row.innerHTML = `
            <td>${new Date(item.date).toLocaleDateString('en-AU')}</td>
            <td><strong>${item.brand.toUpperCase()}</strong></td>
            <td>${item.city === 'hcm' ? 'Ho Chi Minh' : 'Hanoi'}</td>
            <td>${formatPrice(item.buy_price)}</td>
            <td>${formatPrice(item.sell_price)}</td>
            <td>${formatPrice(spread)}</td>
            <td class="positive">+${formatPrice(500000)} (+0.6%)</td>
        `;
        tbody.appendChild(row);
    });
}

function refreshData(originalData) {
    const btn = document.getElementById('refreshBtn');
    const originalHtml = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    btn.disabled = true;
    
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    
    setTimeout(() => {
        // Generate new data with slight variations
        const newData = generateMockData();
        
        // Update statistics
        updateStatistics(newData);
        updateLastUpdated();
        
        // Update chart and table based on current filters
        const brand = document.getElementById('brandSelect').value;
        const city = document.getElementById('citySelect').value;
        const priceType = document.getElementById('priceType').value;
        
        updateChart(newData, brand, city, priceType);
        updateDataTable(filterData(newData, brand, city));
        
        // Show dashboard
        document.getElementById('loading').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        
        console.log('Data refreshed');
    }, 1000);
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGoldDashboard);