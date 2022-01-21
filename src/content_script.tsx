
import parseMoney from "parse-money";
import { CombinedPortfolioView } from "./models/combinedPortfolioView.model";
import { PortfolioView } from "./models/portfolioView.model";

const __pfTemplate = `<span jsname="Fe7oBc" class="NydbP oNKluc ooGEW"><div jsname="m6NnIb" class="zWwE1"><div class="JwB6zf" style="font-size: 14px;">{{percOfTotal}}%</div></div></span>`;

/**
 * Google Finance Plus base logic.
 */
class GoogleFinancePlus {

  private _portfolio!: CombinedPortfolioView;

  /**
   * Init class.
   * 
   * @method init()
   */
  public init(): void {

    // Calculate portfolio value.
    this.calculatePortfolio();

    // Display added portfolio attributes.
    this.enrichUi();
  }

  /**
   * Calculate portfolio locally.
   * 
   * @method calculatePortfolio();
   */
  private calculatePortfolio(): void {

    let totalValue = 0;
    const portfolios: PortfolioView[] = [];

    // Read the total combined portfolio value from HTML.    
    const parsedTotalValue = parseMoney(`${document.querySelector(".kLnHVd")?.innerHTML.split(";")[1]}`);
    totalValue = parsedTotalValue!.amount;

    // Get all the sub portfolios and calculate the % of combined portfolio value.
    const portfoliosFromHtml = document.querySelector(".Swpw7c");
    if (portfoliosFromHtml) {
      for (const portfolio of portfoliosFromHtml.children) {

        const pfName = `${portfolio.firstElementChild?.firstElementChild?.textContent}`;
        const pfValueParsed = parseMoney(`${portfolio.firstElementChild?.children[1].innerHTML.split(";")[1]}`);
        const pfPercentageValueOfTotal = (pfValueParsed!.amount / totalValue) * 100;

        portfolios.push({
          name: pfName,
          value: pfValueParsed!.amount,
          percentageValueOfTotal: pfPercentageValueOfTotal
        });
      };
    }

    // Assign portfolio.
    this._portfolio = {
      totalValue: totalValue,
      portfolios: portfolios
    }
  }

  /**
   * Enrich the UI experience.
   * 
   * @method enrichUi()
   */
  private enrichUi(): void {
    console.log(this._portfolio)
    // Get all the sub portfolios and calculate the % of combined portfolio value.
    const portfoliosFromHtml = document.querySelector(".Swpw7c");
    if (portfoliosFromHtml) {
      for (const portfolio of portfoliosFromHtml.children) {

        // Find the HTML element that matches the portfolio name.
        const pfName = `${portfolio.firstElementChild?.firstElementChild?.textContent}`;
        const portfolioMatch = this._portfolio.portfolios.find(pf => pf.name === pfName);

        // Skip when no match found (should not ever happen).
        if (!portfolioMatch) {
          continue;
        }

        // Put the % value in the HTML template and add it to the webpage.
        const templated = __pfTemplate.replace("{{percOfTotal}}", portfolioMatch.percentageValueOfTotal.toFixed(2));

        // Create the HTML element and put the HTML inside.
        const div = document.createElement("div");
        div.innerHTML = templated;

        // Add the HTML element to the web page.
        portfolio.firstElementChild?.firstElementChild?.parentNode?.appendChild(div);
      }
    }
  }
}

// Create the class.
const gfp = new GoogleFinancePlus();

// Create observer that inspects the HTML element containing the portfolio.
// When a mutation is detected, update the portfolio on the UI again.
const observer = new MutationObserver((mutations, observer) => {
  console.log("GFP: Detected UI updates.");
  gfp.init();
});

// Start observing UI changes.
observer.observe(document.querySelector(".OFJocd")?.firstChild?.parentNode!, {
  subtree: true,
  attributes: true
});