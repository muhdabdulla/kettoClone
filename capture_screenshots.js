const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.join(__dirname, 'ketto_project_report', 'images');

async function run() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,850'],
    defaultViewport: { width: 1280, height: 850 }
  });

  const page = await browser.newPage();

  // 1. Landing Page
  console.log('Capturing landing_page.png...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'landing_page.png') });

  // 1b. Impact Stats & Categories
  console.log('Capturing categories_and_stats.png...');
  await page.evaluate(() => window.scrollTo(0, 650));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, 'categories_and_stats.png') });

  // 2. Campaigns Grid
  console.log('Capturing campaigns_grid.png...');
  await page.goto('http://localhost:3000/campaigns', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 200));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, 'campaigns_grid.png') });

  // 3. Campaign Detail Page
  console.log('Capturing campaign_detail.png...');
  await page.goto('http://localhost:3000/campaign/660000000000000000000005', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 100));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, 'campaign_detail.png') });

  // 4. Donate Modal
  console.log('Capturing donate_modal.png...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 700));
  await new Promise(r => setTimeout(r, 400));
  const donateBtn = await page.$('.btn-card-donate');
  if (donateBtn) {
    await donateBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, 'donate_modal.png') });

    // 5. Submit Donation for Receipt Screen
    console.log('Capturing donate_receipt.png...');
    const submitBtn = await page.$('.donate-submit-btn');
    if (submitBtn) {
      await submitBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(OUT_DIR, 'donate_receipt.png') });
    }
  }

  // 6. Start Fundraiser Page
  console.log('Capturing start_fundraiser.png...');
  await page.goto('http://localhost:3000/start-fundraiser', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 150));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, 'start_fundraiser.png') });

  // 7. Social Impact Plan Page
  console.log('Capturing sip_page.png...');
  await page.goto('http://localhost:3000/sip', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 50));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, 'sip_page.png') });

  // 8. Dashboard Page
  console.log('Capturing dashboard_page.png...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, 'dashboard_page.png') });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
