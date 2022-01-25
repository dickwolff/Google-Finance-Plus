
import { injectable } from "inversify";
import { PortfolioView } from "../models/portfolioView.model";
import { BasePage } from "./base";

const __headerTemplate = `<div class="IifuId GC2yM ZyUYVb">ALLOCATIE (A/D)</div>`;

@injectable()
export class Portfolio implements BasePage {

  private _observer?: MutationObserver;
  private _portfolio!: PortfolioView;

  /** @inheritdoc */
  public init(): void {

    console.log("GFP", "Portfolio", "init()");

    // Run business logic once at start.
    this.run();

    // Register to UI changes.
    this.registerUiChanges();
  }

  /** @inheritdoc */
  public run(): void {

    // Calculate portfolio value.
    this.calculatePortfolio();

    // Display added portfolio attributes.
    this.enrichUi();
  }

  /** @inheritdoc */
  public destroy(): void {

    console.log("GFP", "Portfolio", "destroy()");

    this._observer?.disconnect();
  }

  private calculatePortfolio(): void {

  }

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

  private registerUiChanges(): void {

    console.log("GFP", "Portfolio", "registerUiChanges()");

    // If an observer already exists, don't start a new one.
    if (this._observer) {
      return;
    }

    // Create observer that inspects the HTML element containing the portfolio.
    // When a mutation is detected, update the portfolio on the UI again.
    this._observer = new MutationObserver((mutations, observer) => {
      console.log("GPF", "Portfolio", "registerUiChanges()", "Detected UI updates.");
      this.run();
    });

    // Start observing UI changes.
    this._observer.observe(document.querySelector(".HLW40c")?.firstChild?.parentNode!, {
      subtree: true,
      attributes: true
    });
  }
}