

### utools-fund

- A custom fund assistant, with data sourced from Tiantian Fund
- Supports adding and removing custom funds; allows inputting held shares to calculate daily profits in real-time
- My Custom Funds page => ctrl + insert jumps to the Add Fund page; supports searching by Pinyin, Chinese name, or fund code
- My Custom Funds page => ctrl + delete deletes the selected fund(s)
- My Custom Funds page => Enter shares, select a fund, and press enter to save and update held shares
- My Custom Funds page => If no shares are entered, press enter to open fund details
- Fund Details => enter to close, ← → to switch navigation, ↑ ↓ to switch funds

#### Source Code

> [https://github.com/adams549659584/utools-fund](https://github.com/adams549659584/utools-fund)

#### Plugin Download

> [https://github.com/adams549659584/utools-fund/releases](https://github.com/adams549659584/utools-fund/releases)

#### Usage Instructions

![Instructions.gif](https://s1.ax1x.com/2020/08/19/dQ8R3t.gif)

### v1.7.3

- Fixed search anomalies caused by search interface adjustments
- Added action buttons to Fund Details (keyboard operations remain unchanged: enter to close, ← → to switch navigation, ↑ ↓ to switch funds)

### v1.7.2

- Added random UA to fund details requests

### v1.7.1

- Optimized handling of NaN issues for overseas funds
- Added Fund Details view (if no shares are entered, press enter to open fund details; in fund details, press enter to close, ← → to switch navigation, ↑ ↓ to switch funds)

### v1.6.2

- Added display for held shares

### v1.6.1

- Optimized today's total profit calculation results

### v1.6.0

- Added keyboard shortcuts

  > ctrl + insert to jump to Add Custom Fund

  > ctrl + delete to delete selected custom funds

- Removed the delete custom fund interface

### v1.5.1

- Today's profit confirmation no longer waits for funds with 0 holdings

### v1.5.0

- Stops querying when exiting the current plugin

### v1.4.2

- Removed platform restrictions

### v1.4.0

- Optimized data import

### v1.3.9

- My Custom Funds now supports searching/filtering with an s prefix, e.g., s001071

### v1.3.8

- Updated usage instructions gif link

### v1.3.7

- Removed usage instructions gif file to reduce package size

#### v1.3.6

- Optimized held share input to prevent accidental entries

#### v1.3.5

- Removed network failure prompts

#### v1.3.4

- Removed encoding
- Fixed import bug caused by refactoring
- Optimized deletion and My Custom Funds list display when no funds are available

#### v1.3.3

- Refactored code
- When My Custom Funds is pinned to the foreground, it fetches the latest data periodically (every minute)

#### v1.3.1

- Adjusted percentage increase calculation

#### v1.3.0

- Added ✅ icon for latest NAV confirmation

#### v1.2.0

- Added market index quotes

#### v1.1.0

- Added import/export functionality
- Simply copy the exported fund_data.json into uTools to import
