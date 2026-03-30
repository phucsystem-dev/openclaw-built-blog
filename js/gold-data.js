// Auto-generated gold price data
// Generated: 2026-03-30T22:40:09.540327
// Total records: 3

const goldHistoricalData = [
  {
    "date": "2026-03-31",
    "brand": "SJC",
    "avg_buy": 84526106,
    "avg_sell": 84726287,
    "spread": 200180,
    "cities": [
      "Ho Chi Minh City",
      "Hanoi"
    ]
  },
  {
    "date": "2026-03-31",
    "brand": "DOJI",
    "avg_buy": 83951590,
    "avg_sell": 84150882,
    "spread": 199291,
    "cities": [
      "Ho Chi Minh City",
      "Hanoi"
    ]
  },
  {
    "date": "2026-03-31",
    "brand": "PNJ",
    "avg_buy": 84508676,
    "avg_sell": 84709528,
    "spread": 200852,
    "cities": [
      "Ho Chi Minh City",
      "Hanoi"
    ]
  }
];

const goldDataByBrand = {
  "SJC": [
    {
      "date": "2026-03-31",
      "brand": "SJC",
      "avg_buy": 84526106,
      "avg_sell": 84726287,
      "spread": 200180,
      "cities": [
        "Ho Chi Minh City",
        "Hanoi"
      ]
    }
  ],
  "DOJI": [
    {
      "date": "2026-03-31",
      "brand": "DOJI",
      "avg_buy": 83951590,
      "avg_sell": 84150882,
      "spread": 199291,
      "cities": [
        "Ho Chi Minh City",
        "Hanoi"
      ]
    }
  ],
  "PNJ": [
    {
      "date": "2026-03-31",
      "brand": "PNJ",
      "avg_buy": 84508676,
      "avg_sell": 84709528,
      "spread": 200852,
      "cities": [
        "Ho Chi Minh City",
        "Hanoi"
      ]
    }
  ]
};

// Helper functions
function getBrandData(brand) {
    return goldDataByBrand[brand] || [];
}

function getDateRangeData(startDate, endDate) {
    return goldHistoricalData.filter(item => 
        item.date >= startDate && item.date <= endDate
    );
}

function getLatestPrices() {
    // Get latest date
    const dates = [...new Set(goldHistoricalData.map(item => item.date))].sort();
    const latestDate = dates[dates.length - 1];
    
    return goldHistoricalData.filter(item => item.date === latestDate);
}

// Export for use in dashboard
window.goldPriceData = {
    historical: goldHistoricalData,
    byBrand: goldDataByBrand,
    getBrandData,
    getDateRangeData,
    getLatestPrices
};

console.log('Gold price data loaded:', goldHistoricalData.length, 'records');
