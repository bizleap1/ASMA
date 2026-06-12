const fs = require('fs');

const appPath = 'c:/Users/SHREYA/OneDrive/Desktop/ASMA/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

// 1. Replace courseDetails
const newCourseDetails = `const courseDetails = {
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
};`;

content = content.replace(/const courseDetails = \{[\s\S]*?\n\};\n/g, newCourseDetails + '\n');

// 2. Remove price from UI in CoursesSection
content = content.replace(
  /<div className=\{`inline-flex flex-wrap items-center gap-3 mt-2 \$\{isEven \? '' : 'md:justify-end'\}`\}>[\s\S]*?<\/div>\s*<\/div>/g,
  `<div className={\`inline-flex flex-wrap items-center gap-3 mt-2 \${isEven ? '' : 'md:justify-end'}\`}>
                    <Link
                      to={\`/course/\${encodeURIComponent(course.title)}\`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#166534] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-md w-fit"
                    >
                      Read More
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                </div>`
);

// 3. Remove price from CourseDetailsPage UI
content = content.replace(/<div className="grid grid-cols-1 sm:grid-cols-3/g, '<div className="grid grid-cols-1 sm:grid-cols-2');

content = content.replace(
  /<div className="p-2">\s*<div className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-2">Investment<\/div>\s*<div className="text-base md:text-lg font-extrabold text-\[#166534\]">\{course\.price\}<\/div>\s*<\/div>\s*<\/div>/g,
  `</div>`
);

fs.writeFileSync(appPath, content);
console.log('Update successful');
