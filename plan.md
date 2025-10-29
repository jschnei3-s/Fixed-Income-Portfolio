# Product Requirements Document
## Bond Investment Calculator



---

## 1. Executive Summary

### 1.1 Product Overview

The Bond Investment Calculator is a web-based analytical tool designed to help students and investors analyze bond prices, yields, and returns in real-time. The application integrates live market data for Treasury and corporate bonds, enabling users to visualize how interest rate changes affect bond valuations and investment portfolios.

### 1.2 Business Objectives

- **Educational Tool**: Provide students and investors with a clear, accessible platform to explore fixed-income instruments
- **Real-Time Analytics**: Enable live pricing and yield analytics using live market APIs
- **Visual Learning**: Deliver an intuitive interface for understanding duration, convexity, and price sensitivity
- **Foundation for Growth**: Create a scalable architecture for future expansion into broader investment analytics (portfolio dashboards, yield curve visualization)

## 2. Product Requirements

### 2.1 Functional Requirements

#### 2.1.1 Core Calculations
- **FR-001**: Calculate bond price based on coupon rate, yield, and maturity
- **FR-002**: Calculate yield to maturity (YTM) given bond price and coupon
- **FR-003**: Fetch real-time Treasury yields and bond market data using API integration (Finnhub or Alpha Vantage)
- **FR-004**: Display interactive charts showing bond price vs. yield relationship
- **FR-005**: Compare multiple bonds and visualize performance differences

#### 2.1.2 Input Parameters
- **FR-006**: Face value (par) – numeric input with validation
- **FR-007**: Coupon rate – percentage input (0-100%)
- **FR-008**: Years to maturity – numeric input with validation
- **FR-009**: Market yield (YTM) – percentage input
- **FR-010**: API symbol or bond type selector (e.g., "US10Y", "US30Y", or custom CUSIP)

#### 2.1.3 Output Display
- **FR-011**: Bond price displayed in USD with currency formatting
- **FR-012**: Yield-to-maturity calculated and displayed (if price entered)
- **FR-013**: Interactive graph showing price-yield curve with tooltips
- **FR-014**: Live market yield and price updates from API
- **FR-015**: Educational explanations of results and metrics

### 2.2 Non-Functional Requirements

#### 2.2.1 Technical Requirements
- **NFR-001**: Built with HTML5, CSS3, and vanilla JavaScript (ES6+)
- **NFR-002**: API integration handled securely through proxy function (serverless, e.g., Vercel API route)
- **NFR-003**: Cross-browser compatibility (Chrome, Safari, Edge, Firefox)
- **NFR-004**: API keys stored as environment variables (never exposed client-side)
- **NFR-005**: No frameworks or build tools (no React, Bootstrap, Webpack, etc.)

#### 2.2.2 Performance Requirements
- **NFR-006**: API response and chart rendering < 1 second
- **NFR-007**: Calculation latency < 100 ms
- **NFR-008**: Page load time < 2 seconds
- **NFR-009**: Smooth 60 FPS animations for chart interactions

#### 2.2.3 Usability Requirements
- **NFR-010**: Intuitive, modern, and minimal UI following financial design best practices
- **NFR-011**: Responsive design optimized for desktop and mobile devices
- **NFR-012**: Simple explanations for each metric with educational tooltips
- **NFR-013**: Accessible design (WCAG 2.1 AA compliance - keyboard navigation, proper contrast ratios)

## 3. Technical Specifications

### 3.1 Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **API Integration** | Finnhub API or Alpha Vantage (live market & Treasury data) |
| **Deployment** | Vercel (automatic HTTPS, API proxy support) |
| **Visualization** | Chart.js (optional) or vanilla Canvas API |
| **Calculations** | No external libraries (built-in JavaScript Math functions) |

### 3.2 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

### 3.3 Mathematical Formulas

#### Bond Price Formula

```
Price = Σ [Coupon / (1 + y/m)^(t*m)] + [Face Value / (1 + y/m)^(n*m)]
```

**Where:**
- `y` = yield per period
- `m` = coupon frequency (2 for semiannual)
- `t` = time period
- `n` = years to maturity

