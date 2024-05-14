require("dotenv").config();
const { App } = require("@slack/bolt");
const { getDeals, searchDealByName } = require("./pipe2");
// const { getDeals } = require("./pipe");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

app.command("/gettotals", async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();
  const [startDate, interval, amount] = command.text.split(" ");
  const { totals } = await getDeals(startDate, interval, amount);

  // await say(`Estos son las stats: <@${command.user_id}>${totals}`);

  console.log(totals);

  const orderedKeys = Object.keys(totals).sort((a, b) => a - b);
  console.log(orderedKeys);

  async function sendStats() {
    const month = {
      0: "Enero",
      1: "Febrero",
      2: "Marzo",
      3: "Abril",
      4: "Mayo",
      5: "Junio",
      6: "Julio",
      7: "Agosto",
      8: "Septiembre",
      9: "Octubre",
      10: "Noviembre",
      11: "Diciembre",
    }
    for (const key of orderedKeys) {
      await say({ blocks: [{ type: "divider" }] });
      const period = totals[key];
      console.log(period);
      let currentMonth = month[key];
      console.log(currentMonth);
      
      await say({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Mes: ${currentMonth}*`,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Count:*\n${period.count}`,
              },
              {
                type: "mrkdwn",
                text: `*Values:*\n $${period.values.MXN}`,
              },
              {
                type: "mrkdwn",
                text: `*Weighted Values:*\n $${period.weighted_values.MXN}`,
              },
              {
                type: "mrkdwn",
                text: `*Open Count:*\n${period.open_count}`,
              },
              {
                type: "mrkdwn",
                text: `*Open Values:*\n $${period.open_values.MXN}`,
              },
              {
                type: "mrkdwn",
                text: `*Weighted Open Values:*\n $${period.weighted_open_values.MXN}`,
              },
              {
                type: "mrkdwn",
                text: `*Won Count:*\n${period.won_count}`,
              },
              {
                type: "mrkdwn",
                text: `*Won Values:*\n $${period.won_values.MXN}`,
              },
            ],
          },
        ],
      });
    }
  }
  sendStats();
});

app.command("/test", async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();
  console.log({ command });
  // await say(`Hello, <@${command.user_id}>!`);
});

app.command("/getdeal", async ({ command, body, ack, say }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call the users.info method using the built-in WebClient
    console.log(command.text);

    const result = await searchDealByName(command.text);
    console.log(result);
    await say(`Estos son los detalles del deal: ${result.title} 
      valor: ${result.value}
      moneda: ${result.currency}
      estado: ${result.status}
      fase: ${result.stage.name}
      cliente: ${result.person.name}
      <@${command.user_id}>
    `);
  } catch (error) {
    console.error(error);
  }
});

app.command("/ticket", async ({ ack, body, client, logger }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        // View identifier
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: "Modal title",
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Welcome to a modal with _blocks_",
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Click me!",
              },
              action_id: "button_abc",
            },
          },
          {
            type: "input",
            block_id: "input_c",
            label: {
              type: "plain_text",
              text: "What are your hopes and dreams?",
            },
            element: {
              type: "plain_text_input",
              action_id: "dreamy_input",
              multiline: true,
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  // Start your app
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();
