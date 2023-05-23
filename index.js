const { Client, GatewayIntentBits } = require('discord.js');
// const { DISCORD_TOKEN } = require('./config.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        ]
});



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// client.on('interactionCreate', async (interaction) => {
//   if (!interaction.isCommand()) return;

//   if (interaction.commandName === 'ticket') {
//     const tableHeaders = ['board', 'stage', 'assignee', 'level'];
//     const table = `\`\`\`${tableHeaders.join(' | ')}\n-----------------------------------\n${' '.repeat(10)} | ${' '.repeat(7)} | ${' '.repeat(10)} | ${' '.repeat(7)}\`\`\``;

//  await interaction.reply({ content: 'Here is the ticket table:', ephemeral: true });
//     await interaction.followUp({ content: table });  }
// });
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ticket') {
    const tableHeaders = ['board', 'stage', 'assignee', 'level'];
    const table = `\`\`\`${tableHeaders.join(' | ')}\n-----------------------------------\n${' '.repeat(10)} | ${' '.repeat(7)} | ${' '.repeat(10)} | ${' '.repeat(7)}\`\`\``;

    await interaction.reply({ content: 'Please provide the ticket details:', ephemeral: true });

    const collector = interaction.channel.createMessageCollector({ filter: m => m.author.id === interaction.user.id, time: 60000 });

    const ticketDetails = {};

    const processResponse = (response) => {
      const column = tableHeaders[Object.keys(ticketDetails).length];
      ticketDetails[column] = response.content;
      if (Object.keys(ticketDetails).length === tableHeaders.length) {
        collector.stop();
        const ticketRow = tableHeaders.map(header => ticketDetails[header]);
        const ticketRowString = `| ${ticketRow.join(' | ')} |`;
        const updatedTable = `${table}\n${ticketRowString}`;
        interaction.followUp({ content: updatedTable });
      } else {
        interaction.followUp({ content: `Please provide the ${tableHeaders[Object.keys(ticketDetails).length]}:` });
      }
    };

    collector.on('collect', processResponse);

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        interaction.followUp({ content: 'Ticket creation timed out. Please try again.' });
      }
    });
  }
});

client.on('messageCreate', (message) =>
{
    if (message.author.bot) return;
    message.reply({
        content: 'Hi from Bot !',
        
        
    })
})
client.login('MTExMDI3ODg0ODY5MzY3NDA3NA.Gqp_Rt.58HRO4aHSGR5fgZtbywmGAzNHcmM2d2IHB16w8');