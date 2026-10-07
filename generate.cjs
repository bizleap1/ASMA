const PDFDocument = require('pdfkit');
const fs = require('fs');

// Helper to draw headers
const drawHeader = (doc, text) => {
  doc.moveDown(1.5);
  doc.fontSize(18).fillColor('#166534').text(text, { underline: true });
  doc.moveDown(0.5);
  doc.fillColor('black');
};

// Helper to draw sub-items
const drawItem = (doc, title, desc) => {
  doc.fontSize(12).font('Helvetica-Bold').text(title, { continued: true });
  doc.font('Helvetica').text(`: ${desc}`);
  doc.moveDown(0.4);
};

// ------------------------------------------------------------------
// 1. STOCK MARKET REFERENCE GUIDE
// ------------------------------------------------------------------
const doc1 = new PDFDocument({ margin: 50 });
doc1.pipe(fs.createWriteStream('public/stock-market-reference-guide.pdf'));

// Title
doc1.fontSize(32).fillColor('#064e3b').font('Helvetica-Bold').text('Ultimate Stock Market Reference Guide', { align: 'center' });
doc1.moveDown(0.5);
doc1.fontSize(14).fillColor('gray').font('Helvetica-Oblique').text('Your comprehensive and extremely detailed guide to mastering the financial markets.', { align: 'center' });
doc1.moveDown(1.5);

// Section 1
drawHeader(doc1, '1. Essential Market Terminology');
drawItem(doc1, 'Bull Market', 'A prolonged period in which investment prices rise faster than their historical average. Driven by economic recovery, low unemployment, and investor optimism.');
drawItem(doc1, 'Bear Market', 'A prolonged period in which investment prices fall, typically defined as a 20% or more drop from recent highs. Driven by fear, economic contraction, or rising inflation.');
drawItem(doc1, 'Blue Chip Stocks', 'Huge companies with an excellent reputation. They are typically large, well-established, and financially sound with a history of reliable earnings and often pay dividends.');
drawItem(doc1, 'Dividends', "A portion of a company's earnings that is paid to shareholders, typically on a quarterly basis. It's a key source of passive income for long-term investors.");
drawItem(doc1, 'Market Capitalization', 'The total dollar value of all outstanding shares, calculated by multiplying outstanding shares by current price. Categorized into Mega, Large, Mid, Small, and Micro cap.');
drawItem(doc1, 'Volatility', 'The rate at which the price of a security increases or decreases for a given set of returns. Measured by standard deviation or the VIX index. High volatility means high risk but high potential reward.');
drawItem(doc1, 'Liquidity', 'How easily you can buy or sell an asset without affecting its price. High volume stocks like Apple or Reliance have massive liquidity. Penny stocks typically have poor liquidity.');
drawItem(doc1, 'Short Selling', 'Borrowing shares from a broker and selling them in the open market, hoping to buy them back later at a lower price to return to the broker, pocketing the difference.');

// Section 2
drawHeader(doc1, '2. Types of Trading Orders & Execution');
drawItem(doc1, 'Market Order', 'An order to buy or sell a stock immediately at the best available current price. Execution is guaranteed, but the price is not.');
drawItem(doc1, 'Limit Order', 'An order to buy or sell a stock at a specific price or better. It guarantees price but not execution (if the stock never reaches your price, the order won\'t fill).');
drawItem(doc1, 'Stop-Loss Order', "An order placed with a broker to buy or sell once the stock reaches a certain price. Crucial for limiting an investor's maximum potential loss on a trade.");
drawItem(doc1, 'Stop-Limit Order', 'Combines the features of a stop order and a limit order. Once the stop price is triggered, it becomes a limit order instead of a market order.');
drawItem(doc1, 'Trailing Stop', 'A stop order that is set at a percentage or specific dollar amount away from a security\'s current market price. As the price moves favorably, the stop follows it, locking in profits.');

doc1.addPage(); // Page 2

