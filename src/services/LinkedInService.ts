import { sleep } from "../functions";
import { PuppeteerService } from "./PuppeteerSevice";
import { DEFINES } from "../index";
import { ElementHandle } from "puppeteer";
import { logger } from "../helpers/Logger";
import fs from 'fs';
import { TechRecruiterService } from "./TechRecruiterService";

export class LinkedInService {
    constructor(private puppeteerService: PuppeteerService) {
    }

    async login(){
        logger.linkedInActivity('Navigating to LinkedIn login page...');

        await this.puppeteerService.goto("https://www.linkedin.com/login");

        if(this.puppeteerService.page.url().includes("/feed/")){
            await this.puppeteerService.page.waitForNavigation({ waitUntil: 'networkidle0' });

            logger.success('Already logged in!');
            return;
        }

        let loggedIn = false;

        while (!loggedIn) {
            try{
                await this.puppeteerService.page.waitForSelector(".global-nav__me-photo", { timeout: 1000 });
                loggedIn = true;
                break;
            }catch(e){
                logger.warn('Not logged in yet - waiting 5 seconds...');
                await sleep(5000);
            }
        }

        logger.success('Successfully logged into LinkedIn!');
    }

    async searchRecruiters(link = DEFINES.LINK, pageNumber = 0){
        const page = this.puppeteerService.page;

        await this.puppeteerService.goto(link);
        
        await page.waitForSelector(".search-results-container", { timeout: 5000 });

        let links: string[] = [];

        try{
            links = JSON.parse(fs.readFileSync(__dirname + '/../links.json', 'utf8') || '[]');
        }catch(e){
            logger.error('Error reading links.json', e);
        }
        await page.waitForSelector("li", { timeout: 5000 });
        await sleep(2000);

        let processedRecruiters = 0;

        let newRecruiters = true;

        while (newRecruiters) {
            newRecruiters = false;
            const cards = await page.$$("li");

            logger.info(`Found ${cards.length} recruiter profiles on current view`);

            for (const card of cards) {
                const service = new TechRecruiterService(
                    this.puppeteerService, 
                    card
                );
                const link = await service.getLink();

                if(link && !links.includes(link)) {
                    links.push(link);
                    fs.writeFileSync(__dirname + '/../links.json', JSON.stringify(links.slice(-10000), null, 2));

                    processedRecruiters++;
                    newRecruiters = true;

                    logger.robotActivity(`Processing recruiter ${processedRecruiters} of page ${pageNumber + 1}...`);

                    try{
                        await service.sendMessage();
                        logger.success(`✅ Recruiter ${processedRecruiters} contacted successfully`);
                    }catch(e){
                        logger.error(`❌ Error contacting recruiter ${processedRecruiters}`, e);
                    }
                }
            }
        }

        logger.success(`Page ${pageNumber + 1} completed - contacted ${processedRecruiters} recruiters`);
        logger.separator();

        const nextPageNumber = pageNumber + 1;
        const nextPageLink = DEFINES.LINK + '&page=' + (nextPageNumber);

        logger.linkedInActivity(`Moving to page ${nextPageNumber + 1}...`);
        await this.searchRecruiters(nextPageLink, nextPageNumber);
    }
}