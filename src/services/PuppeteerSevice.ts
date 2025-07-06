import puppeteer, { Browser, Page } from "puppeteer";
import { logger } from "../helpers/Logger";

export class PuppeteerService {
    static async init(){
        logger.robotActivity('Initializing Puppeteer browser for LinkedIn automation...');
        
        const browserOptions = {
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"],
            userDataDir: "./.puppeteer-data",
        };

        logger.debug('Browser configuration:', browserOptions);

        try {
            const browser = await puppeteer.launch(browserOptions);
            logger.success('Puppeteer browser launched successfully');

            const page = await browser.newPage();
            logger.robotActivity('New browser page created for LinkedIn navigation');

            return new PuppeteerService(browser, page);
        } catch (error) {
            logger.error('Failed to initialize Puppeteer browser', error);
            throw error;
        }
    }

    constructor(public browser: Browser, public page: Page) {
        logger.robotActivity('PuppeteerService instance created and ready');
    }

    async newPage(){
        try {
            const page = await this.browser.newPage();
            logger.robotActivity('New browser page created for recruiter profile analysis');
            return page;
        } catch (error) {
            logger.error('Failed to create new browser page', error);
            throw error;
        }
    }

    async goto(url: string){
        try {
            logger.robotActivity(`Navigating to: ${url}`);
            await this.page.goto(url, { waitUntil: 'networkidle2' });
            logger.success(`Successfully navigated to: ${url}`);
        } catch (error) {
            logger.error(`Failed to navigate to: ${url}`, error);
            throw error;
        }
    }
}