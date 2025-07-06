import { getTextFromElement, sleep } from "../functions";
import { PuppeteerService } from "./PuppeteerSevice";
import { ElementHandle } from "puppeteer";
import fs from 'fs';
import { TechRecruiterService } from "./TechRecruiterService";
import ChatGptHelper from "../helpers/ChatGptHelper";
import { logger } from "../helpers/Logger";

export class ChatService {
    constructor(
        private puppeteerService: PuppeteerService, 
        private techRecruiterService: TechRecruiterService,
    ) {
    }

    private async generateMessage(){
        logger.robotActivity('Generating AI-powered personalized message...');
        const info = await this.techRecruiterService.getInfo();
        const prompt = fs.readFileSync(__dirname + '/../../prompt.txt', 'utf8').replace('{{info}}', info || '');
        
        const message = await ChatGptHelper.sendText('gpt-4.1-nano', prompt);
        
        if (message) {
            logger.success('AI message generated successfully');
        } else {
            logger.error('Failed to generate AI message');
        }
        
        return message;
    }

    private async clearChatInput(messageInput: ElementHandle<Element>){
        const page = this.puppeteerService.page;

        await messageInput.focus();

        const text = await getTextFromElement(messageInput as ElementHandle<Element>);

        if(text){
            logger.robotActivity('Clearing existing chat input...');
            for(let i = 0; i < text.length + 10; i++){
                await page.keyboard.press('Backspace', { delay: 10 });
            }
        }
    }

    async getNameInChat(){
        const page = this.puppeteerService.page;
        await page.waitForSelector('.msg-compose__profile-link', { timeout: 1000 });
        const name = await page.$('.msg-compose__profile-link');
        const recruiterName = await getTextFromElement(name as ElementHandle<Element>);
        
        if (recruiterName) {
            logger.linkedInActivity(`Opening chat with recruiter: ${recruiterName}`);
        }
        
        return recruiterName;
    }

    async closeAllChats(){
        logger.robotActivity('Closing any existing chat windows...');
        const page = this.puppeteerService.page;
        const buttons = await page.$$('[href="#close-small"]');

        for(const button of buttons){
            await button.click();
        }
        
        await sleep(1000);
        const buttons2 = await page.$$('button');

        for(const button of buttons2){
            const text = await getTextFromElement(button as ElementHandle<Element>);

            if(text?.toLowerCase().includes('discard'.toLowerCase())){
                await button.click();
            }
        }
        
        if (buttons.length > 0) {
            logger.success('Existing chat windows closed');
        }
    }

    async sendMessage(){
        const page = this.puppeteerService.page;
        const buttons = await this.techRecruiterService.getCard().$$('button');

        logger.linkedInActivity('Looking for message button on recruiter profile...');

        for(const button of buttons){
            const text = await getTextFromElement(button as ElementHandle<Element>);

            if(text?.toLowerCase().includes('message'.toLowerCase())){
                logger.robotActivity('Opening LinkedIn message composer...');
                await this.closeAllChats();
                await button.click();

                await page.waitForSelector('[aria-label="Write a message…"]', { timeout: 5000 });

                const chatDiv = await page.$('[data-msg-overlay-conversation-bubble-is-minimized="false"]');

                if(!chatDiv){
                    logger.error('Could not find message composer window');
                    return false;
                }

                const messageInput = await chatDiv.$('[aria-label="Write a message…"]');

                if(messageInput){
                    const message = await this.generateMessage();

                    if(!message){
                        logger.error('Failed to generate message - skipping this recruiter');
                        return false;
                    }

                    await this.clearChatInput(messageInput);

                    await messageInput.focus();

                    logger.robotActivity('Typing personalized message...');
                    await page.keyboard.type(message, { delay: 50 });
                    await sleep(100);
    
                    const submitButton = await chatDiv.$('button[type="submit"]');
                    
                    if (submitButton) {
                        logger.robotActivity('Sending message to recruiter...');
                        await submitButton.click();
                        logger.success('Message sent successfully!');
                    } else {
                        logger.error('Could not find send button');
                        return false;
                    }

                    await sleep(5000);
                }
                break;
            }
        }
    }
}