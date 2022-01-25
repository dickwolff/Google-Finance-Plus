
import { PortfolioView } from "../models/portfolioView.model";

const __headerTemplate = `<div class="IifuId GC2yM ZyUYVb">ALLOCATIE (A/D)</div>`;

export class Portfolio {

  private _portfolio!: PortfolioView;

  /**
   * Init class.
   * 
   * @method init()
   */
  public init(): void {

    console.log("GoogleFinancePlus.Portfolio: Init()");

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

  }

  /**
   * Enrich the UI experience.
   * 
   * @method enrichUi()
   */
  private enrichUi(): void {

    const tableHeader = document.querySelector(".gbW8Db");

    // Check if the header exists. It only needs to be added once.
    const allocationHeader = tableHeader!.querySelector(".allocation");
    if (allocationHeader === null) {

      // Create the HTML element and put the HTML inside.
      const div = document.createElement("div");
      div.innerHTML = __headerTemplate;
      tableHeader!.insertBefore(div, tableHeader!.children[5]);
    }
  }
}