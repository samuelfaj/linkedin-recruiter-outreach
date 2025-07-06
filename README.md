# LinkedIn Tech Recruiter Outreach Bot

An automated LinkedIn outreach bot that finds tech recruiters and sends them personalized AI-generated messages to expand your professional network and job opportunities.

## ⚠️ Important Disclaimer

This tool is for educational and personal use only. Please be aware that:
- Automated messaging may violate LinkedIn's Terms of Service
- Use at your own risk - your LinkedIn account could be suspended or banned
- Always ensure your outreach is professional and respectful
- Consider the ethics of automated messaging in your networking strategy
- This tool should complement, not replace, genuine relationship building
- Respect recruiters' time and only send relevant, personalized messages

## Features

- **Automated Login**: Waits for manual login to LinkedIn
- **Recruiter Search**: Automatically searches through LinkedIn for tech recruiters
- **Profile Analysis**: Extracts detailed information from recruiter profiles
- **🤖 AI-Powered Personalized Messages**: Uses ChatGPT to generate personalized outreach messages
- **📋 Profile-Based Customization**: Tailors messages based on recruiter's background and your profile
- **🔍 Context-Aware Messaging**: Considers recruiter's specialization and current hiring focus
- **🎨 Modern Logging System**: Beautiful, animated, and colorful console logs with progress tracking
- **⚡ Real-time Progress**: Spinners, progress bars, and visual feedback for all operations
- **🌈 Visual Excellence**: ASCII art banners, styled boxes, and gradient text effects
- **📊 Contact Tracking**: Maintains a history of contacted recruiters to avoid duplicates
- **🔄 Pagination Support**: Continues through multiple pages of recruiter results
- **💬 Smart Message Management**: Handles LinkedIn's messaging interface automatically

## Requirements

- [Bun](https://bun.sh/) runtime
- Node.js (if not using Bun)
- Chrome/Chromium browser (for Puppeteer)
- OpenAI API key (for ChatGPT integration)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/samuelfaj/linkedin-tech-recruiters.git
cd linkedin-tech-recruiters
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

## Configuration

1. **OpenAI API Key**: Set up your OpenAI API key for ChatGPT integration:
```bash
export OPENAI_API_KEY="your-api-key-here"
```

2. **Message Prompt**: Edit the `prompt.txt` file to customize your outreach message template:
   - Update the message tone and style
   - Include your professional background
   - Specify what you're looking for (job opportunities, networking, etc.)
   - Add your skills and expertise
   - The `{{info}}` placeholder will be replaced with the recruiter's profile information

3. **Search URL**: Update the `LINK` in `src/index.ts` with your desired recruiter search criteria:
```typescript
export const DEFINES = {
    LINK: `https://www.linkedin.com/search/results/people/?activelyHiringForJobTitles=%5B%229%22%2C%2239%22%2C%2225201%22%2C%2225194%22%5D&geoUrn=%5B%22103644278%22%5D&keywords=tech%20recruiter&origin=FACETED_SEARCH&sid=__G`
}
```

4. **Search Parameters**: Modify the URL parameters to match your preferences:
   - `keywords`: "tech recruiter", "software recruiter", etc.
   - `geoUrn`: Geographic location ID
   - `activelyHiringForJobTitles`: Specific job roles they're hiring for
   - Add filters for company size, industry, etc.

## Usage

1. Start the application:
```bash
bun start
# or
npm start
```

2. The browser will open automatically
3. **Manual Login**: Log in to your LinkedIn account manually when prompted
4. The bot will automatically:
   - Navigate to the recruiter search page
   - Scroll through recruiter profiles
   - Extract detailed profile information
   - Generate personalized messages using AI
   - Send messages to recruiters
   - Continue to next pages automatically
   - Track contacted recruiters to avoid duplicates

## Project Structure

```
src/
├── index.ts                    # Main entry point
├── functions.ts                # Utility functions
├── links.json                  # Tracks contacted recruiters
├── helpers/
│   ├── ChatGptHelper.ts        # ChatGPT integration for message generation
│   └── Logger.ts               # Modern logging system with animations
└── services/
    ├── ChatService.ts          # Handles LinkedIn messaging
    ├── TechRecruiterService.ts # Manages recruiter profile processing
    ├── LinkedInService.ts      # LinkedIn navigation and search
    └── PuppeteerService.ts     # Browser automation
