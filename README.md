# Bond Investment Calculator

A web-based tool for analyzing bond prices, yields, and returns with real-time market data.

## Features

- **Calculate Bond Prices**: Calculate bond prices based on coupon rate, yield, and maturity
- **Yield to Maturity (YTM)**: Calculate YTM for any bond
- **Interactive Charts**: Visualize price-yield relationship with interactive charts
- **Live Market Data**: Fetch live market data for Treasury bonds (11 maturities)
- **Portfolio Management**: Build and manage a portfolio of multiple bonds
- **Portfolio Analytics**: View portfolio-wide metrics including total value and weighted average yield
- **Individual Bond Display**: See all bonds in your portfolio with detailed information
- **Portfolio Visualization**: Interactive chart showing all bonds in your portfolio

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Visualization**: Chart.js
- **API**: Finnhub (with fallback for local development)
- **Storage**: localStorage for portfolio persistence
- **Deployment**: Vercel (or any static hosting)

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A Finnhub API key (for live market data) - [Get free API key here](https://finnhub.io/register)

### Installation

1. Clone the repository or download the files
2. Get a free Finnhub API key from https://finnhub.io/register
3. Copy `.env.example` to `.env` and add your API key:
   ```
   FINNHUB_API_KEY=your_api_key_here
   ```
4. For local development without the API, you can use the "Enter Custom Yield" option
5. Open `index.html` in a web browser

**Note:** The application works locally with fallback demo data. For actual live market data, deploy to Vercel or a similar platform with serverless function support.

### Deployment

To deploy on Vercel:

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

## Development

See `DEVELOPMENT_PLAN.md` for detailed development instructions.

## License

MIT

## Disclaimer

This is an educational tool. Always consult with a financial advisor before making investment decisions.

