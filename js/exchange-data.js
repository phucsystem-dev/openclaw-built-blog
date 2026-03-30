// Auto-generated exchange rate data
// Generated: 2026-03-30T22:48:26.035720
// Total records: 1

const exchangeHistoricalData = [
  {
    "date": "2026-03-31",
    "mid_market_rate": 16623.29,
    "average_rate": 16822.769480000003,
    "min_rate": 16656.53658,
    "max_rate": 17038.87225
  }
];

const exchangeCurrentRates = {
  "date": "2026-03-31",
  "mid_market_rate": 16623.29,
  "average_rate": 16822.769480000003,
  "min_rate": 16656.53658,
  "max_rate": 17038.87225
};

const exchangeProviderRates = {
  "mid_market": {
    "rate": 16623.29,
    "source": "Mid-market average",
    "buy": 16540.17355,
    "sell": 16706.40645
  },
  "commonwealth_bank": {
    "rate": 16955.755800000003,
    "source": "Commonwealth Bank",
    "buy": 16872.639349999998,
    "sell": 17038.87225
  },
  "westpac": {
    "rate": 16939.13251,
    "source": "Westpac",
    "buy": 16856.01606,
    "sell": 17022.24896
  },
  "anz": {
    "rate": 16972.37909,
    "source": "ANZ",
    "buy": 16889.26264,
    "sell": 17055.49554
  },
  "nab": {
    "rate": 16922.50922,
    "source": "NAB",
    "buy": 16839.39277,
    "sell": 17005.625669999998
  },
  "wise": {
    "rate": 16706.40645,
    "source": "Wise (TransferWise)",
    "buy": 16656.53658,
    "sell": 16756.27632
  },
  "xe": {
    "rate": 16623.29,
    "source": "XE.com",
    "buy": 16590.04342,
    "sell": 16656.53658
  }
};

// Helper functions
function getExchangeRateByDate(date) {
    return exchangeHistoricalData.find(item => item.date === date);
}

function getDateRangeExchangeData(startDate, endDate) {
    return exchangeHistoricalData.filter(item => 
        item.date >= startDate && item.date <= endDate
    );
}

function getLatestExchangeRate() {
    return exchangeHistoricalData[exchangeHistoricalData.length - 1] || {};
}

function convertAUDtoVND(audAmount, rateType = 'mid_market_rate') {
    const latest = getLatestExchangeRate();
    const rate = latest[rateType] || latest.mid_market_rate || 16500;
    return audAmount * rate;
}

function convertVNDtoAUD(vndAmount, rateType = 'mid_market_rate') {
    const latest = getLatestExchangeRate();
    const rate = latest[rateType] || latest.mid_market_rate || 16500;
    return vndAmount / rate;
}

// Export for use in dashboard
window.exchangeRateData = {
    historical: exchangeHistoricalData,
    current: exchangeCurrentRates,
    providers: exchangeProviderRates,
    getExchangeRateByDate,
    getDateRangeExchangeData,
    getLatestExchangeRate,
    convertAUDtoVND,
    convertVNDtoAUD
};

console.log('Exchange rate data loaded:', exchangeHistoricalData.length, 'records');
