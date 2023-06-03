const { REST, Routes } = require('discord.js');
const { DISCORD_TOKEN } = require('./config');
const { CLIENT_ID } = require('./config');


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
];



const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

const saveTicketToDatabase = async (ticketDetails) => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URL);
    const db = client.db('mysatabase');
    const ticketsCollection = db.collection('tickets');
    await ticketsCollection.insertOne(ticketDetails);
    client.close();
    
  } catch (error) {
    console.error('Error saving ticket to the database:', error);
  }
};

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error refreshing application (/) commands:', error);
  }
})();
