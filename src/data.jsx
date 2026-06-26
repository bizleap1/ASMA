import React from "react";
import { Link } from "react-router-dom";

export const serviceData = [
  {
    id: "share-market-training",
    title: "Share Market Training",
    category: "Training",
    desc: "In-depth courses on stock market investing, trading strategies, technical analysis and financial planning for beginners and advanced learners.",
    image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Our Share Market Training program is designed to equip you with the knowledge and skills needed to navigate the stock market confidently. Whether you are a beginner looking to understand the basics or an experienced trader seeking advanced strategies, this course covers everything from fundamental analysis to technical indicators and risk management.",
    benefits: ["Comprehensive Curriculum", "Live Market Sessions", "Expert Mentorship", "Practical Trading Strategies"]
  },
  {
    id: "stock-investment",
    title: "Stock Investment",
    category: "Investment",
    desc: "Unlock your wealth potential with smart stock investments - guided strategies, expert insights and confident decisions for a secure financial future.",
    image: "https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Investing in stocks is one of the most effective ways to build long-term wealth. Our stock investment advisory service provides you with expert insights, carefully researched stock picks, and portfolio management strategies tailored to your financial goals and risk tolerance.",
    benefits: ["Personalized Portfolio Advice", "In-depth Market Research", "Regular Performance Reviews", "Risk Mitigation Strategies"]
  },
  {
    id: "mutual-fund-investment",
    title: "Mutual Fund Investment",
    category: "Investment",
    desc: "Grow your wealth steadily with smart mutual fund investments - guided by experts for secure, diversified and goal-oriented financial success.",
    image: "https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Mutual funds offer a hassle-free way to invest in a diversified portfolio managed by professionals. We help you choose the right mix of equity, debt, and hybrid funds based on your financial objectives, investment horizon, and risk appetite.",
    benefits: ["Diversified Investment", "Professional Fund Management", "Goal-Based Planning", "SIP and Lump Sum Options"]
  },
  {
    id: "psychological-training",
    title: "Psychological Training",
    category: "Training",
    desc: "Unlock your trading potential with strong market psychology—master emotional control, build discipline, and make confident, rational decisions for consistent success in the stock market",
    image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Success in trading is 80% psychology and 20% strategy. Our psychological training program helps you overcome fear, greed, and emotional biases. Build the discipline and mental resilience required to execute trades confidently and consistently.",
    benefits: ["Emotional Control", "Developing Discipline", "Overcoming Biases", "Consistent Execution"]
  },
  {
    id: "derivatives-trading",
    title: "Derivatives Trading",
    category: "Training",
    desc: "Master the art of Options and Futures trading with advanced strategies and risk management techniques for high-yield returns.",
    image: "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Take your trading to the next level with our comprehensive Derivatives Trading course. Learn how to leverage options and futures to hedge your portfolio, generate consistent income, and speculate on market movements with calculated risks.",
    benefits: ["Options Strategies", "Futures Hedging", "Risk Management", "High-Yield Techniques"]
  },
  {
    id: "portfolio-management",
    title: "Portfolio Management",
    category: "Investment",
    desc: "Expert portfolio management services to diversify your assets, minimize risks, and maximize long-term wealth creation.",
    image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Our Portfolio Management Services (PMS) cater to high-net-worth individuals and institutions. We create customized, diversified portfolios tailored to your specific financial goals, risk appetite, and investment horizon to ensure sustainable growth.",
    benefits: ["Customized Portfolios", "Active Monitoring", "Risk Minimization", "Wealth Maximization"]
  },
  {
    id: "health-insurance",
    title: "Health Insurance",
    category: "Insurance",
    desc: "Protect your health with plans from top insurers, offering medical coverage, hospitalization benefits and cashless treatment facilities nationwide.",
    image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Medical emergencies can derail your financial planning. Our health insurance solutions offer comprehensive coverage against hospitalization expenses, critical illnesses, and pre/post-hospitalization care. We help you find policies with the best claim settlement ratios and extensive cashless hospital networks.",
    benefits: ["Cashless Treatment", "Comprehensive Coverage", "Critical Illness Protection", "Tax Benefits under Section 80D"]
  },
  {
    id: "term-insurance",
    title: "Term Insurance",
    category: "Insurance",
    desc: "Affordable term plans providing high life cover for a fixed period, ensuring your loved ones are financially protected in your absence.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
    fullDesc: "Secure your family's future with affordable term insurance plans. A term plan provides substantial financial protection to your dependents in case of your untimely demise, ensuring that their living standard and financial goals are not compromised.",
    benefits: ["High Life Cover at Low Premiums", "Financial Security for Dependents", "Optional Riders (Accidental/Critical)", "Tax Benefits under Section 80C"]
  },
  {
    id: "motor-insurance",
    title: "Motor Insurance",
    category: "Insurance",
    desc: "Get reliable motor insurance for bikes and cars, covering accidental damage, theft, third-party liability, and hassle-free claim processes.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800",
    fullDesc: "Protect your vehicle against accidents, theft, natural disasters, and third-party liabilities with our reliable motor insurance plans. We assist you in choosing policies that offer comprehensive coverage, cashless repairs, and hassle-free claim settlements.",
    benefits: ["Comprehensive and Third-Party Covers", "Cashless Garages Network", "No Claim Bonus (NCB) Protection", "Zero Depreciation Options"]
  },
  {
    id: "life-insurance",
    title: "Life Insurance",
    category: "Insurance",
    desc: "Lifelong protection and wealth-building investment benefits.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800",
    fullDesc: "Life insurance offers lifelong financial protection to your family along with wealth-building investment benefits. We offer a range of endowment and unit-linked plans customized for your long-term goals like children's education and retirement planning.",
    benefits: ["Lifelong Coverage", "Wealth Accumulation", "Guaranteed Returns Options", "Tax Benefits"]
  },
  {
    id: "travel-insurance",
    title: "Travel Insurance",
    category: "Insurance",
    desc: "Secure your trips against emergencies and baggage loss.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800",
    fullDesc: "Traveling abroad or domestically comes with uncertainties. Our travel insurance plans cover medical emergencies, trip cancellations, flight delays, and baggage loss, ensuring you have a worry-free journey anywhere in the world.",
    benefits: ["Emergency Medical Cover", "Trip Cancellation Protection", "Loss of Baggage/Passport", "24x7 Global Assistance"]
  },
  {
    id: "property-insurance",
    title: "Property Insurance",
    category: "Insurance",
    desc: "Safeguard properties against fire, theft, and natural disasters.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800",
    fullDesc: "Your home or commercial property is your biggest asset. Property insurance protects your building and its contents against damages caused by fire, theft, earthquakes, floods, and other unforeseen events, providing peace of mind.",
    benefits: ["Building and Content Cover", "Protection from Natural Calamities", "Burglary and Theft Protection", "Rent Loss Coverage"]
  }
];
export const courseDetails = {
  "Equity Market": {
    duration: "2 Months",
    mode: "Online Live & Offline Classroom",
    curriculum: [
      "Introduction to Indian Stock Market & Exchanges",
      "Basics of Demat, Trading Accounts & Brokers",
      "Understanding Market Structure & Order Types",
      "Fundamental Analysis: Reading Balance Sheets & P/L",
      "Analyzing Key Ratios: P/E, EPS, RoE, Debt-to-Equity",
      "Identifying Multi-bagger Stocks & Value Investing",
      "Live Market Practice & Interactive Q&A Sessions"
    ],
    benefits: ["Lifetime Mentorship Support", "Live Market Trading Practice", "Premium Telegram Community Access", "Exclusive Strategy Checklists"]
  },
  "Currency Market": {
    duration: "1 Month",
    mode: "Online Live Sessions",
    curriculum: [
      "Forex Market Basics, Pip Calculations & Leverage",
      "Major, Minor & Exotic Currency Pairs (USDINR, EURINR, GBPINR)",
      "Impact of Global Macro Economics & Central Bank Policies",
      "Technical Analysis Specific to Currency Trends",
      "Risk Mitigation & Hedging Strategies in Forex",
      "Trading the News: NFP, CPI & Interest Rate Decisions"
    ],
    benefits: ["Daily Global Macro Updates", "Pre-Session Level Planning", "1-on-1 Strategy Doubt Solving", "Live News Trading Setup"]
  },
  "Dmat Account Operation": {
    duration: "1 Week",
    mode: "Self-Paced Video Course + 1 Live Session",
    curriculum: [
      "Navigating Demat & Trading Accounts Safely",
      "Introduction to Modern Terminal Software (Kite, Groww, Upstox)",
      "Placing Orders: Market, Limit, SL, SL-M, GTT",
      "Advanced Orders: Bracket, Cover & Basket Orders",
      "Setting up Custom Alerts, Watchlists & Scanners",
      "Calculating Brokerage, Taxes (STT, GST) & DP Charges"
    ],
    benefits: ["Step-by-step Screen Recordings", "Interactive Software Checklists", "Lifetime Access to Video Guide", "Broker Selection Help"]
  },
  "Technical Analysis": {
    duration: "1.5 Months",
    mode: "Online Live & Offline Classroom",
    curriculum: [
      "Dow Theory, Market Cycles & Advanced Market Structure",
      "Trend Continuation & Trend Reversal Strategies",
      "Mastering Candlestick Patterns & Price Action",
      "Volume Profile & Delivery Volume Analysis",
      "Fibonacci Retracements, Extensions & Harmonic Patterns",
      "Setting up Custom Scanners and Watchlist Rules",
      "Multi-Timeframe Analysis for Perfect Entries"
    ],
    benefits: ["Proprietary Scanning Templates", "Access to Live Trading Room", "Weekly Strategy Review Session", "Chart Review Mentorship"]
  },
  "Mutual Fund": {
    duration: "2 Weeks",
    mode: "Online Live Sessions",
    curriculum: [
      "Understanding Mutual Funds, AMCs, & NAV",
      "Types of Funds: Equity, Debt, Hybrid & Liquid",
      "SIP vs Lumpsum: Power of Compounding",
      "Analyzing Fund Performance: Alpha, Beta, Sharpe Ratio",
      "Understanding Expense Ratios, Exit Loads & Taxation",
      "How to Build a Passive Income Portfolio"
    ],
    benefits: ["Fund Selection Checklist", "Personalized Portfolio Planners", "Tax-Saving Investment Guides", "Retirement Corpus Calculator"]
  },
  "Portfolio Managment": {
    duration: "1 Month",
    mode: "Online Live Sessions",
    curriculum: [
      "Principles of Portfolio Management & Asset Allocation",
      "Diversification Strategies across Equities, Debt, Gold & Real Estate",
      "Risk Profiling & Assessing Investor Tolerance",
      "Dynamic vs Strategic Asset Allocation",
      "Portfolio Rebalancing Techniques & Timing",
      "Managing Institutional-Grade Wealth for Long-Term Growth"
    ],
    benefits: ["Personalized Portfolio Reviews", "Long-term Wealth Building Roadmap", "Risk Assessment Tools", "Quarterly Rebalancing Alerts"]
  },
  "Financial Planning": {
    duration: "3 Weeks",
    mode: "Online Live Sessions",
    curriculum: [
      "Setting SMART Financial Goals & Budgeting Basics",
      "Building Emergency Funds & Managing Debt Effectively",
      "Life & Health Insurance: Securing Your Family's Future",
      "Tax Planning Strategies & Saving Avenues (ELSS, NPS)",
      "Calculations for Financial Freedom & Early Retirement",
      "Estate Planning & Will Creation Basics"
    ],
    benefits: ["Personalized Financial Plan Draft", "Comprehensive Insurance Audits", "Retirement Excel Planners", "1-on-1 Consultation Session"]
  },
  "Trading Techniques": {
    duration: "1 Month",
    mode: "Online Live Sessions",
    curriculum: [
      "Mastering Scalping for Quick Intraday Profits",
      "Intraday Setups: Opening Range Breakout, VWAP Reversals",
      "Swing Trading Strategies holding for Days to Weeks",
      "Positional Trades & Deep Value Investing",
      "Adapting Techniques to Bull, Bear, and Sideways Markets",
      "Identifying High-Probability Breakout Stocks"
    ],
    benefits: ["Proven Trade Setups", "Technique Manuals & Cheat Sheets", "Daily Pre-Market Analysis", "Live Execution Practice"]
  },
  "Trading Strategies": {
    duration: "1 Month",
    mode: "Online Live Sessions",
    curriculum: [
      "Introduction to Algorithmic & Systematic Trading",
      "Backtesting and Forward-Testing Rule-Based Strategies",
      "Advanced Options Spreads: Iron Condor, Butterflies, Straddles",
      "Hedging Strategies to Protect Capital in Volatile Markets",
      "Mean Reversion and Bollinger Band Trading Systems",
      "Automating Alert Rules and Semi-Algo Execution"
    ],
    benefits: ["Vetted Code Snippets for Indicators", "Historical Strategy Backtest Reports", "Access to Strategy Coding Mentor", "Custom Trading Journal"]
  },
  "Risk Management": {
    duration: "2 Weeks",
    mode: "Online Live Sessions",
    curriculum: [
      "The Math of Trading: Probabilities, Expectancy, and Edge",
      "Position Sizing Formulas: Kelly Criterion, Fixed Fractional",
      "Setting Logical Stop-Losses and Trailing Stops",
      "Managing Drawdowns and Strict Daily Loss Limits",
      "Optimizing Risk-to-Reward Ratios for Consistency",
      "Capital Preservation and Compounding Account Balance Safely"
    ],
    benefits: ["Custom Position Sizing Calculators", "Trading Journal Excel Templates", "1-on-1 Account Audit Session", "Risk Profiling Questionnaire"]
  },
  "Advanced Psychological Training": {
    duration: "2 Weeks",
    mode: "Online Live Sessions",
    curriculum: [
      "Understanding Trading Psychology & Emotional Control",
      "Identifying Cognitive Biases: Loss Aversion, Confirmation Bias",
      "Overcoming FOMO (Fear Of Missing Out) and Revenge Trading",
      "Building the Discipline to Follow Trading Rules Strictly",
      "Handling Greed during Winning Streaks & Fear during Drawdowns",
      "Mental Rehearsal, Meditation & Visualization Techniques for Traders"
    ],
    benefits: ["Daily Mental Prep Checklist", "Stress Management Techniques", "Lifetime Mindset Audits", "Trading Routine Builder"]
  }
};
export const baseCourses = [
  {
    title: "Equity Market",
    desc: "Master equity trading from scratch. Learn how to pick winning stocks with fundamental insights and pinpoint entries.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 5,999.00"
  },
  {
    title: "Currency Market",
    desc: "Understand global currency pairs and maximize returns with expert forex trading strategies tailored for the global markets.",
    image: "https://images.pexels.com/photos/259209/pexels-photo-259209.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: "₹ 4,999.00"
  },
  {
    title: "Dmat Account Operation",
    desc: "Learn to navigate demat accounts, use modern trading terminals, and place automated orders like a professional.",
    image: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 999.00"
  }
];
export const additionalCourses = [
  {
    title: "Technical Analysis",
    desc: "Master chart patterns, advanced indicators, price action, and volume analysis to perfectly time your entries and exits.",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 9,999.00"
  },
  {
    title: "Mutual Fund",
    desc: "Discover the best mutual funds, understand SIPs, and build a passive income portfolio for long-term growth.",
    image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 1,999.00"
  },
  {
    title: "Portfolio Managment",
    desc: "Learn advanced asset allocation, portfolio diversification, and dynamic rebalancing for institutional-grade wealth management.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 7,999.00"
  },
  {
    title: "Financial Planning",
    desc: "Comprehensive strategies for long-term wealth creation, goal-based investing, and smart asset allocation.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 3,999.00"
  },
  {
    title: "Trading Techniques",
    desc: "Learn diverse trading styles including scalping, day trading, swing trading, and deep value investing.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 4,999.00"
  },
  {
    title: "Trading Strategies",
    desc: "Deploy proven, back-tested algorithmic setups for intraday, swing, and positional trading to maximize ROI.",
    image: "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 3,999.00"
  },
  {
    title: "Risk Management",
    desc: "Protect your capital. Learn advanced position sizing, stop-loss formulas, and portfolio balancing techniques.",
    image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 2,999.00"
  },
  {
    title: "Advanced Psychological Training",
    desc: "Conquer FOMO and fear. Develop a winning mindset to trade with discipline and emotional stability in volatile markets.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 4,999.00"
  }
];

export const coursePackages = [
  {
    id: "starter-package",
    title: "Starter Package",
    desc: "Perfect for beginners. Includes Equity Market, Dmat Account Operation, and basic Financial Planning.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 8,999.00",
    coursesIncluded: ["Equity Market", "Dmat Account Operation", "Financial Planning"]
  },
  {
    id: "pro-trader-package",
    title: "Pro Trader Package",
    desc: "For serious traders. Includes Technical Analysis, Trading Techniques, and Risk Management.",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 14,999.00",
    coursesIncluded: ["Technical Analysis", "Trading Techniques", "Risk Management"]
  },
  {
    id: "master-investor-package",
    title: "Master Investor Package",
    desc: "The ultimate wealth-building bundle. Includes Portfolio Management, Mutual Funds, and Advanced Psychological Training.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 19,999.00",
    coursesIncluded: ["Portfolio Managment", "Mutual Fund", "Advanced Psychological Training"]
  }
];

export const FREE_NOTES = [
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
