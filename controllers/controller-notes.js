const Note = require('../models/Note');
const Trip = require('../models/Trip');

/**
 * Create note controller, it accepts a note object from req.body 
 * and gets the trip ID from the URL parameter, does validation 
 * and saves everythin to the database.
 * @param {object} req request object from express router
 * @param {object} res response object from express router
 * @method POST
 * @route /trips/:id/notes
 * @access Private
 */
exports.createNote = async (req, res) => {
  try {
		let { note } = req.body;
		let trip = await Trip.findById(req.params.id);

    // Checking note fields if they are not empty
		if (!note.title || !note.note) {
			throw {
				status: 401,
				message: 'Missing note fields',
			};
    }
    
    // Checking if trip ID is a valid ID
		if (!trip) {
			throw {
				status: 401,
				message: 'No trip found',
			};
		}

    // Creating a new note
		const newNote = new Note({ ...note });

    // Adding not to the trip
		trip.notes.push(newNote._id);

    // Saving note and updated trip
		trip.save();
		newNote.save();

		// 201 Created
		return res.status(201).json({
			message: 'Note created and assigned to trip',
			note,
    });
    
	} catch (error) {

    if (error.status) {
      const { status, message } = error;
      return res.status(status).json({
        status,
        message
      })
    }

    return res.status(500).send('Server error');
  }
}