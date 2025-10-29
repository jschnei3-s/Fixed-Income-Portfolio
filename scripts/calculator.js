// Bond Investment Calculator - Main Calculation Logic

/* ========================================
   Bond Price Calculation
   ======================================== */

/**
 * Calculate bond price given parameters
 * @param {number} faceValue - Face value of bond
 * @param {number} couponRate - Annual coupon rate (as decimal, e.g., 0.05 for 5%)
 * @param {number} yearsToMaturity - Years until bond matures
 * @param {number} marketYield - Market yield/YTM (as decimal)
 * @param {number} frequency - Coupon payments per year (default: 2)
 * @returns {number} Bond price
 */
function calculateBondPrice(faceValue, couponRate, yearsToMaturity, marketYield, frequency = 2) {
    const periods = yearsToMaturity * frequency;
    const couponPayment = (couponRate * faceValue) / frequency;
    const ratePerPeriod = marketYield / frequency;

    let price = 0;

    // Present value of coupon payments
    for (let i = 1; i <= periods; i++) {
        price += couponPayment / Math.pow(1 + ratePerPeriod, i);
    }

    // Present value of face value
    price += faceValue / Math.pow(1 + ratePerPeriod, periods);

    return price;
}

/* ========================================
   Yield to Maturity Calculation
   ======================================== */

/**
 * Calculate approximate yield to maturity
 * @param {number} price - Current bond price
 * @param {number} faceValue - Face value
 * @param {number} couponRate - Annual coupon rate
 * @param {number} yearsToMaturity - Years to maturity
 * @returns {number} Approximate YTM (as decimal)
 */
function calculateYTM(price, faceValue, couponRate, yearsToMaturity) {
    const couponPayment = couponRate * faceValue;
    const numerator = couponPayment + (faceValue - price) / yearsToMaturity;
    const denominator = (faceValue + price) / 2;
    return numerator / denominator;
}

/* ========================================
   Formatting Functions
   ======================================== */

/**
 * Format currency value
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

/**
 * Format percentage value
 * @param {number} value - Numeric value (as decimal)
 * @returns {string} Formatted percentage string
 */
function formatPercent(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    }).format(value);
}

/**
 * Format percentage for display with sign
 * @param {number} value - Numeric value (as decimal)
 * @returns {string} Formatted percentage with sign
 */
function formatPercentWithSign(value) {
    const formatted = formatPercent(value);
    return value >= 0 ? `+${formatted}` : formatted;
}

/* ========================================
   Educational Explanations
   ======================================== */

/**
 * Generate educational explanation based on calculation results
 * @param {number} price - Calculated bond price
 * @param {number} faceValue - Face value of bond
 * @param {number} ytm - Yield to maturity
 * @param {number} couponRate - Coupon rate
 * @returns {string} Explanation text
 */
function generateExplanation(price, faceValue, ytm, couponRate) {
    let explanation = '';
    
    if (price > faceValue) {
        explanation = 'This bond is trading at a <strong>premium</strong> (above par value). This occurs when the coupon rate (' + 
                      formatPercent(couponRate) + ') is higher than the market yield (' + formatPercent(ytm) + 
                      '). Investors are willing to pay more for the higher interest payments.';
    } else if (price < faceValue) {
        explanation = 'This bond is trading at a <strong>discount</strong> (below par value). This occurs when the coupon rate (' + 
                      formatPercent(couponRate) + ') is lower than the market yield (' + formatPercent(ytm) + 
                      '). The bond must sell for less than face value to match current market rates.';
    } else {
        explanation = 'This bond is trading at <strong>par value</strong>. The coupon rate (' + formatPercent(couponRate) + 
                      ') equals the market yield (' + formatPercent(ytm) + '), resulting in a price equal to the face value.';
    }
    
    // Add relationship explanation
    explanation += '<br><br><strong>Key Relationship:</strong> Bond prices and yields move in opposite directions. When interest rates rise (yield increases), bond prices fall, and vice versa.';
    
    return explanation;
}

/* ========================================
   Display Functions
   ======================================== */

/**
 * Display calculation results in the UI
 * @param {number} bondPrice - Calculated bond price
 * @param {number} ytm - Yield to maturity
 * @param {number} faceValue - Face value
 * @param {number} couponRate - Coupon rate
 */
