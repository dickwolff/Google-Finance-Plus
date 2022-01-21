import { PortfolioView } from "./portfolioView.model";

export class CombinedPortfolioView {
    public totalValue!: number;
    public portfolios: PortfolioView[] = [];
}