```

## 🎨 Modern Logging System

This project features a state-of-the-art logging system that makes monitoring and debugging a visual delight:

### Visual Features
- **🌈 Colorful Logs**: Different colors for different log types (info, success, warning, error)
- **🎭 Contextual Emojis**: Specific emojis for robot activities, recruiter outreach, LinkedIn interactions
- **⏰ Timestamps**: Precise timing for all operations
- **🎪 Animations**: Spinners and progress bars for real-time feedback
- **📦 Styled Boxes**: Important messages highlighted in beautiful boxes
- **🎨 ASCII Art**: Rainbow-colored banners and headers

### Specialized Log Types
```typescript
logger.robotActivity('Browser automation in progress...');        // 🤖
logger.linkedInActivity('LinkedIn interaction happening...');      // 🔗
logger.success('Message sent successfully!');                     // ✅
logger.error('Error contacting recruiter');                       // ❌
```

### Example Output
When you run the bot, you'll see beautiful output like:
- Animated ASCII art banner for "RECRUITER OUTREACH AGENT"
- Progress bars for recruiter processing
- Colorful status messages with emojis
- Real-time spinners for operations
- Styled error messages with stack traces

This makes the bot not only functional but also enjoyable to watch and debug!

## How It Works

1. **Initialization**: Launches a Puppeteer browser instance
2. **Login**: Waits for manual LinkedIn login
3. **Recruiter Search**: Navigates to the specified recruiter search URL
4. **Profile Processing**: For each recruiter:
   - Extracts recruiter profile information
   - Checks if already contacted (using links.json)
   - **🤖 AI-Powered Message Generation**: 
     - Analyzes recruiter's background and specialization
     - Uses your prompt template from `prompt.txt`
     - Combines recruiter info with your message template
     - Generates personalized outreach message via ChatGPT
   - Opens LinkedIn messaging interface
   - Sends the personalized message
   - Records the contact in links.json
5. **Pagination**: Automatically moves to next page of results
6. **Continuous Operation**: Runs through all available recruiter pages

## Customization

### Modifying Recruiter Search Criteria
Edit the `DEFINES.LINK` in `src/index.ts` to change:
- Recruiter keywords and specializations
- Geographic location
- Company size and industry filters
- Actively hiring status

### Customizing AI Messages
- **Message Template**: Update `prompt.txt` with your specific messaging style
- **ChatGPT Model**: Change the model in `ChatGptHelper.ts` (default: `gpt-4.1-nano`)
- **Response Style**: Modify the prompt structure for different message tones

### Adding Custom Outreach Logic
Extend the services to handle:
- Custom message templates for different recruiter types
- Follow-up message sequences
- Connection requests before messaging
- Industry-specific messaging strategies

## Message Template

The `prompt.txt` file should contain your message template with the `{{info}}` placeholder:

```
Hi there!

I came across your profile and noticed you're actively recruiting for tech roles. 

Based on your background: {{info}}

I'd love to connect and discuss potential opportunities that align with my experience in software development.

Looking forward to hearing from you!

Best regards,
[Your Name]
```

## Troubleshooting

**Browser Issues**:
- Ensure Chrome/Chromium is installed
- Check Puppeteer data directory permissions
- Clear browser cache if LinkedIn behaves unexpectedly

**Login Problems**:
- Manually log in when the browser opens
- Check for 2FA requirements
- Ensure your LinkedIn account is in good standing

**Messaging Failures**:
- Some profiles may not allow direct messaging
- Network timeouts may occur with slow connections
- LinkedIn may have rate limits on messaging

**ChatGPT Integration Issues**:
- Ensure `OPENAI_API_KEY` environment variable is set
- Check OpenAI API quota and billing status
- Update `prompt.txt` with your message template
- Verify internet connection for API calls

**Configuration Issues**:
- Ensure `prompt.txt` file exists and contains your template
- Check that OpenAI dependency is installed (`npm install openai`)
- Verify the search URL is properly formatted

## Best Practices

1. **Quality over Quantity**: Focus on sending fewer, more personalized messages
2. **Respectful Outreach**: Always be professional and respectful
3. **Timing**: Don't send too many messages in a short time period
4. **Follow-up**: Be prepared to manually follow up on positive responses
5. **Profile Optimization**: Ensure your LinkedIn profile is complete and professional
6. **Message Relevance**: Make sure your messages are relevant to each recruiter's focus

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

If you encounter issues:
1. Check the console output for error messages
2. Ensure you're logged into LinkedIn
3. Verify your recruiter search URL is correct
4. Check that your OpenAI API key is properly configured
5. Ensure `prompt.txt` is filled with your message template
6. Create an issue on GitHub for bugs

## Important Files

- **`prompt.txt`**: Contains your message template. **Must be edited** with your personalized outreach message for the ChatGPT integration to work properly.
- **`src/helpers/ChatGptHelper.ts`**: Handles communication with OpenAI's ChatGPT API for intelligent message generation.
- **`src/links.json`**: Automatically generated file that tracks contacted recruiters to avoid duplicates.

---

**Remember**: Use this tool responsibly and in accordance with LinkedIn's Terms of Service. Always maintain professionalism in your outreach and focus on building genuine relationships with recruiters. The ChatGPT integration is designed to help personalize your messages, but you should still ensure each message aligns with your career goals and maintains authenticity. 