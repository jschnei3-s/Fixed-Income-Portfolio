// Bond Portfolio Management System

/* ========================================
   Portfolio Data Structure
   ======================================== */

let portfolio = {
    bonds: []
};

/* ========================================
   Portfolio Operations
   ======================================== */

/**
 * Add current bond to portfolio
 */
function addBondToPortfolio() {
    // Get current bond data from the calculator
    const faceValue = parseFloat(document.getElementById('faceValue').value);
    const couponRate = parseFloat(document.getElementById('couponRate').value);
    const maturity = parseFloat(document.getElementById('maturity').value);
    const bondType = document.getElementById('bondType').value;
    const yieldValue = parseFloat(document.getElementById('yield').value) || null;
    
    // Validate that a calculation has been made
    const bondPrice = document.getElementById('bondPrice').textContent;
    if (bondPrice === '$0.00') {
        showError('Please calculate a bond first before adding to portfolio');
        return;
    }
    
    // Create bond object
    const bond = {
        id: Date.now(), // Unique ID
        faceValue: faceValue,
        couponRate: couponRate / 100, // Convert to decimal
        maturity: maturity,
        bondType: bondType,
        yield: yieldValue ? yieldValue / 100 : yieldValue,
        price: parseFloat(bondPrice.replace(/[$,]/g, '')),
        ytm: parseFloat(document.getElementById('ytm').textContent.replace('%', '')),
        priceChange: parseFloat(document.getElementById('priceChange').textContent.replace(/[+%]/g, '')),
        timestamp: new Date().toISOString()
    };
    
    // Add to portfolio
    portfolio.bonds.push(bond);
    
    // Update display
    updatePortfolioDisplay();
    
    // Save to localStorage
    savePortfolioToStorage();
}

/**
 * Remove bond from portfolio
 * @param {number} bondId - ID of the bond to remove
 */
function removeBondFromPortfolio(bondId) {
    portfolio.bonds = portfolio.bonds.filter(bond => bond.id !== bondId);
    updatePortfolioDisplay();
    savePortfolioToStorage();
}

/**
 * Clear entire portfolio
 */
function clearPortfolio() {
    if (portfolio.bonds.length === 0) {
        return;
    }
    
    if (confirm('Are you sure you want to clear the entire portfolio?')) {
        portfolio.bonds = [];
        updatePortfolioDisplay();
        savePortfolioToStorage();
    }
}

/* ========================================
   Portfolio Display
   ======================================== */

/**
 * Update portfolio display
 */
function updatePortfolioDisplay() {
    const portfolioList = document.getElementById('portfolioList');
    const portfolioInfo = document.getElementById('portfolioInfo');
    const portfolioDashboard = document.getElementById('portfolioDashboard');
    
    // Clear existing content
    portfolioList.innerHTML = '';
    
    if (portfolio.bonds.length === 0) {
        portfolioInfo.style.display = 'block';
        portfolioInfo.innerHTML = '<p>No bonds in portfolio. Calculate a bond and click "Add to Portfolio" to start building your portfolio.</p>';
        portfolioDashboard.style.display = 'none';
        return;
    }
    
    // Hide info message and show dashboard
    portfolioInfo.style.display = 'none';
    portfolioDashboard.style.display = 'block';
    
    // Display bonds
    portfolio.bonds.forEach(bond => {
        const bondElement = createBondElement(bond);
        portfolioList.appendChild(bondElement);
    });
    
    // Update metrics and charts
    updatePortfolioMetrics();
    generateComparisonChart();
    generatePortfolioPriceChart();
    generateYieldChart();
}

/**
 * Create HTML element for a bond in the portfolio
 * @param {Object} bond - Bond data object
 * @returns {HTMLElement} Bond element
 */
function createBondElement(bond) {
    const div = document.createElement('div');
    div.className = 'portfolio-bond-item';
    div.innerHTML = `
        <div class="bond-header">
            <div class="bond-title">${getBondDisplayName(bond)}</div>
            <button class="bond-remove-btn" onclick="removeBondFromPortfolio(${bond.id})">Remove</button>
        </div>
        <div class="bond-details">
            <div class="bond-detail-item">
                <div class="bond-detail-label">Face Value</div>
                <div class="bond-detail-value">${formatCurrency(bond.faceValue)}</div>
            </div>
            <div class="bond-detail-item">
                <div class="bond-detail-label">Coupon Rate</div>
                <div class="bond-detail-value">${(bond.couponRate * 100).toFixed(2)}%</div>
            </div>
            <div class="bond-detail-item">
                <div class="bond-detail-label">Maturity</div>
                <div class="bond-detail-value">${bond.maturity} years</div>
            </div>
            <div class="bond-detail-item">
                <div class="bond-detail-label">Price</div>
                <div class="bond-detail-value">${formatCurrency(bond.price)}</div>
            </div>
            <div class="bond-detail-item">
                <div class="bond-detail-label">YTM</div>
                <div class="bond-detail-value">${bond.ytm.toFixed(2)}%</div>
            </div>
        </div>
    `;
    return div;
}

/**
 * Get display name for bond
 * @param {Object} bond - Bond data object
 * @returns {string} Display name
 */
