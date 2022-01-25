/**
 * Base class for pages.
 */
export abstract class BasePage {

    /**
     * Initalizes the page and UI detection logic.
     * 
     * @method init()
     */
    public abstract init(): void;

    /**
     * Destroy the UI component and unsubscribe to UI detection.
     */
    public abstract destroy(): void;

    /**
     * Runs the business logic within the class.
     * 
     * @method run()
     */
    public abstract run(): void;
}