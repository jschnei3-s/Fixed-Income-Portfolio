// Bond Investment Calculator - Chart Visualization

/* ========================================
   Chart Initialization
   ======================================== */

let bondChart = null;

/**
 * Initialize the bond price-yield chart
 * Called when the page loads
 */
function initializeChart() {
    const ctx = document.getElementById('bondChart');
    
    if (!ctx) {
        console.error('Chart canvas element not found');
        return;
    }
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        return;
    }
    
    bondChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Bond Price',
                data: [],
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#d4af37',
                pointBorderColor: '#1a1f3a',
                pointBorderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#1a1f3a',
                        padding: 15,
                        boxWidth: 15
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(26, 31, 58, 0.9)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    borderColor: '#d4af37',
                    borderWidth: 2,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = typeof context.parsed.y === 'number' 
                                ? formatCurrency(context.parsed.y)
                                : context.parsed.y;
                            return label + ': ' + value;
                        },
                        labelColor: function(context) {
                            return {
                                borderColor: '#d4af37',
                                backgroundColor: '#d4af37'
                            };
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Yield to Maturity (%)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#1a1f3a',
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Bond Price ($)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#1a1f3a',
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            // Format y-axis labels as currency
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

/* ========================================
   Generate Price-Yield Curve
   ======================================== */

/**
 * Generate and display the price-yield curve
 * @param {number} faceValue - Face value of bond
 * @param {number} couponRate - Annual coupon rate (as decimal)
 * @param {number} yearsToMaturity - Years to maturity
 */
function generatePriceYieldCurve(faceValue, couponRate, yearsToMaturity) {
    if (!bondChart) {
        console.warn('Chart not initialized yet');
        return;
    }
    
    const yields = [];
    const prices = [];
    
    // Generate yield range from 0% to 10% in 0.5% increments
    for (let yieldVal = 0; yieldVal <= 10; yieldVal += 0.5) {
        yields.push(yieldVal);
        
        // Calculate bond price at this yield
        const price = calculateBondPrice(
            faceValue, 
            couponRate, 
            yearsToMaturity, 
            yieldVal / 100
        );
        
        prices.push(price);
    }
    
    // Update chart data
    bondChart.data.labels = yields.map(y => y + '%');
    bondChart.data.datasets[0].data = prices;
    
    // Update chart
    bondChart.update('active');
}

/* ========================================
   Highlight Current Point
   ======================================== */

/**
 * Highlight a specific point on the chart
 * @param {number} targetYield - Target yield to highlight
 * @param {number} targetPrice - Target price to highlight
 */
function highlightPoint(targetYield, targetPrice) {
    if (!bondChart) return;
    
    // Update the dataset to include a highlighted point
    const datasets = bondChart.data.datasets;
    
    // Find the closest yield point
    const yields = bondChart.data.labels.map(label => 
        parseFloat(label.replace('%', ''))
    );
    
    const closestIndex = yields.reduce((prev, curr, index) => {
        return Math.abs(curr - targetYield) < Math.abs(yields[prev] - targetYield) 
            ? index 
            : prev;
    }, 0);
    
    // Add a highlighted point dataset
    const highlightDataset = {
        label: 'Current Bond',
        data: datasets[0].data.map((price, index) => 
            index === closestIndex ? price : null
        ),
        borderColor: '#1a1f3a',
        backgroundColor: '#1a1f3a',
        pointRadius: 8,
        pointHoverRadius: 10,
        pointStyle: 'circle',
        showLine: false,
        pointBackgroundColor: '#1a1f3a',
        pointBorderColor: '#d4af37',
        pointBorderWidth: 3
    };
    
    // Remove existing highlight dataset if it exists
    if (datasets.length > 1) {
        datasets.splice(1, 1);
    }
    
    datasets.push(highlightDataset);
    
    bondChart.update('active');
}

/* ========================================
   Helper Function for Currency Formatting
   ======================================== */

/**
 * Format currency value (used in chart tooltips)
 * @param {number} value - Numeric value
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/* ========================================
   Initialize Chart on Load
   ======================================== */

// Initialize chart when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit to ensure Chart.js is fully loaded
        setTimeout(initializeChart, 100);
    });
} else {
    setTimeout(initializeChart, 100);
}

