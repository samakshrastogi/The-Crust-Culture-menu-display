/**
 * ==============================================================================
 * THE CRUST CULTURE - GOOGLE SHEETS LIVE ORDER DATABASE & PERIODIC DASHBOARD
 * ==============================================================================
 * 
 * FEATURES:
 * 1. "All Records" Sheet: Permanent master database of all customer orders.
 * 2. "Today" Sheet: Live real-time feed of today's orders with KPI summary banner.
 * 3. "This Week" Sheet: Live real-time feed of current week's orders with KPI summary banner.
 * 4. "This Month" Sheet: Live real-time feed of current month's orders with KPI summary banner.
 * 5. "This Year" Sheet: Live real-time feed of current year's orders with KPI summary banner.
 * 6. doPost(e): Webhook receiver for new orders from the web application.
 * 7. doGet(e): Cloud sync API returning all orders to the Admin dashboard.
 * 8. Custom Menu: "🍕 The Crust Culture" in Google Sheets toolbar for one-click setup & refresh.
 * 
 * SETUP INSTRUCTIONS:
 * 1. In your Google Sheet, click Extensions > Apps Script.
 * 2. Delete any default code and paste this entire file.
 * 3. Click Save (Ctrl+S or Cmd+S).
 * 4. In the function dropdown, select "setupSpreadsheet" and click "Run".
 * 5. Grant necessary permissions (Review permissions > Advanced > Go to Untitled project).
 * 6. Click "Deploy" > "New deployment" > Select type: "Web app".
 *    - Description: "Crust Culture Order Sync"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 7. Click Deploy, copy the Web App URL, and paste it in src/utils/orderHistory.js as GOOGLE_SHEETS_WEBHOOK_URL.
 * ==============================================================================
 */

// Configuration
const CONFIG = {
  TIMEZONE: 'Asia/Kolkata',
  BRAND_NAME: 'The Crust Culture',
  SHEETS: {
    ALL: 'All Records',
    TODAY: 'Today',
    WEEK: 'This Week',
    MONTH: 'This Month',
    YEAR: 'This Year'
  },
  COLORS: {
    HEADER_BG: '#1c1917',     // Dark warm stone
    HEADER_TEXT: '#ffffff',
    ACCENT_ORANGE: '#ea580c',  // Brand orange
    ACCENT_GOLD: '#f59e0b',    // Brand gold
    CARD_BG: '#f8fafc',        // Light card surface
    BORDER: '#e2e8f0'
  }
};

/**
 * Triggered automatically when the spreadsheet is opened.
 * Adds the Crust Culture control menu to the toolbar.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🍕 The Crust Culture')
    .addItem('⚡ Setup & Format All Sheets (All, Today, Week, Month, Year)', 'setupSpreadsheet')
    .addItem('🔄 Refresh All Dynamic Formulas & Metrics', 'refreshFormulas')
    .addSeparator()
    .addItem('📊 Recalculate Dashboard Stats', 'refreshFormulas')
    .addToUi();
}

/**
 * One-click setup function to create and configure all 5 sheets.
 */
function setupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup Master "All Records" Sheet
  setupAllRecordsSheet(ss);
  
  // 2. Setup Periodic Live Sheets
  setupPeriodicSheet(ss, CONFIG.SHEETS.TODAY, 'TODAY', 'Orders Placed Today');
  setupPeriodicSheet(ss, CONFIG.SHEETS.WEEK, 'WEEK', 'Orders Placed This Week');
  setupPeriodicSheet(ss, CONFIG.SHEETS.MONTH, 'MONTH', 'Orders Placed This Month');
  setupPeriodicSheet(ss, CONFIG.SHEETS.YEAR, 'YEAR', 'Orders Placed This Year');
  
  SpreadsheetApp.flush();
  try {
    SpreadsheetApp.getUi().alert('✅ Setup Complete! All 5 sheets ("All Records", "Today", "This Week", "This Month", "This Year") are ready and active.');
  } catch (e) {
    Logger.log('Spreadsheet configured successfully via script.');
  }
}

/**
 * Configure the master "All Records" sheet
 */
