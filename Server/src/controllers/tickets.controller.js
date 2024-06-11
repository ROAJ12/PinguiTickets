import Ticket from '../models/tickets.model.js';
import Message from '../models/messages.model.js';

export const createTicket = async (req, res) => {
    try {
        const { title, description, image, creatorEmail } = req.body;
        if (!title || !description || !image || !creatorEmail) {
            return res.status(400).send({ error: 'All fields are required.' });
        }
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).send({ message: 'Ticket created successfully.' });
    }  catch (error) {
        let errorMessage = 'Internal server error';
        if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
            res.status(400).json({ error: errorMessage });
        } else {
            console.error(error); 
            res.status(500).json({ error: errorMessage }); 
        }
    }
};

export const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).send(tickets);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).send();
        }
        res.status(200).send(ticket);
    } catch (error) {
        res.status(404).send(error);
    }
};

export const updateTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!ticket) {
            return res.status(404).send();
        }
        res.status(200).send(ticket);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).send();
        }
        res.status(200).send(ticket);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const addMessageToTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).send({ message: 'Ticket not found' });
        }

        const message = new Message({
            ticket: ticket._id,
            sender: req.body.sender,
            content: req.body.content
        });

        await message.save();

        ticket.messages.push(message._id);
        await ticket.save();

        res.status(201).send(message);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getAllMessagesForTicket = async (req, res) => {
    try {

        const ticketId = req.params.id;

        const messages = await Message.find({ ticket: ticketId });

        res.status(200).send(messages);
    } catch (error) {

        res.status(500).send(error);
    }
};