// Section 3
drawHeader(doc1, '3. Crucial Financial Ratios & Fundamental Analysis');
drawItem(doc1, 'P/E Ratio (Price-to-Earnings)', "Market Value per Share / Earnings per Share (EPS). The most popular metric to determine if a stock is overvalued or undervalued relative to its peers.");
drawItem(doc1, 'Forward P/E', "Similar to P/E, but uses projected future earnings instead of trailing past earnings. Essential for valuing fast-growing tech companies.");
drawItem(doc1, 'PEG Ratio', "P/E Ratio / Earnings Growth Rate. A PEG ratio under 1.0 is traditionally considered a 'cheap' valuation for a growing company.");
drawItem(doc1, 'P/B Ratio (Price-to-Book)', "Market Price per Share / Book Value per Share. Compares a firm's market capitalization to its net asset value. Highly used for valuing banks and financial institutions.");
drawItem(doc1, 'Debt-to-Equity Ratio', "Total Liabilities / Shareholders' Equity. Evaluates a company's financial leverage and solvency. A very high number indicates a high risk of bankruptcy during economic downturns.");
drawItem(doc1, 'Return on Equity (ROE)', "Net Income / Shareholders' Equity. Measures financial performance and profitability. Shows how efficiently management is using shareholder cash to generate growth.");
drawItem(doc1, 'Free Cash Flow (FCF)', "Operating Cash Flow - Capital Expenditures. The actual cash a company generates after maintaining its asset base. It's what pays for dividends, buybacks, and acquisitions.");

// Section 4
drawHeader(doc1, '4. Masterclass: Candlestick Patterns');
doc1.fontSize(12).font('Helvetica-Bold').text('Bullish Reversal Patterns:', { continued: false });
doc1.moveDown(0.2);
drawItem(doc1, 'Hammer', 'Forms during a downtrend. It features a small body and a long lower wick (at least 2x the body length), showing buyers aggressively pushed prices back up from lows.');
drawItem(doc1, 'Bullish Engulfing', 'A two-candle pattern where a smaller red candle is completely engulfed by a massive green candle, signaling a powerful transfer of momentum to the buyers.');
drawItem(doc1, 'Morning Star', 'A three-candle setup: a long red candle, a small-bodied candle gapping down, and a long green candle closing past the midpoint of the first red candle.');
doc1.moveDown(0.5);
doc1.fontSize(12).font('Helvetica-Bold').text('Bearish Reversal Patterns:', { continued: false });
doc1.moveDown(0.2);
drawItem(doc1, 'Shooting Star', 'Forms in an uptrend. Features a small body and a long upper wick. Indicates buyers tried to push the price higher but sellers aggressively took control by the close.');
drawItem(doc1, 'Bearish Engulfing', 'A smaller green candle is completely overshadowed by a large red candle. A huge warning sign of an impending downtrend.');
drawItem(doc1, 'Evening Star', 'The bearish counterpart to the Morning Star. A long green candle, a small "star" gap up, followed by a severe red candle downwards.');
doc1.moveDown(0.5);
doc1.fontSize(12).font('Helvetica-Bold').text('Indecision Patterns:', { continued: false });
doc1.moveDown(0.2);
drawItem(doc1, 'Doji', 'Open and close prices are virtually identical, forming a cross. It represents extreme market indecision. A breakout from a Doji often defines the next trend.');

doc1.moveDown(3);
doc1.fontSize(10).fillColor('gray').font('Helvetica').text('Prepared exclusively for Advait Stock Academy Students', { align: 'center' });
doc1.end();

// ------------------------------------------------------------------
// 2. TECHNICAL INDICATORS GUIDE
// ------------------------------------------------------------------
const doc2 = new PDFDocument({ margin: 50 });
doc2.pipe(fs.createWriteStream('public/technical-indicators-guide.pdf'));

// Title
doc2.fontSize(32).fillColor('#064e3b').font('Helvetica-Bold').text('Mastering Technical Indicators', { align: 'center' });
doc2.moveDown(0.5);
doc2.fontSize(14).fillColor('gray').font('Helvetica-Oblique').text('Advanced mathematical tools to predict price action, confirm trends, and optimize entries.', { align: 'center' });
doc2.moveDown(1.5);