function setupAllRecordsSheet(ss) {
  let sheet = ss.getSheetByName(CONFIG.SHEETS.ALL);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEETS.ALL, 0);
  }
  
  // Master Headers
  const headers = [
    'Date & Time',
    'Order ID',
    'Customer Name',
    'Phone Number',
    'Order Type',
    'Items Ordered',
    'Total (₹)',
    'Cooking / Packaging Notes',
    'Security Code',
    'Receipt Link',
    'Raw JSON'
  ];
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground(CONFIG.COLORS.HEADER_BG);
  headerRange.setFontColor(CONFIG.COLORS.HEADER_TEXT);
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment('center');
  
  sheet.setRowHeight(1, 35);
  sheet.setFrozenRows(1);
  
  // Column Widths
  sheet.setColumnWidth(1, 160); // Date
  sheet.setColumnWidth(2, 120); // Order ID
  sheet.setColumnWidth(3, 140); // Customer Name
  sheet.setColumnWidth(4, 120); // Phone
  sheet.setColumnWidth(5, 110); // Type
  sheet.setColumnWidth(6, 320); // Items
  sheet.setColumnWidth(7, 100); // Total
  sheet.setColumnWidth(8, 200); // Notes
  sheet.setColumnWidth(9, 130); // Security Code
  sheet.setColumnWidth(10, 200); // Receipt Link
  sheet.setColumnWidth(11, 80);  // Raw JSON
  
  // Formats
  sheet.getRange('A2:A').setNumberFormat('yyyy-MM-dd HH:mm:ss');
  sheet.getRange('G2:G').setNumberFormat('₹#,##0.00');
  sheet.getRange('D2:D').setNumberFormat('@'); // Text format for phone
  sheet.hideColumns(11); // Hide raw JSON column from visual view
}

/**
 * Setup a dynamic periodic sheet (Today, This Week, This Month, This Year)
 * Uses high-performance Google Sheets live formulas so the data refreshes in real-time.
 */
