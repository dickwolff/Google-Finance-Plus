import parseMoney from "parse-money";
import { CombinedPortfolioView } from "../models/combinedPortfolioView.model";
import { PortfolioView } from "../models/portfolioView.model";

const __pfTemplate = `<span jsname="Fe7oBc" class="NydbP oNKluc ooGEW"><div jsname="m6NnIb" class="zWwE1"><div class="JwB6zf" style="font-size: 14px;">{{percOfTotal}}%</div></div></span>`;
const __allocationTemplate = `<div class="RL8lmf allocation">{{actual}}% / <strong>{{target}}%</strong></div>`;

export class Home {

    private _observer?: MutationObserver;
    private _portfolio!: CombinedPortfolioView;

    /**
     * Initialize the class and register events.
     * 
     * @method init()
     */
    public init(): void {

        console.log("GFP", "Home", "init()");

        // Run business logic once at start.
        this.run();

        // Register to UI changes.
        this.registerUiChanges();
    }

    /**
     * Run the portfolio logic.
     */
    public run(): void {

        console.log("GFP", "Home", "run()");

        try {
            // Calculate portfolio value.
            this.calculatePortfolio();

            // Display added portfolio attributes.
            this.enrichUi();
        }
        catch (err) {
            console.error("GFP", "Home", "run()", err);
        }
    }

    /**
     * Destroy the component.
     * 
     * @method destroy()
     */
    public destroy(): void {

        console.log("GFP", "Home", "destroy()");

        this._observer?.disconnect();
    }

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
                    allocationPercentageActual: pfPercentageValueOfTotal,
                    allocationPercentageTarget: 0
                });
            };
        }

        // Assign portfolio.
        this._portfolio = {
            totalValue: totalValue,
            portfolios: portfolios
        }
    }

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
                const templated = __allocationTemplate
                    .replace("{{actual}}", portfolioMatch.allocationPercentageActual.toFixed(2))
                    .replace("{{target}}", portfolioMatch.allocationPercentageTarget.toFixed(2));

                // Create the HTML element and put the HTML inside.
                const div = document.createElement("div");
                div.innerHTML = templated;

                // If the allocation element does exist, remove it first.
                const attrs = portfolio!.querySelector(".allocation");
                if (attrs) {
                    attrs.parentNode?.removeChild(attrs);
                }

                // Add the HTML element to the web page.
                portfolio.firstElementChild?.firstElementChild?.parentNode?.appendChild(div);
            }
        }
    }

    private registerUiChanges(): void {

        console.log("GFP", "Home", "registerUiChanges()");

        // If an observer already exists, don't start a new one.
        if (this._observer) {
            return;
        }

        // Create observer that inspects the HTML element containing the portfolio.
        // When a mutation is detected, update the portfolio on the UI again.
        this._observer = new MutationObserver((mutations, observer) => {
            console.log("GPF", "Home", "Detected UI updates.");
            this.run();
        });

        // Start observing UI changes.
        this._observer.observe(document.querySelector(".OFJocd")?.firstChild?.parentNode!, {
            subtree: true,
            attributes: true
        });
    }
}