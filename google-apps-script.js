/**
 * RBS Store Survey — Google Apps Script v2
 * ==========================================
 * รับข้อมูลได้ทั้ง GET และ POST พร้อม CORS
 * Deploy as Web App > Anyone > Execute as Me
 */

const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';

function doGet(e) {
  if (e.parameter && e.parameter.data) {
    try {
      const data = JSON.parse(decodeURIComponent(e.parameter.data));
      const ss   = SpreadsheetApp.openById(SPREADSHEET_ID);
      writeRawData(ss, data);
      writeSummary(ss, data);
      writePipeline(ss, data);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok', store: data.storeName }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'RBS Survey Script is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.openById(SPREADSHEET_ID);
    writeRawData(ss, data);
    writeSummary(ss, data);
    writePipeline(ss, data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', store: data.storeName }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function writeRawData(ss, data) {
  let sheet = ss.getSheetByName('Raw Data');
  if (!sheet) sheet = ss.insertSheet('Raw Data');
  if (sheet.getLastRow() === 0) {
    const keys = Object.keys(data);
    sheet.appendRow(keys);
    sheet.getRange(1,1,1,keys.length)
      .setBackground('#0f1f3d').setFontColor('#ffffff')
      .setFontWeight('bold').setFontSize(10);
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 28);
  }
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map(h => data[h] !== undefined ? data[h] : ''));
  const lr = sheet.getLastRow();
  sheet.getRange(lr,1,1,headers.length).setBackground(ratingBg(data.overallRating));
  sheet.setRowHeight(lr, 22);
}

function writeSummary(ss, data) {
  let sheet = ss.getSheetByName('Summary');
  if (!sheet) sheet = ss.insertSheet('Summary');
  const COLS = [
    ['Timestamp','timestamp'],['Store Name','storeName'],['Chain','chain'],
    ['Industry','industry'],['Location','locationType'],['Surveyor','surveyor'],
    ['Date','surveyDate'],['Impression','score_impression'],
    ['Category (25%)','sec1_avg'],['Shelf (15%)','sec2_avg'],
    ['Display+Visual (30%)','sec3_avg'],['Entrance+Flow (23%)','sec4_avg'],
    ['Checkout (7%)','sec5_avg'],['TOTAL SCORE','totalWeightedScore'],
    ['Rating','overallRating'],['Priority','priority'],
    ['RBS Solution','solution'],['Budget','budget'],['Timeline','decisionTimeline'],
  ];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLS.map(c=>c[0]));
    sheet.getRange(1,1,1,COLS.length)
      .setBackground('#0f1f3d').setFontColor('#ffffff')
      .setFontWeight('bold').setFontSize(10).setWrap(true);
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1,40);
    [140,180,130,120,120,120,90,80,100,90,110,100,90,90,80,140,200,100,110]
      .forEach((w,i)=>sheet.setColumnWidth(i+1,w));
  }
  sheet.appendRow(COLS.map(c=>data[c[1]]!==undefined?data[c[1]]:''));
  const lr = sheet.getLastRow();
  const sv = parseFloat(data.totalWeightedScore||0);
  sheet.getRange(lr,1,1,COLS.length).setBackground(ratingBg(data.overallRating));
  sheet.getRange(lr,14).setFontWeight('bold').setFontSize(12)
    .setFontColor(sv>=4.5?'#15803d':sv>=3.5?'#1d4ed8':sv>=2.5?'#a16207':'#dc2626');
  sheet.setRowHeight(lr,22);
}

function writePipeline(ss, data) {
  if (!data.priority) return;
  let sheet = ss.getSheetByName('Pipeline');
  if (!sheet) sheet = ss.insertSheet('Pipeline');
  const COLS = [
    ['Date','surveyDate'],['Store Name','storeName'],['Chain','chain'],
    ['Score','totalWeightedScore'],['Rating','overallRating'],['Priority','priority'],
    ['RBS Solution','solution'],['Budget','budget'],['Timeline','decisionTimeline'],
    ['Surveyor','surveyor'],['Pain Point','painNote'],
    ['Strength','strength'],['Opportunity','opportunity'],
  ];
  if (sheet.getLastRow()===0) {
    sheet.appendRow(COLS.map(c=>c[0]));
    sheet.getRange(1,1,1,COLS.length)
      .setBackground('#166534').setFontColor('#fff').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  const p = (data.priority||'').split(' ')[0];
  const bg = {High:'#fee2e2',Medium:'#fef9c3',Low:'#f0fdf4'}[p]||'#f8fafc';
  sheet.appendRow(COLS.map(c=>data[c[1]]||''));
  sheet.getRange(sheet.getLastRow(),1,1,COLS.length).setBackground(bg);
}

function ratingBg(r) {
  return {Excellent:'#f0fdf4',Good:'#eff6ff',Fair:'#fefce8',Poor:'#fef2f2'}[r]||'#f8fafc';
}

function _test() {
  const dummy = {
    timestamp: new Date().toISOString(),
    storeName:'TEST STORE — Circle K Hanoi 01', chain:'Circle K',
    industry:'CVS', locationType:'City Centre', surveyor:'Test User',
    surveyDate:'2025-04-26', surveyLanguage:'en', score_impression:4,
    sec1_avg:'3.5', sec2_avg:'4.0', sec3_avg:'3.8', sec4_avg:'4.2', sec5_avg:'3.1',
    totalWeightedScore:'3.77', overallRating:'Good',
    priority:'High — Close within 1 month',
    solution:'Smart Shelf + Planogram', budget:'500K – 2M THB',
    strength:'Strong foot traffic', weakness:'Old shelf system',
    opportunity:'Upgrade shelf to increase sales density',
  };
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  writeRawData(ss, dummy);
  writeSummary(ss, dummy);
  writePipeline(ss, dummy);
  Logger.log('Test done — check your Google Sheet');
}