function setupPeriodicSheet(ss, sheetName, periodType, bannerTitle) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  sheet.clear();
  
  // Row 1: KPI Summary Cards Banner
  sheet.getRange('A1:B1').merge().setValue('📊 ' + bannerTitle.toUpperCase())
    .setFontWeight('bold').setFontSize(11).setBackground('#ffedd5').setFontColor('#9a3412');
  
  sheet.getRange('C1').setValue('Orders:').setFontWeight('bold').setFontSize(9).setFontColor('#78716c');
  sheet.getRange('D1').setFormula('=IFERROR(COUNTA(B4:B), 0)').setFontWeight('bold').setFontSize(11).setFontColor('#ea580c');
  
  sheet.getRange('E1').setValue('Revenue:').setFontWeight('bold').setFontSize(9).setFontColor('#78716c');
  sheet.getRange('F1').setFormula('=IFERROR(SUM(G4:G), 0)').setFontWeight('bold').setFontSize(11).setFontColor('#16a34a').setNumberFormat('₹#,##0.00');
  
  sheet.getRange('G1').setValue('Dine-In:').setFontWeight('bold').setFontSize(9).setFontColor('#78716c');
  sheet.getRange('H1').setFormula('=IFERROR(COUNTIF(E4:E, "*Dine*"), 0)').setFontWeight('bold').setFontSize(10);
  
  sheet.getRange('I1').setValue('Takeaway:').setFontWeight('bold').setFontSize(9).setFontColor('#78716c');
  sheet.getRange('J1').setFormula('=IFERROR(COUNTIF(E4:E, "*Takeaway*"), 0)').setFontWeight('bold').setFontSize(10);
  
  sheet.getRange('A1:J1').setBackground('#f8fafc');
  sheet.setRowHeight(1, 32);
  sheet.setRowHeight(2, 8); // Spacer row
  
  // Row 3: Column Headers
  const headers = [
    'Date & Time',
    'Order ID',
    'Customer Name',
    'Phone Number',
    'Order Type',
    'Items Ordered',
    'Total (₹)',
    'Cooking / Packaging Notes',
    'Security Code',
    'Receipt Link'
  ];
  
  const headerRange = sheet.getRange(3, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground(CONFIG.COLORS.HEADER_BG);
  headerRange.setFontColor(CONFIG.COLORS.HEADER_TEXT);
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment('center');
  sheet.setRowHeight(3, 30);
  sheet.setFrozenRows(3);
  
  // Row 4: Dynamic Live Filter Formula
  const masterSheet = CONFIG.SHEETS.ALL;
  let formula = '';
  
  if (periodType === 'TODAY') {
    formula = '=IFERROR(SORT(FILTER(\'' + masterSheet + '\'!A2:J, (INT(\'' + masterSheet + '\'!A2:A) = TODAY()) * (\'' + masterSheet + '\'!A2:A <> "")), 1, FALSE), "No orders placed today yet")';
  } else if (periodType === 'WEEK') {
    formula = '=IFERROR(SORT(FILTER(\'' + masterSheet + '\'!A2:J, (WEEKNUM(\'' + masterSheet + '\'!A2:A, 2) = WEEKNUM(TODAY(), 2)) * (YEAR(\'' + masterSheet + '\'!A2:A) = YEAR(TODAY())) * (\'' + masterSheet + '\'!A2:A <> "")), 1, FALSE), "No orders placed this week yet")';
  } else if (periodType === 'MONTH') {
    formula = '=IFERROR(SORT(FILTER(\'' + masterSheet + '\'!A2:J, (MONTH(\'' + masterSheet + '\'!A2:A) = MONTH(TODAY())) * (YEAR(\'' + masterSheet + '\'!A2:A) = YEAR(TODAY())) * (\'' + masterSheet + '\'!A2:A <> "")), 1, FALSE), "No orders placed this month yet")';
  } else if (periodType === 'YEAR') {
    formula = '=IFERROR(SORT(FILTER(\'' + masterSheet + '\'!A2:J, (YEAR(\'' + masterSheet + '\'!A2:A) = YEAR(TODAY())) * (\'' + masterSheet + '\'!A2:A <> "")), 1, FALSE), "No orders placed this year yet")';
  }
  
  sheet.getRange('A4').setFormula(formula);
  
  // Format columns
  sheet.setColumnWidth(1, 160); // Date
  sheet.setColumnWidth(2, 120); // Order ID
  sheet.setColumnWidth(3, 140); // Customer Name
  sheet.setColumnWidth(4, 120); // Phone
  sheet.setColumnWidth(5, 110); // Type
  sheet.setColumnWidth(6, 320); // Items
  sheet.setColumnWidth(7, 100); // Total
  sheet.setColumnWidth(8, 200); // Notes
  sheet.setColumnWidth(9, 130); // Security Code
  sheet.setColumnWidth(10, 200); // Receipt Link
  
  sheet.getRange('A4:A').setNumberFormat('yyyy-MM-dd HH:mm:ss');
  sheet.getRange('G4:G').setNumberFormat('₹#,##0.00');
  sheet.getRange('D4:D').setNumberFormat('@');
}

/**
 * Re-applies the live formulas to ensure they are synchronized.
 */
function refreshFormulas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupPeriodicSheet(ss, CONFIG.SHEETS.TODAY, 'TODAY', 'Orders Placed Today');
  setupPeriodicSheet(ss, CONFIG.SHEETS.WEEK, 'WEEK', 'Orders Placed This Week');
  setupPeriodicSheet(ss, CONFIG.SHEETS.MONTH, 'MONTH', 'Orders Placed This Month');
  setupPeriodicSheet(ss, CONFIG.SHEETS.YEAR, 'YEAR', 'Orders Placed This Year');
  SpreadsheetApp.flush();
  try {
    SpreadsheetApp.getUi().alert('🔄 Dynamic formulas successfully refreshed across Today, Week, Month, and Year sheets!');
  } catch (e) {}
}

/**
 * Webhook POST handler: Called by the React application when an order is placed.
 */
