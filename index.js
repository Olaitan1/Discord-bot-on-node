const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
// const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const axios = require('axios');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { DISCORD_TOKEN } = require('./config');
const { MONGODB_URL } = require('./config');
// const { getTicketById, getTicketByAssignee} = require('./controller.js');
const Ticket = require('./model')

const { REST, Routes } = require('discord.js');
const { CLIENT_ID } = require('./config');



// // // const getTicketById = require('./controller.js');
// // // const getTicketByAssignee = require('./controller.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        ]
});



client.on('ready', () =>
{
  const express = require('express');
  const app = express();
  const port = 3000;
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
  
});

client.on('messageCreate', (message) =>
{
  if (message.author.bot) return;
  message.reply({
    content: 'Hi from Bot !',
  })
});
  
  client.login(DISCORD_TOKEN);
  
 mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
 
  const commands = [
    {
      name: 'ticket',
      description: 'Replies with an issue',
      options: [
        {
          name: 'board',
          description: 'The board to create the ticket in',
          type: 3,
          required: true,
        },
        {
          name: 'stage',
          description: 'The stage of the ticket',
          type: 3,
          required: true,
        },
        {
          name: 'assignee',
          description: 'The user to assign the ticket to',
          type: 6,
          required: true,
        },
        {
          name: 'level',
          description: 'The level of the ticket',
          type: 3,
          required: true,
        }
      ],
    },
    {
      name: 'get-ticket',
      description: 'Replies with a ticket',
      options: [
        {
          name: 'id',
          description: 'The id of the ticket',
          type: 3,
          required: true,
        }
      ]
    }
  ];

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

 (async () =>
  {
    try
    {
      console.log('Started refreshing application (/) commands.');

      await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commands,
      });

      console.log('Successfully reloaded application (/) commands.');
    } catch (error)
    {
      console.error('Error refreshing application (/) commands:', error);
    }
})();
const saveTicketToDatabase = async (ticketDetails) =>
{
  try {
    console.log('Saving ticket to the database:', ticketDetails);

    const newTicket = new Ticket(ticketDetails);
    await newTicket.save();
    console.log('Ticket saved:', newTicket);

  } catch (error) {
    console.error('Error saving ticket to the database:', error);
  }
 
};
const getTicketById = async (ticketId) => {
  try {
    // Assuming you have a Ticket model defined and imported from your MongoDB schema
    const ticket = await Ticket.findById(ticketId);
    return ticket;
  } catch (error) {
    console.error('Error retrieving ticket:', error);
    return null;
  }
};


client.on('interactionCreate', async (interaction) =>
{
  if (!interaction.isCommand()) return;
  const { commandName, options } = interaction;
  if (interaction.commandName === 'ticket')
  {
    const tableHeaders = ['board', 'stage', 'assignee', 'level'];
    const ticketDetails = {
      board: interaction.options.getString('board'),
      stage: interaction.options.getString('stage'),
      assignee: interaction.options.getUser('assignee').id,
      level: interaction.options.getString('level'),
    };

    const table = `\`\`\`${tableHeaders.join(' | ')}\n-----------------------------------\n${' '.repeat(
      10
    )} | ${' '.repeat(7)} | ${' '.repeat(10)} | ${' '.repeat(7)}\`\`\``;

    const processResponse = async (response) =>
    {
      const column = tableHeaders[Object.keys(ticketDetails).length];
      ticketDetails[column] = response.content;

      if (Object.values(ticketDetails).length === tableHeaders.length)
      {
        const ticketRow = Object.values(ticketDetails).join(' | ');
        const ticketRowString = `| ${ticketRow} |`;
        const updatedTable = `${table}\n${ticketRowString}`;

        // All inputs collected, proceed with creating the ticket
        await interaction.followUp({ content: updatedTable });

        // Save ticketDetails to the database or perform any other required actions

        await interaction.followUp({ content: 'Ticket creation complete!', ephemeral: true });
      }
    };

    // Send initial response with the table headers and the first input
    const nextColumn = tableHeaders[Object.keys(ticketDetails).length];
    await interaction.reply({
      content: `Here is the ticket table:\n${table}\nTicket details: ${JSON.stringify(ticketDetails).split(' ')}`,
      ephemeral: true,
    });

    const filter = (response) => response.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
      max: tableHeaders.length,
      time: 60000,
    });
    await saveTicketToDatabase(ticketDetails)

    await interaction.followUp({ content: 'Ticket creation complete!', ephemeral: true });
    
  // }else 
  //   if (interaction.commandName === 'get-ticket')
  //   {
  
  //     const ticketId = interaction.options.getString('ticketId');

  //     // Call the getTicketById function or perform any other required actions to retrieve the ticket
  //     const ticket = await getTicketById(ticketId);
  //     if (ticket)
  //     {
  //       await interaction.reply(ticket);
  //     } else
  //     {
  //       // If the ticket is not found, send a response indicating that the ticket does not exist
  //       await interaction.reply('Ticket not found');
  //     }
    }
  })

app.get('/tickets/:id', async (req, res) =>
{
  const ticketId = req.params.id;
  const ticket = await getTicketById(ticketId);
  if (ticket)
  {
    res.send(ticket);
  } else
  {
    res.status(404).send('Ticket not found');
  }
});


   app.use(express.json());
   // Start the server
  app.listen(port, () =>
  {
    console.log(`Server running on port ${port}`);
  })