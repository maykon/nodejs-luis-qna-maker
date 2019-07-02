const { ActivityHandler } = require('botbuilder');
const { QnAMaker } = require('botbuilder-ai');

class QnABot extends ActivityHandler {
    constructor() {
        super();

        try {
            this.qnaMaker = new QnAMaker({
                knowledgeBaseId: process.env.QnAKnowledgebaseId,
                endpointKey: process.env.QnAEndpointKey,
                host: process.env.QnAEndpointHostName
            });
        } catch (err) {
            console.warn(
                `Ocorreu um erro: ${ err } Verifique as configurações do arquivo .env`
            );
        }

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(
                        'Bem vindo ao DB1-BOT. Faça alguma pergunta e tentarei responder.'
                    );
                }
            }

            await next();
        });

        this.onMessage(async (context, next) => {
            console.log(context);

            const qnaResults = await this.qnaMaker.getAnswers(context);

            if (qnaResults[0]) {
                await context.sendActivity(qnaResults[0].answer);
            } else {
                await context.sendActivity('Nenhuma resposta foi encontrada.');
            }

            await next();
        });
    }
}

module.exports.QnABot = QnABot;