function doPost(e) {
  try {
    const contents = e.postData ? e.postData.contents : null;
    if (!contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'No payload received' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const order = JSON.parse(contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Ensure all sheets are prepared
    let allSheet = ss.getSheetByName(CONFIG.SHEETS.ALL);
    if (!allSheet) {
      setupSpreadsheet();
      allSheet = ss.getSheetByName(CONFIG.SHEETS.ALL);
    }
    
    const orderId = order.id || order.orderId;
    if (!orderId) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Missing orderId' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const timestamp = order.timestamp ? new Date(order.timestamp) : new Date();
    
    // Format items list into a readable summary string
    const itemsSummary = (order.items || []).map(function(item) {
      const sizeStr = item.size ? ' (' + item.size + ')' : '';
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      return (item.name || 'Item') + sizeStr + ' x' + qty + ' [₹' + (price * qty) + ']';
    }).join('; ');
    
    const rowData = [
      timestamp,
      orderId,
      order.customerName || 'Guest',
      order.customerPhone ? "'" + order.customerPhone : '',
      order.orderType === 'dine-in' ? '🍽️ Dine-In' : '🛍️ Takeaway',
      itemsSummary,
      Number(order.total) || 0,
      order.notes || order.cookingInstructions || '',
      order.securityCode || '',
      order.receiptUrl || '',
      JSON.stringify(order)
    ];
    
    // Check if the order already exists to avoid duplicates
    const lastRow = allSheet.getLastRow();
    let existingRow = -1;
    if (lastRow >= 2) {
      const idRange = allSheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (let r = 0; r < idRange.length; r++) {
        if (idRange[r][0] === orderId) {
          existingRow = r + 2;
          break;
        }
      }
    }
    
    if (existingRow > -1) {
      allSheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    } else {
      allSheet.appendRow(rowData);
      const newRow = allSheet.getLastRow();
      allSheet.getRange(newRow, 1).setNumberFormat('yyyy-MM-dd HH:mm:ss');
      allSheet.getRange(newRow, 7).setNumberFormat('₹#,##0.00');
    }
    
    SpreadsheetApp.flush();
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, orderId: orderId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Webhook GET handler: Returns all stored orders to the React Admin Dashboard.
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const allSheet = ss.getSheetByName(CONFIG.SHEETS.ALL);
    
    if (!allSheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: true, orders: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRow = allSheet.getLastRow();
    if (lastRow < 2) {
      return ContentService.createTextOutput(JSON.stringify({ success: true, orders: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Read data from row 2 downwards
    const dataRange = allSheet.getRange(2, 1, lastRow - 1, 11).getValues();
    const orders = [];
    
    for (let i = 0; i < dataRange.length; i++) {
      const row = dataRange[i];
      const orderId = String(row[1] || '').trim();
      // Skip empty or deleted rows in the sheet
      if (!orderId) continue;
      
      let baseOrder = {};
      const rawJson = row[10];
      if (rawJson && typeof rawJson === 'string' && rawJson.startsWith('{')) {
        try {
          baseOrder = JSON.parse(rawJson);
        } catch (e) {}
      }
      
      const dateVal = row[0];
      const ts = dateVal instanceof Date ? dateVal.getTime() : (Date.parse(dateVal) || baseOrder.timestamp || Date.now());
      const sheetTotal = Number(row[6]);
      
      orders.push({
        ...baseOrder,
        id: orderId,
        timestamp: ts,
        customerName: String(row[2] || baseOrder.customerName || 'Guest').trim(),
        customerPhone: String(row[3] || baseOrder.customerPhone || '').replace(/^'/, '').trim(),
        orderType: String(row[4] || baseOrder.orderType || '').includes('Takeaway') ? 'takeaway' : 'dine-in',
        total: !isNaN(sheetTotal) && sheetTotal > 0 ? sheetTotal : (Number(baseOrder.total) || 0),
        notes: String(row[7] || baseOrder.notes || '').trim(),
        securityCode: String(row[8] || baseOrder.securityCode || '').trim(),
        receiptUrl: String(row[9] || baseOrder.receiptUrl || '').trim(),
        items: baseOrder.items || []
      });
    }
    
    // Sort newest first
    orders.sort(function(a, b) {
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, orders: orders }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