#### Yield to Maturity (YTM) Approximation

```
YTM ≈ [Coupon + (Face - Price)/n] / [(Face + Price)/2]
```

## 4. User Experience Requirements

### 4.1 Design Principles

- **Professional Aesthetic**: Clean, educational layout with finance-inspired color palette (navy blue, white, gold accents)
- **Visual Hierarchy**: Clear separation between inputs, calculated results, and live market data
- **Interactive Feedback**: Real-time chart updates with sliders and user inputs
- **Educational Focus**: Explanatory text and tooltips throughout the interface

### 4.2 User Interface Elements

1. **Input Form**: Parameter inputs for bond calculations
   - Face value input
   - Coupon rate slider/input
   - Maturity date picker
   - Yield input

2. **Market Data Selector**: Dropdown for selecting real-time Treasury or corporate bonds
   - Pre-populated with common benchmarks (US10Y, US30Y, etc.)
   - Custom CUSIP entry option

3. **Results Panel**: Output card displaying calculated metrics
   - Bond price
   - Yield to maturity
   - Percentage change from par

4. **Visualization Area**: Interactive chart displaying price vs. yield curve
   - Zoom and pan capabilities
   - Data point hover interactions

5. **Educational Overlays**: Tooltips and explanations for financial terms

### 4.3 Accessibility Requirements

- **Semantic HTML**: Proper use of semantic tags (`<header>`, `<main>`, `<section>`, `<article>`)
- **Form Labels**: All inputs properly labeled with associated `<label>` tags
- **Keyboard Navigation**: Full keyboard accessibility with visible focus states
- **Screen Reader Support**: ARIA labels and roles for interactive elements
- **Color Contrast**: WCAG AA compliance (minimum 4.5:1 for normal text)
- **Responsive Text**: Scalable text that remains readable at all viewport sizes

## 5. Implementation Phases

### 5.1 Phase 1: HTML Structure & Foundation

**Objective**: Build the basic semantic HTML layout and input/output forms.

**Deliverables**:
- Form structure for coupon, yield, maturity, and API selection
- Placeholder result areas and chart container
- Semantic HTML5 structure with proper document outline
- Basic meta tags for SEO and mobile optimization

**Acceptance Criteria**:
- All inputs properly labeled with accessibility attributes
- Layout renders cleanly on all target browsers
- HTML validates without errors (W3C validator)
- Responsive grid structure in place

---

### 5.2 Phase 2: CSS Styling & Design

**Objective**: Apply professional financial UI design with responsive layout.

**Deliverables**:
- Responsive grid/flexbox layout system
- Consistent color scheme, typography, and spacing
- Interactive states (hover, focus, active, disabled)
- Smooth transitions and animations
- Chart styling and data visualization aesthetics
- Mobile-first responsive breakpoints

**Acceptance Criteria**:
- Modern, intuitive design consistent with financial industry standards
- Seamless experience across desktop and mobile devices
- Color contrast meets WCAG AA standards
- All interactive elements have clear visual feedback

---

### 5.3 Phase 3: JavaScript Functionality & API Integration

**Objective**: Implement calculation logic, API integration, and interactive visualizations.

**Deliverables**:
- JavaScript functions for bond pricing and YTM calculations
- Live API fetch for Treasury data (via Vercel proxy serverless function)
- Interactive chart visualization (price vs. yield curve)
- Input validation and comprehensive error handling
- Real-time calculation updates on input changes
- Loading states and error messages

**Acceptance Criteria**:
- Accurate calculations verified against financial industry benchmarks
- Live data fetch and display without client-side errors
- Real-time updates triggered by user interactions
- Proper error handling for API failures and invalid inputs
- No exposed API keys in client-side code

## 6. Success Metrics

### 6.1 Technical Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| API fetch response time | < 1 second | Browser DevTools Network tab |
| JavaScript console errors | Zero errors | Browser DevTools Console |
| Calculation accuracy | Within 0.1% of financial standards | Comparison with Bloomberg/Excel |
| Chart interaction lag | < 50 ms | Performance monitoring |
| Page load time | < 2 seconds | Lighthouse audit |
| Cross-browser compatibility | 100% on target browsers | Manual testing matrix |

