# Google Sheets Order Database & Periodic Dashboard Setup

This guide explains how to set up the multi-sheet Google Sheets system for **The Crust Culture**.

---

## 📁 Sheet Structure

When configured, your Google Sheet will contain 5 dedicated tabs:

1. **`All Records`**: The permanent master database storing every single order ever placed.
2. **`Today`**: Live real-time feed of today's orders with KPI summary banner (Total Orders, Total Revenue, Dine-In vs Takeaway).
3. **`This Week`**: Live real-time feed of the current week's orders.
4. **`This Month`**: Live real-time feed of the current month's orders.
5. **`This Year`**: Live real-time feed of the current year's orders.

---

## ⚡ How It Works

- The **`All Records`** sheet stores each incoming order row with full details (Date, ID, Name, Phone, Type, Items, Total, Notes, Security Code, Receipt Link, Raw JSON).
- The **`Today`**, **`This Week`**, **`This Month`**, and **`This Year`** sheets use Google Sheets' high-performance dynamic formulas:
  - New orders appear **instantly**.
  - Always sorted in chronological descending order (newest order at the top).
  - Automatically updates at midnight every single day without needing manual refreshes.
  - Includes a top KPI status banner calculating live order count, total revenue, and dine-in/takeaway counts.

---

## 🚀 Setup Steps (Takes ~2 Minutes)

### Step 1: Open Your Google Sheet
1. Open the Google Spreadsheet you want to use for **The Crust Culture**.
2. Click **Extensions** in the top menu bar $\to$ **Apps Script**.

### Step 2: Paste the Code
1. In the Apps Script code editor, delete any existing default code (`function myFunction() {...}`).
2. Open the [Code.gs](file:///c:/Users/Samaksh%20Rastogi/projects/The-Crust-Culture-menu-display/google-sheets-script/Code.gs) file in this repository, copy its entire contents, and paste it into the editor.
3. Click the **Save** icon (or press `Ctrl+S` / `Cmd+S`).

### Step 3: Run Initial Setup
1. In the function dropdown at the top toolbar (next to "Debug"), select **`setupSpreadsheet`**.
2. Click **Run**.
3. Google will ask for authorization on the first run:
   - Click **Review permissions**.
   - Select your Google account.
   - Click **Advanced** (small link at bottom left).
   - Click **Go to Untitled project (unsafe)**.
   - Click **Allow**.
4. The script will automatically create, style, and format all 5 sheets:
   - `All Records`
   - `Today`
   - `This Week`
   - `This Month`
   - `This Year`
5. A custom menu named **`🍕 The Crust Culture`** will appear in your Google Sheets toolbar.

### Step 4: Deploy as Webhook Web App (if not already deployed)
1. In Apps Script, click the blue **Deploy** button at top right $\to$ **Manage deployments** (or **New deployment**).
2. If updating an existing deployment:
   - Click the pencil icon (Edit).
   - Under Version, select **New version**.
   - Click **Deploy**.
3. If creating a new deployment:
   - Click **New deployment**.
   - Select type: **Web app** (gear icon).
   - Description: `Crust Culture Order Sync`
   - Execute as: **Me** (`your-email@gmail.com`)
   - Who has access: **Anyone**
   - Click **Deploy**.
4. Copy the **Web App URL** (ends in `/exec`).
5. Ensure this URL matches `GOOGLE_SHEETS_WEBHOOK_URL` in `src/utils/orderHistory.js`.

---

## 🍕 Toolbar Menu Options

Once installed, reload your Google Sheet. You will see a custom menu **`🍕 The Crust Culture`** with:
- **`⚡ Setup & Format All Sheets`**: Automatically repairs or builds all 5 sheets.
- **`🔄 Refresh All Dynamic Formulas & Metrics`**: Refreshes formulas and KPI calculation bars.
