import { Home } from "./pages/home";
import { Portfolio } from "./pages/portfolio";
import container from "./inversify.config";

/**
 * Main orchestrator.
 */
class GFPRouter {

  private _activePage?: any;

  /**
   * Init the router.
   * 
   * @method init()
   */
  public init(): void {

    // Detect route changes.
    this.registerRouteChanges();
  }

  private registerRouteChanges(): void {

    // Save first route for further checking.
    let oldPath = document.location.pathname;

    // Register route changes on window load.
    window.onload = () => {
      const bodyList = document.querySelector("body");

      // Create observer to watch route changes.
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
          if (oldPath != document.location.pathname) {
            oldPath = document.location.pathname;

            // Route changed. Detect active page.
            this.detectActivePage(oldPath);
          }
        });
      });

      // Start listening to route changes.
      observer.observe(bodyList!, {
        childList: true,
        subtree: true
      });

      // Run detection logic once at start.
      this.detectActivePage(oldPath);
    };
  }

  private detectActivePage(path: string): void {

    console.log("GFP", "Router", "detectActivePage()", "RouteChange Detected");

    // Destroy active component, if present.
    this._activePage?.destroy();
    this._activePage = null;

    if (path === "/finance/") {

      // Google Finance Home Page.
      this._activePage = container.get<Home>("Home");
    }
    else if (path.indexOf("/finance/portfolio/") > -1) {

      // Google Finance Portfolio Page.
      this._activePage = container.get<Portfolio>("Portfolio");
    }
    else {

      // Path not supported.
      console.log("GFP", "Router", "detectActivePage()", "Unsupported page");
    }

    // Initialize active component if present.
    this._activePage?.init();
  }
}

// Create the Router, which initalizes all other code.
(new GFPRouter()).init();