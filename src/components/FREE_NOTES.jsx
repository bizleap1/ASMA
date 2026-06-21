import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { blogPosts } from '../blogData';
import shubhangiImg from '../assets/shubhangi.png';
import krishnaImg from '../assets/krishna.png';
import vrushaliImg from '../assets/vrushali.png';
import { serviceData, courseDetails, baseCourses, additionalCourses, FREE_NOTES } from '../data';

const FREE_NOTES = [
  {
    id: 1,
    title: "Stock Market Reference Guide",
    summary: "Quick reference guide for common trading terms, candlestick patterns, and formulas.",
    actionUrl: "/stock-market-reference-guide.pdf"
  },
  {
    id: 2,
    title: "Technical Indicators Guide",
    summary: "Detailed notes explaining RSI, MACD, Bollinger Bands and how to use them effectively.",
    actionUrl: "/technical-indicators-guide.pdf"
  },
  {
    id: 3,
    title: "Options Trading Basics",
    summary: "Understand Calls, Puts, Strike Prices, the Greeks, and vertical spreads in this essential introduction.",
    content: (
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">What is an Option?</h4>
          <p>An option is a derivative contract that gives the buyer the right, but not the obligation, to buy or sell an underlying asset at a specific price (strike price) on or before a certain date (expiration date). Options allow traders to control 100 shares of stock for a fraction of the price, providing massive leverage.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Types of Options</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">Call Option:</strong> Gives the buyer the right to BUY the underlying asset at the strike price. You buy a call if you are Bullish (expect the price to go UP).</li>
            <li><strong className="text-text-primary">Put Option:</strong> Gives the buyer the right to SELL the underlying asset at the strike price. You buy a put if you are Bearish (expect the price to go DOWN).</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Moneyness (ITM, OTM, ATM)</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">In the Money (ITM):</strong> A call option where the strike price is below the current market price, or a put option where the strike is above the market price. Has intrinsic value and is safer to trade.</li>
            <li><strong className="text-text-primary">Out of the Money (OTM):</strong> A call option where the strike price is above the market price, or a put where the strike is below the market price. Cheaper, but highly risky as they expire worthless if the price doesn't move.</li>
            <li><strong className="text-text-primary">At the Money (ATM):</strong> When the strike price equals the current market price of the underlying asset. Highest extrinsic value.</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">The Options "Greeks"</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">Delta:</strong> Measures the expected change in an option's price for a $1 change in the underlying asset's price. A delta of 0.50 means the option goes up $0.50 for every $1 the stock moves.</li>
            <li><strong className="text-text-primary">Theta:</strong> Measures the rate of time decay. Options lose value every day they get closer to expiration. Theta is the enemy of the option buyer, and the best friend of the option seller.</li>
            <li><strong className="text-text-primary">Vega:</strong> Measures sensitivity to implied volatility (IV). High IV drastically increases option premiums. Never buy options when IV is at historic highs!</li>
            <li><strong className="text-text-primary">Gamma:</strong> The rate of change of Delta. Highest for At-the-Money options close to expiration (Gamma Risk).</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Advanced Option Strategies</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">Covered Call:</strong> Holding 100 shares of the underlying stock and selling 1 call option against it to generate premium income.</li>
            <li><strong className="text-text-primary">Protective Put:</strong> Holding the underlying stock and buying a put option as "insurance" against a market crash.</li>
            <li><strong className="text-text-primary">Bull Call Spread:</strong> Buying a lower strike call and selling a higher strike call. Limits potential profit but massively reduces the cost of the trade and protects against Theta decay.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Risk Management Strategies",
    summary: "Learn how to protect your capital, calculate position sizing, and survive drawdown periods.",
    content: (
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">The Golden 1% Rule</h4>
          <p>Never risk more than 1% of your total account capital on a single trade. If you have a ₹1,00,000 account, your maximum acceptable loss (if your stop-loss hits) should be ₹1,000. Professional traders understand that survival is more important than massive gains. The 1% rule ensures you can survive a losing streak of 10-20 trades without destroying your portfolio.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Risk/Reward Ratio (R:R)</h4>
          <p>Always aim for a risk-to-reward ratio of at least 1:2. If you are risking ₹1,000 (your stop loss distance), your target profit should be at least ₹2,000. With a 1:2 R:R, you only need to win 33% of your trades to break even! If you take 10 trades, lose 6 (lose ₹6000), and win 4 (make ₹8000), you are still net profitable.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Position Sizing Formula</h4>
          <p className="p-4 bg-bg-secondary/30 rounded-lg text-sm border border-gray-100 font-mono text-text-primary mb-3">Position Size = (Total Account Value * Risk %) / (Entry Price - Stop Loss Price)</p>
          <div className="bg-gray-50 border-l-4 border-accent-primary p-3 rounded text-sm text-text-primary">
            <strong>Example Calculation:</strong><br/>
            Account = ₹1,00,000. Risk = 1% (₹1000).<br/>
            Entry Price = ₹500. Stop Loss = ₹480. (Risk per share = ₹20)<br/>
            Position Size = 1000 / 20 = <strong>50 Shares.</strong>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Drawdowns & The Rule of Ruin</h4>
          <p>A drawdown is the peak-to-trough decline during a specific record period of an investment. If you lose 50% of your account, you do not need 50% to recover—you need <strong>100%</strong> just to get back to breakeven! This is why cutting losses early is the most critical skill in trading.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Scaling In and Out</h4>
          <p>You don't have to enter or exit a trade all at once. Professional traders use scaling to manage risk.<br/><strong>Scaling In:</strong> Buying 50% of your position at support, and the other 50% once the trend is confirmed.<br/><strong>Scaling Out:</strong> Selling half your position at your first profit target, moving your stop-loss to breakeven, and letting the rest "run" risk-free.</p>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Psychology of Trading",
    summary: "Master your mind, control your emotions, and develop the discipline of a consistently profitable trader.",
    content: (
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">The Role of Emotions</h4>
          <p>Trading is 20% strategy and 80% psychology. The two biggest emotions that destroy trading accounts are Fear and Greed. Fear makes you sell at the absolute bottom, and Greed makes you buy at the absolute top. Learning to execute your trading plan flawlessly regardless of how you feel is the ultimate goal.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Common Psychological Pitfalls</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">Overtrading:</strong> Taking sub-optimal trades out of boredom or a desire to "make money quickly". The best trades jump off the screen at you. If you have to squint to see the setup, don't take it.</li>
            <li><strong className="text-text-primary">Moving Stop Losses:</strong> Refusing to accept a loss and moving your stop loss further away, turning a small manageable loss into an account-destroying disaster. Accept that losses are a business expense.</li>
            <li><strong className="text-text-primary">Revenge Trading:</strong> Trying to immediately win back money after a loss by doubling your position size. If you hit your daily loss limit, close the laptop and walk away.</li>
            <li><strong className="text-text-primary">FOMO (Fear Of Missing Out):</strong> Jumping into a trade late because it's already rocketing up. By the time it's obvious to everyone, you are providing exit liquidity for the smart money.</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Developing Discipline</h4>
          <p>Treat trading like a business, not a casino. Keep a detailed trading journal that logs not just entries and exits, but your emotional state during the trade. Review your mistakes every weekend, and never, ever enter a trade without a predefined entry, stop loss, and take profit level.</p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Swing Trading Blueprint",
    summary: "A complete step-by-step framework for capturing multi-day and multi-week market trends.",
    content: (
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">What is Swing Trading?</h4>
          <p>Unlike day trading (holding trades for minutes/hours), swing trading involves holding positions for several days to a few weeks to capture larger macro market moves. It requires significantly less screen time, eliminates intraday noise, and is the ideal strategy for those balancing trading with a full-time job.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Top-Down Analysis Framework</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">1. Broad Market Trend:</strong> Check the NIFTY/SENSEX (or SPY/QQQ) on the daily/weekly chart. 75% of stocks follow the broad market. Trade WITH the overall market trend, never against it.</li>
            <li><strong className="text-text-primary">2. Sector Strength:</strong> Identify which sectors (e.g., IT, Banking, Auto, Pharma) are currently outperforming the broader market. Money rotates from sector to sector.</li>
            <li><strong className="text-text-primary">3. Stock Selection:</strong> Pick the strongest 1-2 stocks within those outperforming sectors. You want the market leaders, not the laggards.</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">The Moving Average Pullback Strategy</h4>
          <p>The most reliable swing trading setup. Stocks don't go up in a straight line; they breathe in and out. Wait for a strong stock in a confirmed uptrend to "breathe out" (pull back) to a key moving average (like the 20 EMA or 50 SMA) or a previous resistance-turned-support level on light volume.</p>
          <p className="mt-2">Look for a bullish reversal candlestick pattern (like a Hammer or Bullish Engulfing) at this support level as your entry trigger. Set your stop loss just below the swing low, and target the recent swing high for take-profit.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">The Breakout Strategy</h4>
          <p>Identify a stock that has been consolidating sideways in a tight range or forming a pattern like a Cup and Handle or Bull Flag. Enter the trade when the price aggressively breaks above the resistance line on higher-than-average volume. The volume confirms that institutional buyers are participating in the breakout.</p>
        </div>
      </div>
    )
  }
];

export default FREE_NOTES;