// Section 1
drawHeader(doc2, '1. Trend & Moving Average Indicators');
drawItem(doc2, 'Simple Moving Average (SMA)', 'Calculates the average price over a specific number of periods (e.g., 50-day, 200-day). Used to identify the overall, smoothed out macro trend direction. The 200-SMA is considered the "line in the sand" for bull/bear markets.');
drawItem(doc2, 'Exponential Moving Average (EMA)', 'Similar to the SMA, but places a progressively greater weight on the most recent data points. It reacts much faster to price changes, making it ideal for swing traders (e.g., 9-EMA or 21-EMA).');
drawItem(doc2, 'MACD (Moving Average Convergence Divergence)', 'A trend-following momentum indicator showing the relationship between two moving averages (usually the 12-EMA minus the 26-EMA). The MACD line crossing above the Signal line generates a powerful buy signal.');
drawItem(doc2, 'MACD Histogram', 'Plots the distance between the MACD and its signal line. When the histogram is expanding, momentum is increasing. When it shrinks, a reversal is imminent.');
drawItem(doc2, 'Parabolic SAR', 'Places dots above or below the price action to determine short-term momentum and identify potential stop and reverse points. Best used in highly trending markets.');

// Section 2
drawHeader(doc2, '2. Momentum & Oscillator Indicators');
drawItem(doc2, 'Relative Strength Index (RSI)', 'An oscillator ranging from 0 to 100. Measures the speed and change of price movements. A reading above 70 indicates a stock is overbought (prime for a pullback), while below 30 indicates it is oversold (prime for a bounce).');
drawItem(doc2, 'RSI Divergence', 'When the stock makes a higher high, but the RSI makes a lower high. This is a massive warning sign that bullish momentum is secretly fading despite rising prices.');
drawItem(doc2, 'Stochastic Oscillator', 'Compares a particular closing price to a range of its prices over a certain period. Much more sensitive than RSI. Generates overbought signals above 80 and oversold signals below 20.');
drawItem(doc2, 'Commodity Channel Index (CCI)', "Measures a security's variation from its statistical mean over time. High positive values indicate prices are unusually high compared to the average, indicating overbought conditions.");

doc2.addPage(); // Page 2

// Section 3
drawHeader(doc2, '3. Volatility Indicators');
drawItem(doc2, 'Bollinger Bands', 'Consists of a 20-SMA middle band and upper/lower bands plotted two standard deviations away. 95% of price action stays inside the bands.');
drawItem(doc2, 'Bollinger Squeeze', 'When volatility drops, the bands squeeze tightly together. This is the calm before the storm—expect a massive breakout soon. Do not trade the squeeze, trade the breakout!');
drawItem(doc2, 'Average True Range (ATR)', 'Measures absolute market volatility by decomposing the entire range of an asset price for that period. It does not indicate price direction, only the intensity of movement. Professional traders use 1.5x ATR to set their stop losses.');
drawItem(doc2, 'Keltner Channels', 'Similar to Bollinger Bands, but uses ATR to set the channel width instead of standard deviation. Generates smoother signals with fewer false breakouts.');

// Section 4
drawHeader(doc2, '4. Volume & Money Flow Indicators');
drawItem(doc2, 'Volume Weighted Average Price (VWAP)', 'The true average price a stock has traded at throughout the day, strictly based on both volume and price. It is the ultimate benchmark used by institutional algorithms. Day traders buy when price pulls back to VWAP support.');
drawItem(doc2, 'On-Balance Volume (OBV)', 'A cumulative total of buying and selling volume. If price is rising but OBV is falling, it means big money is secretly selling into the rally. A deadly bearish divergence.');
drawItem(doc2, 'Chaikin Money Flow (CMF)', 'Measures the amount of Money Flow Volume over a specific period. A CMF consistently above zero suggests heavy institutional buying pressure, while below zero suggests institutional distribution (selling).');
drawItem(doc2, 'Accumulation/Distribution Line (A/D)', 'Similar to OBV, but also factors in where the stock closes relative to its daily range. A stock closing at its high on high volume heavily spikes the A/D line.');

doc2.moveDown(3);
doc2.fontSize(10).fillColor('gray').font('Helvetica').text('Prepared exclusively for Advait Stock Academy Students', { align: 'center' });
doc2.end();

console.log('Massive Detailed PDFs generated successfully!');
