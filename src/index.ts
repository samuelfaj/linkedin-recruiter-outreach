const puppeteer = require("puppeteer");
import { PuppeteerService } from "./services/PuppeteerSevice";
import { LinkedInService } from "./services/LinkedInService";
import { logger } from "./helpers/Logger";
import fs from 'fs';

export const DEFINES  = {
    COOLDONW_MINUTES: 20,
    LINK: `https://www.linkedin.com/search/results/people/?activelyHiringForJobTitles=%5B%229%22%2C%2239%22%2C%2225201%22%2C%2225194%22%5D&geoUrn=%5B%22103644278%22%5D&keywords=tech%20recruiter&origin=FACETED_SEARCH&sid=__G`, 
}

setInterval(() => {
    logger.warn('Cooldown: ' + DEFINES.COOLDONW_MINUTES + ' minutes reached, exiting...');
    process.exit(0);
}, 1000 * 60 * DEFINES.COOLDONW_MINUTES);

const main = async () => {
    try {
        // Show welcome banner
        logger.showBanner('Recruiter Bot');
        
        // Show welcome box
        logger.showBox(
            'LinkedIn Tech Recruiter Outreach Bot\n' +
            'Automatically finds and messages tech recruiters\n' +
            'With AI-powered personalized messages\n\n' +
            'Starting automation...',
            '🤖 RECRUITER OUTREACH AGENT'
        );

        logger.separator();
        
        // Initialize services
        logger.robotActivity('Initializing LinkedIn recruiter outreach bot...');
        
        logger.startSpinner('puppeteer', 'Starting Puppeteer browser...');
        const puppeteerService = await PuppeteerService.init();
        logger.succeedSpinner('puppeteer', 'Puppeteer browser started successfully');

        logger.robotActivity('Creating LinkedIn service instance...');
        const linkedInService = new LinkedInService(puppeteerService);
        
        logger.separator();
        
        // Login process
        logger.linkedInActivity('Starting LinkedIn login process...');
        logger.startSpinner('login', 'Waiting for LinkedIn login...');
        
        await linkedInService.login();
        
        logger.succeedSpinner('login', 'Successfully logged into LinkedIn');
        logger.success('LinkedIn authentication completed');
        
        logger.separator();
        
        // Recruiter search process
        logger.linkedInActivity('Starting tech recruiter search and outreach process...');
        logger.info('Target recruiter search criteria:', {
            keywords: 'tech recruiter',
            location: 'Global',
            activelyHiring: 'Software Engineer, Product Manager, Data Scientist, Engineering Manager roles',
            outreach: 'AI-powered personalized messages'
        });
        
        logger.startSpinner('recruiter-search', 'Searching for tech recruiters...');
        
        await linkedInService.searchRecruiters();
        
        logger.succeedSpinner('recruiter-search', 'Tech recruiter search and outreach process completed');
        logger.success('All available recruiters have been processed');
        
    } catch (error) {
        logger.error('Critical error in main process', error);
        process.exit(1);
    }
}

// Handle process cleanup
process.on('SIGINT', () => {
    logger.warn('Received SIGINT, cleaning up...');
    logger.cleanup();
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.warn('Received SIGTERM, cleaning up...');
    logger.cleanup();
    process.exit(0);
});

// Start the application
main().catch((error) => {
    logger.error('Unhandled error in main process', error);
    logger.cleanup();
    process.exit(1);
});