function displayResults(bondPrice, ytm, faceValue, couponRate) {
    // Update bond price display
    document.getElementById('bondPrice').textContent = formatCurrency(bondPrice);
    
    // Update YTM display
    document.getElementById('ytm').textContent = formatPercent(ytm);
    
    // Calculate and display price change from par
    const priceChange = ((bondPrice - faceValue) / faceValue);
    document.getElementById('priceChange').textContent = formatPercentWithSign(priceChange);
    
    // Add color coding for price change
    const priceChangeElement = document.getElementById('priceChange');
    if (priceChange > 0) {
        priceChangeElement.style.color = 'var(--success-color)';
    } else if (priceChange < 0) {
        priceChangeElement.style.color = 'var(--error-color)';
    } else {
        priceChangeElement.style.color = 'var(--text-primary)';
    }
    
    // Add educational explanation
    const explanation = generateExplanation(bondPrice, faceValue, ytm, couponRate);
    document.getElementById('explanation').innerHTML = explanation;
}

/* ========================================
   Input Validation
   ======================================== */

/**
 * Validate user inputs
 * @returns {boolean} True if valid, false otherwise
 */
function validateInputs() {
    const faceValue = parseFloat(document.getElementById('faceValue').value);
    const couponRate = parseFloat(document.getElementById('couponRate').value);
    const maturity = parseFloat(document.getElementById('maturity').value);
    const yieldValue = parseFloat(document.getElementById('yield').value);
    
    // Clear previous error
    hideError();
    
    // Check for valid numbers
    if (isNaN(faceValue) || faceValue <= 0) {
        showError('Face value must be a positive number');
        return false;
    }
    
    if (isNaN(couponRate) || couponRate < 0 || couponRate > 100) {
        showError('Coupon rate must be between 0% and 100%');
        return false;
    }
    
    if (isNaN(maturity) || maturity <= 0) {
        showError('Maturity must be greater than 0 years');
        return false;
    }
    
    if (isNaN(yieldValue) || yieldValue < 0 || yieldValue > 100) {
        showError('Yield must be between 0% and 100%');
        return false;
    }
    
    return true;
}

/* ========================================
   Error Handling
   ======================================== */

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    
    // Scroll to error message
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Hide error message
 */
function hideError() {
    document.getElementById('errorMessage').textContent = '';
}

/* ========================================
   Event Listeners & Initialization
   ======================================== */

/**
 * Initialize calculator on page load
 */
function initCalculator() {
    // Focus first input field
    document.getElementById('faceValue').focus();
    
    // Add event listener to form submission
    document.getElementById('bondForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit();
    });
    
    // Add event listener for Clear button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            clearForm();
        });
    }
    
    // Allow Enter key to submit form
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            // Check if we're in an input field
            if (e.target.type === 'number' || e.target.tagName === 'INPUT') {
                document.getElementById('bondForm').requestSubmit();
            }
        }
    });
}

/**
 * Clear form inputs and reset results
 */
function clearForm() {
    // Reset input values to defaults
    document.getElementById('faceValue').value = '1000';
    document.getElementById('couponRate').value = '5';
    document.getElementById('maturity').value = '10';
    document.getElementById('bondType').value = 'US10Y';
    document.getElementById('yield').value = '';
    
    // Hide yield input if not custom
    const yieldInputGroup = document.getElementById('yieldInputGroup');
    if (yieldInputGroup) {
        yieldInputGroup.style.display = 'none';
    }
    
    // Reset results to default values
    document.getElementById('bondPrice').textContent = '$0.00';
    document.getElementById('ytm').textContent = '0.00%';
    document.getElementById('priceChange').textContent = '0.00%';
    document.getElementById('priceChange').style.color = 'var(--text-primary)';
    document.getElementById('explanation').innerHTML = 'Enter bond parameters to see calculation results and analysis.';
    
    // Clear any error messages
    hideError();
    
    // Focus on first input
    document.getElementById('faceValue').focus();
    
    // Re-fetch live data for the selected bond
    if (typeof fetchAndDisplayLiveData === 'function') {
        fetchAndDisplayLiveData('US10Y');
    }
}

/**
 * Handle form submission
 */
function handleFormSubmit() {
    // Validate inputs
    if (!validateInputs()) {
        return;
    }
    
    // Get input values
    const faceValue = parseFloat(document.getElementById('faceValue').value);
    const couponRate = parseFloat(document.getElementById('couponRate').value) / 100;
    const maturity = parseFloat(document.getElementById('maturity').value);
    const yieldValue = parseFloat(document.getElementById('yield').value) / 100;
    
    // Calculate bond price
    const price = calculateBondPrice(faceValue, couponRate, maturity, yieldValue);
    
    // Display results
    displayResults(price, yieldValue, faceValue, couponRate);
    
    // Update chart (will be implemented in Phase 5)
    if (typeof generatePriceYieldCurve === 'function') {
        generatePriceYieldCurve(faceValue, couponRate, maturity);
    }
}

// Initialize calculator when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
} else {
    initCalculator();
}

