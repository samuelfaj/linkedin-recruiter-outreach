import { getTextFromElement, sleep } from "../functions";
import { PuppeteerService } from "./PuppeteerSevice";
import { ElementHandle } from "puppeteer";
import fs from 'fs';
import { ChatService } from "./ChatService";
import { logger } from "../helpers/Logger";

export class TechRecruiterService {
    constructor(
        private puppeteerService: PuppeteerService, 
        private card: ElementHandle<Element>
    ) {
    }

    getCard(){
        return this.card;
    }

    async getInfo(){
        const profileLink = await this.getLink();
        
        if (!profileLink) {
            logger.error('No profile link found for recruiter');
            return null;
        }

        logger.robotActivity(`Extracting profile information from: ${profileLink}`);
        
        const page = await this.puppeteerService.newPage();
        
        try {
            await page.goto(profileLink);
            await sleep(1000);

            await page.waitForSelector('main', { timeout: 5000 });
            logger.success('Recruiter profile page loaded successfully');

            const main = await page.$('main');
            const mainText = await getTextFromElement(main as ElementHandle<Element>);

            if (mainText) {
                logger.robotActivity(`Extracted ${mainText.length} characters of profile data`);
            } else {
                logger.warn('No profile text extracted');
            }

            return mainText;
        } catch (error) {
            logger.error('Error loading recruiter profile page', error);
            return null;
        } finally {
            await page.close();
            logger.robotActivity('Closed recruiter profile page');
        }
    }

    async getLink(){
        try {
            const link = await this.card.$('a[data-test-app-aware-link]');
            const profileUrl = await link?.evaluate((el: Element) => (el as HTMLAnchorElement).href || null);
            
            if (profileUrl) {
                logger.robotActivity(`Found recruiter profile link: ${profileUrl}`);
            } else {
                logger.warn('No profile link found in recruiter card');
            }
            
            return profileUrl;
        } catch (error) {
            logger.error('Error extracting recruiter profile link', error);
            return null;
        }
    }

    async sendMessage(){
        logger.linkedInActivity('Initiating message send to recruiter...');
        
        try {
            await (new ChatService(this.puppeteerService, this)).sendMessage();
            logger.success('Message process completed');
        } catch (error) {
            logger.error('Error during message send process', error);
            throw error;
        }
    }
}