const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
// const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const { DISCORD_TOKEN } = require('./config');
const { MONGODB_URL } = require('./config');
const { getTicketById, getTicketByAssignee} = require('./controller.js');
const Ticket = require('./model')




// // // const getTicketById = require('./controller.js');
// // // const getTicketByAssignee = require('./controller.js');

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

// // // client.on('interactionCreate', async (interaction) => {
// // //   if (!interaction.isCommand()) return;

// // //   if (interaction.commandName === 'ticket') {
// // //     const tableHeaders = ['board', 'stage', 'assignee', 'level'];
// // //     const table = `\`\`\`${tableHeaders.join(' | ')}\n-----------------------------------\n${' '.repeat(10)} | ${' '.repeat(7)} | ${' '.repeat(10)} | ${' '.repeat(7)}\`\`\``;

// // //  await interaction.reply({ content: 'Here is the ticket table:', ephemeral: true });
// // //     await interaction.followUp({ content: table });  }
// // // })

client.on('messageCreate', (message) =>
{
  if (message.author.bot) return;
  message.reply({
    content: 'Hi from Bot !',
        
        
  })
  })
  client.login(DISCORD_TOKEN);



  // Connect to MongoDB
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() =>
    {
      console.log('Connected to MongoDB');
    })
    .catch((error) =>
    {
      console.error('MongoDB connection error:', error);
    });

  app.use(express.json());

  // // Define the createTicket function outside the handlers
  // // const createTicket = async (ticketData) => {
  // //   try {
  // //     const { board, stage, assignee, level } = ticketData;

  // //     // Create a new ticket using the Ticket model with the retrieved assignee value
  // //     const ticket = new Ticket({ board, stage, assignee, level });

  // //     // Save the ticket to the database
  // //     await ticket.save();

  // //     // Return the created ticket
  // //     return ticket;
  // //   } catch (error) {
  // //     console.error('Error creating ticket:', error);
  // //     throw new Error('Failed to create ticket');
  // //   }
  // // };

  // // // Discord interaction handler
  // client.on('interactionCreate', async (interaction) => {
  //   if (!interaction.isCommand()) return;

  //   if (interaction.commandName === 'ticket') {
  //     const { board, stage, assignee, level } = interaction.options.data[0].options;

  //     const ticketData = {
  //       board: board.value,
  //       stage: stage.value,
  //       assignee: assignee.value,
  //       level: level.value,
  //     };

  //     await interaction.reply({ content: 'Please provide the ticket details:', ephemeral: true });

  //     const collector = interaction.channel.createMessageCollector({ filter: m => m.author.id === interaction.user.id, time: 60000 });

  //     const processResponse = async (response) => {
  //       const column = response.channel.id;
  //       ticketData[column] = response.content;
  //       if (Object.keys(ticketData).length === 5) {
  //         collector.stop();
  //         try {
  //           const ticket = await createTicket(ticketData);

  //           // Send the ticket information as a reply
  //           const replyEmbed = new Discord.MessageEmbed()
  //             .setTitle('New Ticket Created')
  //             .addField('Board', ticket.board)
  //             .addField('Stage', ticket.stage)
  //             .addField('Assignee', ticket.assignee)
  //             .addField('Level', ticket.level)
  //             .setColor('#00ff00')
  //             .setTimestamp();

  //           await interaction.followUp({ embeds: [replyEmbed] });
  //         } catch (error) {
  //           await interaction.followUp({ content: 'Error creating ticket. Please try again.' });
  //         }
  //       } else {
  //         const nextColumn = ['board', 'stage', 'assignee', 'level'][Object.keys(ticketData).length];
  //         await interaction.followUp({ content: `Please provide the ${nextColumn}:` });
  //       }
  //     };

  //     collector.on('collect', processResponse);

  //     collector.on('end', (collected, reason) => {
  //       if (reason === 'time') {
  //         interaction.followUp({ content: 'Ticket creation timed out. Please try again.' });
  //       }
  //     });
  //   }
  // });
  // // Route for creating a ticket
  // app.post('/tickets', async (req, res) => {
  //   try {
  //     const { board, stage, assignee, level } = req.body;

  //     const ticketData = {
  //       board,
  //       stage,
  //       assignee,
  //       level,
  //     };

  //     const newTicket = await createTicket(ticketData);

  //     // Send the ticket information as the response
  //     res.status(201).json(newTicket);
  //   } catch (error) {
  //     console.error('Error creating ticket:', error);
  //     res.status(500).json({ error: 'Failed to create ticket' });
  //   }
  // });

  // client.on('interactionCreate', async (interaction) => {
  //   if (!interaction.isCommand()) return;

  //   if (interaction.commandName === 'ticket') {
  //     try {
  //       // Extract the message content from req.body
  //       const { message } = req.body;

  //       // Access the required fields from the message object
  //       const { board, stage, assignee, level } = message;

  //       const ticketData = {
  //         board,
  //         stage,
  //         assignee,
  //         level,
  //       };

  //       const newTicket = await createTicket(ticketData);

  //     } catch (error) {
  //       console.error('Error processing ticket command:', error);
  //       interaction.reply({ content: 'An error occurred while processing the ticket command.', ephemeral: true });
  //     }
  //   }
  // });


  // const ticketData = {
  //   board: '',
  //   stage: '',
  //   assignee: '',
  //   level: ''
  // };
  app.post('/tickets', async (req, res) => {
    try {
      const { board, stage, assignee, level } = req.body;

      const ticketData = {
        board,
        stage,
        assignee,
        level,
      };

      const newTicket = await createTicket(ticketData);

      // Send the ticket information as the response
      res.status(201).json(newTicket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  });

//   client.on("messageCreate", async (message) =>
//   {
//     if (message.author.bot) return; // Ignore messages from bots

//     // Check if the message content matches the ticket command
//     if (message.content.toLowerCase() === '!ticket')
//     {
//       try
//       {
//         // Reply to the user to start collecting ticket details
//         await message.reply('Please provide the ticket details. Type `done` when finished.');

//         // Filter to listen for the user's response in the same channel
//         const filter = (m) => m.author.id === message.author.id && m.channel.id === message.channel.id;

//         // Wait for the user's response
//         while (true)
//         {
//           const response = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });

//           // Get the first message from the response
//           const userMessage = response.first();

//           // Check if the user wants to finish providing ticket details
//           if (userMessage.content.toLowerCase() === 'done')
//           {
//             break; // Exit the loop if user types "done"
//           }

//           // Extract the ticket details from the user's message content
//           const { field, value } = parseMessageContent(userMessage.content);

//           // Update the ticketData object with the new information
//           if (field && ticketData.hasOwnProperty(field))
//           {
//             ticketData[field] = value;
//           }
//         }

//         // Process the ticketData and create a ticket
//         const newTicket = await createTicket(ticketData);


//         // Reply with the ticket information
//         await message.channel.send(`Ticket created!

// Title: ${ticketData.title}

// Description: ${ticketData.description}

// Assigned to: ${ticketData.assignedTo}

// Status: ${ticketData.status}`);
//       } catch (error)
//       {
//         console.error('Error processing ticket command:', error);
//         message.reply('An error occurred while processing the ticket command.');
//       }
//     }
//   });

//   // Function to parse the message content and extract field and value
//   function parseMessageContent(content)
//   {
//     // Assuming the message content is in the format: field: value
//     const [field, ...values] = content.split(':').map((str) => str.trim());
//     const value = values.join(':').trim();

//     return { field, value };
//   }

  // // app.get('/tickets/:id', getTicketById);
  // // app.get('/tickets/assignee/:assignee', getTicketByAssignee);


client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ticket') {
    try {
      const board = interaction.options.getString('board');
      const stage = interaction.options.getString('stage');
      const assignee = interaction.options.getUser('assignee');

      // Make a request to your API endpoint to save the ticket to the database
      await axios.post('http://localhost:3000/api/tickets', { board, stage, assignee });

      await interaction.reply({ content: 'Ticket created and saved to the database.', ephemeral: true });
    } catch (error) {
      console.error('Error creating and saving ticket:', error);
      await interaction.reply({ content: 'An error occurred while creating and saving the ticket.', ephemeral: true });
    }
  }
});

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });



