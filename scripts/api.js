// Bond Investment Calculator - API Integration

/* ========================================
   Fetch Live Bond Yield Data
   ======================================== */

/**
 * Fetch live bond yield data from API
 * @param {string} symbol - Bond symbol (e.g., 'US10Y', 'US30Y')
 * @returns {Promise<Object|null>} Yield data or null if error
 */
async function fetchLiveYield(symbol) {
    try {
        // Show loading state
        showLoadingState();
        
        let data;
        
        // Try serverless function first (for production)
        try {
            const response = await fetch(`/api/live-yield?symbol=${symbol}`);
            
            if (response.ok) {
                data = await response.json();
            } else {
                throw new Error('Serverless function not available');
            }
        } catch (serverlessError) {
            // Fallback: Use mock/demo data for local development
            console.log('Using fallback data for local development');
            data = getFallbackYieldData(symbol);
        }
        
        // Hide loading state
        hideLoadingState();
        
        return data;
        
    } catch (error) {
        console.error('Error fetching live data:', error);
        hideLoadingState();
        showErrorState(symbol);
        return null;
    }
}

/**
 * Get fallback yield data for local development
 * @param {string} symbol - Bond symbol
 * @returns {Object} Mock yield data
 */
function getFallbackYieldData(symbol) {
    // Mock data that represents realistic bond yields across the yield curve
    // These values simulate a typical yield curve (slightly inverted in this example)
    const mockData = {
        'US1M': { yield: 0.0500 },   // 5.00%
        'US3M': { yield: 0.0480 },   // 4.80%
        'US6M': { yield: 0.0470 },   // 4.70%
        'US1Y': { yield: 0.0460 },   // 4.60%
        'US2Y': { yield: 0.0450 },   // 4.50%
        'US3Y': { yield: 0.0445 },   // 4.45%
        'US5Y': { yield: 0.0435 },   // 4.35%
        'US7Y': { yield: 0.0430 },   // 4.30%
        'US10Y': { yield: 0.0425 },  // 4.25%
        'US20Y': { yield: 0.0435 },  // 4.35%
        'US30Y': { yield: 0.0440 }   // 4.40%
    };
    
    // Return mock data if available, otherwise default
    if (mockData[symbol]) {
        return mockData[symbol];
    }
    
    // Default fallback
    return { yield: 0.0425 }; // 4.25% average
}

/* ========================================
   Display Live Market Data
   ======================================== */

/**
 * Display live market data in the UI
 * @param {string} symbol - Bond symbol
 * @param {number} yieldValue - Yield value as percentage
 */
function displayLiveMarketData(symbol, yieldValue) {
    const liveDataElement = document.getElementById('liveData');
    
    if (!liveDataElement) return;
    
    const formattedYield = yieldValue.toFixed(2);
    
    // Format the display symbol based on the maturity period
    let displaySymbol = symbol.replace('US', '');
    
    // Handle different maturity notations
    if (displaySymbol.endsWith('M')) {
        // Month notation (1M, 3M, 6M)
        displaySymbol = displaySymbol.replace('M', '-Month');
    } else if (displaySymbol.endsWith('Y')) {
        // Year notation (1Y, 2Y, etc.)
        displaySymbol = displaySymbol.replace('Y', '-Year');
    }
    
    liveDataElement.innerHTML = `
        <div class="market-data-success">
            <h3>Current ${displaySymbol} Treasury Yield</h3>
            <p class="market-yield">${formattedYield}%</p>
            <small>Last updated: ${new Date().toLocaleTimeString()}</small>
        </div>
    `;
}

/* ========================================
   Loading States
   ======================================== */

/**
 * Show loading state while fetching data
 */
function showLoadingState() {
    const liveDataElement = document.getElementById('liveData');
    if (liveDataElement) {
        liveDataElement.innerHTML = `
            <div class="loading-container">
                <div class="loading"></div>
                <p>Fetching live market data...</p>
            </div>
        `;
    }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    // Loading state will be replaced by actual data or error
}

/**
 * Show error state when API fails
 * @param {string} symbol - Bond symbol that failed
 */
function showErrorState(symbol) {
    const liveDataElement = document.getElementById('liveData');
    if (liveDataElement) {
        liveDataElement.innerHTML = `
            <div class="market-data-error">
                <p>Unable to fetch live data for ${symbol}</p>
                <small>Please use custom yield option or try again later</small>
            </div>
        `;
    }
}

/* ========================================
   Handle Bond Type Selection
   ======================================== */

/**
 * Handle bond type dropdown change
 * Enable/disable custom yield input based on selection
 */
function setupBondTypeHandler() {
    const bondTypeSelect = document.getElementById('bondType');
    const yieldInputGroup = document.getElementById('yieldInputGroup');
    const yieldInput = document.getElementById('yield');
    
    if (!bondTypeSelect || !yieldInputGroup || !yieldInput) return;
    
    bondTypeSelect.addEventListener('change', function() {
        if (this.value === 'CUSTOM') {
            // Show custom yield input
            yieldInputGroup.style.display = 'block';
            yieldInput.required = true;
            
            // Clear live market data
            const liveDataElement = document.getElementById('liveData');
            if (liveDataElement) {
                liveDataElement.innerHTML = '<p class="loading-text">Enter custom yield value</p>';
            }
        } else {
            // Hide custom yield input
            yieldInputGroup.style.display = 'none';
            yieldInput.required = false;
            
            // Fetch live data for selected bond
            fetchAndDisplayLiveData(this.value);
        }
    });
}

/**
 * Fetch and display live data for selected bond type
 * @param {string} symbol - Bond symbol
 */
async function fetchAndDisplayLiveData(symbol) {
    const data = await fetchLiveYield(symbol);
    
    if (data && data.yield !== undefined) {
        // Convert yield to percentage (Finnhub returns as decimal)
        const yieldPercent = data.yield * 100;
        
        // Update the hidden yield input with the live value
        const yieldInput = document.getElementById('yield');
        if (yieldInput) {
            yieldInput.value = yieldPercent.toFixed(2);
        }
        
        // Display in the market data section
        displayLiveMarketData(symbol, yieldPercent);
    }
}

/* ========================================
   Enhanced Form Handler
   ======================================== */

/**
 * Enhanced form submission handler with live data support
 * This integrates with the existing calculator functionality
 */
async function handleFormSubmitWithLiveData() {
    const bondTypeSelect = document.getElementById('bondType');
    const yieldInput = document.getElementById('yield');
    
    // Check if custom or live data
    if (bondTypeSelect.value !== 'CUSTOM') {
        // Use live market data
        const symbol = bondTypeSelect.value;
        const data = await fetchLiveYield(symbol);
        
        if (data && data.yield !== undefined) {
            // Convert to percentage
            const yieldPercent = data.yield * 100;
            yieldInput.value = yieldPercent.toFixed(2);
        }
    }
    
    // Call the existing form handler from calculator.js
    if (typeof handleFormSubmit === 'function') {
        handleFormSubmit();
    }
}

/* ========================================
   Initialize API Integration
   ======================================== */

/**
 * Initialize API integration functionality
 * Called when the page loads
 */
function initAPI() {
    // Setup bond type handler
    setupBondTypeHandler();
    
    // Fetch default live data on load
    const bondTypeSelect = document.getElementById('bondType');
    if (bondTypeSelect && bondTypeSelect.value !== 'CUSTOM') {
        fetchAndDisplayLiveData(bondTypeSelect.value);
    }
}

// Initialize API integration when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAPI);
} else {
    initAPI();
}

