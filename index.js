const path = require('path');
const restify = require('restify');
const { BotFrameworkAdapter } = require('botbuilder');

const { QnABot } = require('./bots/QnABot');

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError]: ${ error }`);
    await context.sendActivity(`Opa. Aconteceu algum problema!`);
};

const bot = new QnABot();

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`\n${ server.name } rodando em ${ server.url }`);
});

server.post('/api/messages', (req, res) => {
    console.log(req.body);
    adapter.processActivity(req, res, async turnContext => {
        await bot.run(turnContext);
    });
});