### 6.2 User Experience Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Task completion time | < 10 seconds | User testing sessions |
| User satisfaction | 90% "intuitive" rating | Post-interaction surveys |
| Mobile usability | Responsive and readable | Mobile device testing |
| Accessibility score | WCAG 2.1 AA compliant | axe DevTools audit |
| Error recovery | Users can correct inputs independently | Usability testing observations |

## 7. Constraints and Limitations

### 7.1 Technical Constraints

- **No Frameworks**: Pure vanilla JavaScript, HTML, and CSS (no React, Vue, Angular, etc.)
- **No Build Tools**: No Webpack, Vite, or other bundlers
- **No Backend Database**: Single-page application with no persistent storage
- **API Security**: API keys must be secured via proxy (serverless function on Vercel)
- **Rate Limits**: Subject to free-tier API rate limits (Finnhub/Alpha Vantage)
- **Network Dependency**: Requires active internet connection for live market data

### 7.2 Scope Limitations

- **Single-Page Application**: No multi-page navigation or routing
- **Live Data Dependency**: Limited to available API feeds (no historical data caching)
- **No User Accounts**: No authentication, user profiles, or data persistence
- **No Portfolio Management**: Cannot save, track, or manage multiple bond portfolios
- **Calculation Scope**: Limited to basic bond pricing and YTM (no advanced fixed-income analytics)

## 8. Future Considerations

### 8.1 Potential Enhancements

#### Short-Term (Version 1.1-1.5)
- **Yield Curve Visualization**: 2Y, 10Y, 30Y Treasury spreads with interactive curve
- **Duration & Convexity**: Advanced fixed-income risk metrics with interactive charts
- **Bond Comparison Tool**: Side-by-side comparison of municipal vs. corporate bonds
- **Export Functionality**: Download calculations as CSV or PDF reports
- **Historical Analysis**: Add historical yield data and trend visualizations

#### Long-Term (Version 2.0+)
- **Portfolio Simulator**: Aggregate bond and equity return calculations
- **User Accounts**: Persistent storage for saved calculations and portfolios
- **Additional Asset Classes**: Expand to stocks, options, and derivatives
- **Monte Carlo Simulation**: Advanced probabilistic modeling for portfolio risk
- **Real-Time Alerts**: Notifications for bond price movements and yield changes

### 8.2 Scalability Considerations

#### Code Architecture
- **Modular Design**: Functional JavaScript modules for easy extension
- **Separation of Concerns**: Clear division between UI, calculations, and API integration
- **Documentation**: Comprehensive inline comments and external documentation

#### API Integration
- **Multiple Data Sources**: Support for Finnhub, Alpha Vantage, or custom endpoints
- **Fallback Mechanisms**: Graceful degradation when APIs are unavailable
- **Caching Strategy**: Browser-side caching for frequently accessed data

#### Performance Optimization
- **Lazy Loading**: Load visualization libraries only when needed
- **Debounced Inputs**: Optimize real-time calculation triggers
- **Progressive Enhancement**: Core functionality works without JavaScript

---

## 9. Appendices

### 9.1 Glossary

| Term | Definition |
|------|------------|
| **Bond Price** | The present value of all future cash flows from the bond |
| **Yield to Maturity (YTM)** | The total return anticipated on a bond if held until maturity |
| **Duration** | A measure of a bond's price sensitivity to interest rate changes |
| **Convexity** | A measure of the curvature of the price-yield relationship |
| **Par Value** | The face value of the bond at maturity |
| **Coupon Rate** | The annual interest rate paid on the bond |

### 9.2 References

- Finnhub API Documentation: https://finnhub.io/docs/api
- Alpha Vantage API Documentation: https://www.alphavantage.co/documentation/
- W3C Web Accessibility Initiative: https://www.w3.org/WAI/WCAG21/quickref/
- Bond Mathematics Fundamentals: Industry standard formulas and conventions

---

