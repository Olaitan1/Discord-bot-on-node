const { REST, Routes } = require ('discord.js');
const commands = [
  {
    name: 'ticket',
    description: 'Replies with an issue',
  },
];

const rest = new REST({ version: '10' }).setToken('MTExMDI3ODg0ODY5MzY3NDA3NA.Gqp_Rt.58HRO4aHSGR5fgZtbywmGAzNHcmM2d2IHB16w8');


(async () => {
try
{
  console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commands
    });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
})();