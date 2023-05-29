const express = require('express');
const { ASSIGNEE_URL } = require('./config.js');
const axios = require('axios');
const Ticket = require('./model.js');
const router = express.Router();
const app=express();



// Route to create a new ticket



// Route to retrieve a ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;

    // Find the ticket by its ID using the Ticket model
    const ticket = await Ticket.findById(ticketId);

    // If the ticket is not found, return a 404 response
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error retrieving ticket:', error);
    res.status(500).json({ error: 'Failed to retrieve ticket' });
  }
};


// Endpoint to get a ticket by assignee
exports.getTicketByAssignee= async (req, res) => {
  try {
    const assignee = req.params.assignee;

    // Make a request to the API to get the ticket information based on the assignee
    const response = await axios.get(`https://api.example.com/tickets?assignee=${assignee}`);

    // Extract the ticket data from the API response
    const ticket = response.data;

    res.json(ticket);
  } catch (error) {
    console.error('Error retrieving ticket:', error);
    res.status(500).json({ error: 'Failed to retrieve ticket' });
  }
};








// // Definning table data
// const tableData = {
//   board: 'Sample Board',
//   stage: 'In Progress',
//   assignee: 'John Doe',
//   level: 'High',
// };

// // Endpoint for the "board" column
// app.get('/board', (req, res) => {
//   res.json({ column: 'board', value: tableData.board });
// });

// // Endpoint for the "stage" column
// app.get('/stage', (req, res) => {
//   res.json({ column: 'stage', value: tableData.stage });
// });

// // // Endpoint for the "assignee" column
// // app.get('/assignee', (req, res) => {
// //   res.json({ column: 'assignee', value: tableData.assignee });
// // });


// app.post('/tickets', async (req, res) => {
//   try {
//     // Extract the ticket data from the request body
//     const { board, stage, assignee, level } = req.body;

//     // Create a new ticket using the Ticket model
//     const ticket = new Ticket({ board, stage, assignee, level });
    
//     // Save the ticket to the database
//     await ticket.save();

//     // Return the created ticket as the response
//     res.status(201).json(ticket);
//   } catch (error) {
//     // Handle errors if the ticket creation fails
//     console.error('Error creating ticket:', error);
//     res.status(500).json({ error: 'Failed to create ticket' });
//   }
// });




// // Endpoint for the "assignee" column
// app.get('/assignee', async (req, res) => {
//   try {
//     // Fetch the assignee from the API link
//     const response = await axios.get(ASSIGNEE_URL);

//     // Extract the assignee value from the API response
//     const assignee = response.data.assignee;

//     // Return the assignee value in the response
//     res.json({ column: 'assignee', value: assignee });
//   } catch (error) {
//     // Handle errors if the API request fails
//     console.error('Error retrieving assignee:', error);
//     res.status(500).json({ error: 'Failed to retrieve assignee' });
//   }
// });



// // // Endpoint for the "level" column
// // app.get('/level', (req, res) => {
// //   res.json({ column: 'level', value: tableData.level });
// // });


// exports.router = router;