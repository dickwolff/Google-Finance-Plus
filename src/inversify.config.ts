import { Container } from "inversify";
import "reflect-metadata";
import { Home } from "./pages/home";
import { Portfolio } from "./pages/portfolio";
import { PortfolioService } from "./services/portfolio.service";
import { StorageService } from "./services/storage.service";

var container = new Container();

// Services.
container.bind<StorageService>("StorageService").to(StorageService);
container.bind<PortfolioService>("PortfolioService").to(PortfolioService);

// Business classes.
container.bind<Home>("Home").to(Home);
container.bind<Portfolio>("Portfolio").to(Portfolio);

export default container;