const Apify = require('apify');


async function getElectricityQuotes(postcode, MPAN, consumption) {

  // Launch the web browser.
  console.log('launching browser');
  const browser = await Apify.launchPuppeteer();

  // Create and navigate new page
  console.log('Open target page');
  const page = await browser.newPage();
  await page.goto('https://www.britishgas.co.uk/business/gas-and-electricity/energy-quote/site/postcode');

  // Fill form fields and select desired search options
  console.log('Fill in search form');

  // Enter postcode
  console.log('Entering postcode');
  await page.type('#postcode', postcode);
  console.log('postcode entered');

  // Click find address
  console.log('clicking find address');
  await page.click('button.btn.btn-submit.ukb-postcode__submit.ember-view');
  console.log('find address clicked');
  await Apify.utils.sleep(2000);

  // Click my address isn't listed
  console.log("clicking my address isn't listed");
  await page.click('a.d-inline-block.mt-3.ember-view');
  console.log("my address isn't listed clicked");
  await Apify.utils.sleep(2000);

  // Enter MPAN
  console.log('Entering MPAN');
  await page.type('#m1', MPAN);
  console.log('MPAN entered');

  // Click find my meter
  console.log('clicking find my meter');
  await page.click('button.btn.btn-submit.mt-4.mb-3.ember-view');
  console.log('find my meter clicked');
  await Apify.utils.sleep(500);

  // Enter gas usage
  console.log('Entering gas usage');
  await page.type('input.form-control.ember-text-field.ember-view', consumption);
  console.log('gas usage entered');
  await Apify.utils.sleep(500);

  // Click next
  console.log('clicking next');
  await page.click('button.btn.btn-submit.my-3.ember-view');
  console.log('nextv clicked');
  await Apify.utils.sleep(2000);

  // Enter first name
  console.log('Entering first name');
  await page.type('#firstName', 'aa');
  console.log('first name entered');

  // Enter surname
  console.log('Entering surname');
  await page.type('#surname', 'aa');
  console.log('surname entered');

  // Enter business name
  console.log('Entering business name');
  await page.type('#business', 'aa');
  console.log('business entered name');

  // Enter phone number
  console.log('Entering phone number');
  await page.type('#phone', '01123123123');
  console.log('phone number entered');

  // Enter email address
  console.log('Entering email address');
  await page.type('#email', 'aa@gmail.com');
  console.log('email address entered');

  // Click next
  console.log('clicking next');
  await page.click('button.btn.btn-submit.ember-view');
  console.log('nextclicked');
  await Apify.utils.sleep(5000);

  // Click show more
  console.log('clicking show more');
  await page.click('button.btn.btn-outline-primary.ember-view');
  console.log('show more clicked');

  // Click expand each section
  console.log('clicking expand section');
  console.log('scraping prices');

  await page.evaluate(() => {
    for (i = 0; i < document.querySelectorAll('div.d-flex.tariff-details__toggle-gaq-breakdown.justify-content-center.ember-view').length; i++) {
      document.querySelectorAll('div.d-flex.tariff-details__toggle-gaq-breakdown.justify-content-center.ember-view')[i].click();
    }
  });
  await Apify.utils.sleep(1000);

  // Obtain and print list of search results
  const gasQuote = await page.$$eval(
    'div.cp-Panel.cp-is-open.ember-view',
    nodes =>
      nodes.map(node => ({
        gasQuote: node.innerText,

      })),
  );
  // console.log(`electricityQuote based on ${consumption} kWh per year of electricity usage:`, gasQuote);
  // for (i = 0; i < gasQuote.length; i++) {
  //   console.log(`electricityQuote ${i + 1} based on ${consumption} kWh per year of electricity usage:`, gasQuote[i]);
  // }
  await Apify.pushData(gasQuote);

}

var postcodeValues = ['SE14PD', 'S403SN']
var consumptionValues = ['2000', '5000', '10000', '16000', '25000', '40000', '50000', '100000']

async function getAllQuotes() {
  Apify.main(async () => {
    for (i = 0; i < consumptionValues.length; i++) {

      console.log('getting quote for', consumptionValues[i]);

      try {
        await getElectricityQuotes('SE14PD', '000000001200060039972', consumptionValues[i]);
      } catch (e) {
      }
      console.log('finished quoting for', consumptionValues[i]);
    }
  })
}

getAllQuotes()