function getBondDisplayName(bond) {
    if (bond.bondType === 'CUSTOM') {
        return `Custom Bond (${bond.faceValue.toFixed(0)} @ ${(bond.couponRate * 100).toFixed(2)}%)`;
    }
    
    // Format Treasury bond names
    let displayName = bond.bondType.replace('US', '');
    if (displayName.endsWith('Y')) {
        displayName = displayName.replace('Y', '-Year Treasury');
    } else if (displayName.endsWith('M')) {
        displayName = displayName.replace('M', '-Month Treasury');
    }
    
    return displayName;
}

/**
 * Update portfolio metrics display
 */
function updatePortfolioMetrics() {
    // Calculate total value
    const totalValue = portfolio.bonds.reduce((sum, bond) => sum + bond.price, 0);
    
    // Calculate weighted average yield
    let totalWeight = 0;
    let weightedYield = 0;
    let expectedAnnualReturn = 0;
    
    portfolio.bonds.forEach(bond => {
        totalWeight += bond.price;
        weightedYield += bond.price * bond.ytm;
        // Calculate annual coupon payment
        expectedAnnualReturn += bond.faceValue * bond.couponRate;
    });
    
    const avgYield = totalWeight > 0 ? weightedYield / totalWeight : 0;
    
    // Update UI
    document.getElementById('totalValue').textContent = formatCurrency(totalValue);
    document.getElementById('avgYield').textContent = formatPercent(avgYield / 100);
    document.getElementById('bondCount').textContent = portfolio.bonds.length;
    document.getElementById('expectedReturn').textContent = formatCurrency(expectedAnnualReturn);
}

/* ========================================
   Portfolio Charts
   ======================================== */

let comparisonChart = null;
let portfolioPriceChart = null;
let yieldChart = null;

/**
 * Generate comparison chart with Treasury benchmarks
 */
function generateComparisonChart() {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (comparisonChart) {
        comparisonChart.destroy();
    }
    
    // Get Treasury benchmarks for comparison (from our fallback data)
    const treasuryData = getFallbackYieldData('US10Y');
    
    // Calculate portfolio weighted average
    let totalWeight = 0;
    let weightedYield = 0;
    portfolio.bonds.forEach(bond => {
        totalWeight += bond.price;
        weightedYield += bond.price * bond.ytm;
    });
    const portfolioYield = totalWeight > 0 ? weightedYield / totalWeight : 0;
    
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Your Portfolio', '10Y Treasury Benchmark'],
            datasets: [{
                label: 'Yield (%)',
                data: [(portfolioYield).toFixed(2), (treasuryData.yield * 100).toFixed(2)],
                backgroundColor: ['#d4af37', '#2c5aa0'],
                borderColor: ['#b8941f', '#1a1f3a'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Yield (%)' }
                }
            }
        }
    });
}

/**
 * Generate portfolio price comparison chart
 */
function generatePortfolioPriceChart() {
    const ctx = document.getElementById('portfolioPriceChart');
    if (!ctx) return;
    
    if (portfolioPriceChart) {
        portfolioPriceChart.destroy();
    }
    
    const labels = portfolio.bonds.map(bond => getBondDisplayName(bond));
    const prices = portfolio.bonds.map(bond => bond.price);
    const colors = ['#d4af37', '#1a1f3a', '#2c5aa0', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
    
    portfolioPriceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bond Price',
                data: prices,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#1a1f3a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    title: { display: true, text: 'Bond Price ($)' }
                }
            }
        }
    });
}

/**
 * Generate yield distribution chart
 */
function generateYieldChart() {
    const ctx = document.getElementById('yieldChart');
    if (!ctx) return;
    
    if (yieldChart) {
        yieldChart.destroy();
    }
    
    const labels = portfolio.bonds.map(bond => getBondDisplayName(bond));
    const yields = portfolio.bonds.map(bond => bond.ytm);
    const colors = ['#d4af37', '#1a1f3a', '#2c5aa0', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
    
    yieldChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Yield (%)',
                data: yields,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.toFixed(2) + '%';
                        }
                    }
                }
            }
        }
    });
}

/* ========================================
   Local Storage
   ======================================== */

/**
 * Save portfolio to localStorage
 */
function savePortfolioToStorage() {
    try {
        localStorage.setItem('bondPortfolio', JSON.stringify(portfolio));
    } catch (error) {
        console.error('Error saving portfolio:', error);
    }
}

/**
 * Load portfolio from localStorage
 */
function loadPortfolioFromStorage() {
    try {
        const saved = localStorage.getItem('bondPortfolio');
        if (saved) {
            portfolio = JSON.parse(saved);
            updatePortfolioDisplay();
        }
    } catch (error) {
        console.error('Error loading portfolio:', error);
    }
}

/* ========================================
   Initialization
   ======================================== */

/**
 * Initialize portfolio system
 */
function initPortfolio() {
    // Add event listeners
    const addBtn = document.getElementById('addToPortfolioBtn');
    const clearBtn = document.getElementById('clearPortfolioBtn');
    
    if (addBtn) {
        addBtn.addEventListener('click', addBondToPortfolio);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearPortfolio);
    }
    
    // Load portfolio from storage
    loadPortfolioFromStorage();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}

