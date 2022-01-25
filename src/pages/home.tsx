import { inject, injectable } from "inversify";
import parseMoney from "parse-money";
import { CombinedPortfolioView } from "../models/combinedPortfolioView.model";
import { PortfolioView } from "../models/portfolioView.model";
import { PortfolioService } from "../services/portfolio.service";
import { BasePage } from "./base";
import { Portfolio } from "./portfolio";

const __pfTemplate = `<span jsname="Fe7oBc" class="NydbP oNKluc ooGEW"><div jsname="m6NnIb" class="zWwE1"><div class="JwB6zf" style="font-size: 14px;">{{percOfTotal}}%</div></div></span>`;
const __allocationTemplate = `<div class="RL8lmf allocation">{{actual}}% / <strong>{{target}}%</strong></div>`;

@injectable()
export class Home implements BasePage {

    private _observer?: MutationObserver;
    private _portfolio!: CombinedPortfolioView;

    /**
     * Constructor.
     * 
     * @param portfolioService Manages the portfolio data.
     */
    constructor(@inject("PortfolioService") private readonly portfolioService: PortfolioService) { }

    /** @inheritdoc */
    public init(): void {

        console.log("GFP", "Home", "init()");

        // Run business logic once at start.
        this.run();

        // Register to UI changes.
        this.registerUiChanges();
    }

    /** @inheritdoc */
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

    /** @inheritdoc */
    public destroy(): void {

        console.log("GFP", "Home", "destroy()");

        this._observer?.disconnect();
    }

    private calculatePortfolio(): void {

        let totalValue = 0;
        const existingPortfolios: PortfolioView[] = this.portfolioService.getPortfolios();

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

                // Check wether the portfolio exists. 
                const existingPortfolio = existingPortfolios.find(pf => pf.name.toLocaleLowerCase() === pfName.toLocaleLowerCase());
                if (existingPortfolio) {

                    // If the portfolio exists, update the values and store the updated portfolio.
                    existingPortfolio.value = pfValueParsed!.amount;
                    existingPortfolio.allocationPercentageActual = pfPercentageValueOfTotal;
                    this.portfolioService.storePortfolio(existingPortfolio);
                } else {

                    // Add the portfolio as new.
                    this.portfolioService.storePortfolio({
                        name: pfName,
                        value: pfValueParsed!.amount,
                        allocationPercentageActual: pfPercentageValueOfTotal,
                        allocationPercentageTarget: 0
                    });
                };
            }
        }

        // Assign portfolio.
        this._portfolio = this.portfolioService.getCombinedPortfolio();
    }

    private enrichUi(): void {

        // Check for the Portfolio elements. There should be one. 
        // If there are more then one, remove the first.
        const portfolioViews = document.querySelectorAll(`[jsrenderer="NDJNP"]`)
        if (portfolioViews.length > 1) {
            portfolioViews[0].parentNode?.removeChild(portfolioViews[0]);
        }

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

                // Put the % values in the HTML template and add it to the webpage.
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
            console.log("GPF", "Home", "registerUiChanges()", "Detected UI updates.");
            this.run();
        });

        // Start observing UI changes.
        this._observer.observe(document.querySelector(".OFJocd")?.firstChild?.parentNode!, {
            subtree: true,
            attributes: true
        });
    }
}