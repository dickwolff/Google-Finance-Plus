import { inject, injectable } from "inversify";
import { CombinedPortfolioView } from "../models/combinedPortfolioView.model";
import { PortfolioView } from "../models/portfolioView.model";
import { StorageService } from "./storage.service";

@injectable()
export class PortfolioService {

    /**
     * Constructor.
     * 
     * @param storageService Responsible for storing and retrieving data.
     */
    constructor(@inject("StorageService") private readonly storageService: StorageService) { }

    /**
     * Get the overall combined portfolio.
     * 
     * @method getCombinedPortfolio()
     * @returns The overall portfolio, containing sub portfolios.
     */
    public getCombinedPortfolio(): CombinedPortfolioView {

        const result: CombinedPortfolioView = {} as any;

        // Get all the portfolios.
        const portfolios = this.getPortfolios();

        // Add up the total value.
        for (const portfolio of portfolios) {
            result.totalValue += portfolio.value;
        }

        // Set the portfolios on the result.
        result.portfolios = portfolios;

        return result;
    }

    /**
     * Get all portfolios.
     * 
     * @method getPortfolios()
     * @returns The portfolios if stored, empty array otherwise.
     */
    public getPortfolios(): PortfolioView[] {

        const portfolios = this.storageService.get<PortfolioView[]>("portfolios");
        return portfolios === null ? [] : portfolios;
    }

    /**
     * 
     * @param name The name of the portfolio to retrieve.
     * @returns The portfolio if found, or undefined if not.
     */
    public getPortfolio(name: string): PortfolioView | undefined {

        // Get all portfolios, and look for the portfolio with a matching name.
        const portfolios = this.getPortfolios();
        return portfolios.find(pf => pf.name.toLocaleLowerCase() === name.toLocaleLowerCase());
    }

    /**
     * Store a portfolio.
     * 
     * @method storePortfolio()
     * @param portfolio The portfolio to store.
     */
    public storePortfolio(portfolio: PortfolioView): void {

        // Get all portfolio's to see wether there already is a portfolio with the same name.
        const portfolios = this.getPortfolios();
        const exisitingPortfolioIdx = portfolios.findIndex(pf => pf.name.toLocaleLowerCase() === portfolio.name.toLocaleLowerCase());

        // If a portfolio with the same name was found, overwrite it with the parameter. 
        // Otherwise, just add it.
        if (exisitingPortfolioIdx > -1) {
            portfolios[exisitingPortfolioIdx] = portfolio;
        } else {
            portfolios.push(portfolio);
        }

        // Store the portfolio.
        this.storageService.store("portfolios", portfolios);
    }
}