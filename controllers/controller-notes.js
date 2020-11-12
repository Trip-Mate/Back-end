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

exports.updateNote = async (req, res) => {
	// console.log(req.body)
	try {
		const note = await Note.findByIdAndUpdate({ _id: req.params.noteId }, { title:req.body.title, note: req.body.note })

		if (!note) {
			throw {
				status: 404, 
				message: 'No note found'
			}
		}

		return res.status(200).json({
			status: 200,
			message: "Note updated successfully",
			note: req.body
		})

	} catch (error) {
		
		if (error.status) {
			const { status, message } = error;
			return res.status(status).json({
				status,
				message,
			});
		}

		return res.status(500).send('Server error');
	}
}

exports.deleteNote = async (req, res) => {
	// console.log(req.params)
	try {
	
		let trip = await Trip.findById(req.params.id);
		await Note.findByIdAndDelete(req.params.noteId)

		// Checking if trip ID is a valid ID
		if (!trip) {
			throw {
				status: 401,
				message: 'No trip found',
			};
		}

		// console.log(trip.notes.length)

		if (trip.notes.length !== 0) {
			// If the note was assigned to a trip delete note_id from the array
			await Trip.updateMany(
				{ notes: { $in: req.params.noteId } },
				{ $pull: { notes: { $in: req.params.noteId } } }
			);

			// 200 Deleted
			return res.status(200).json({
				status: 200,
				message: 'Note deleted'
			});
		}
	} catch (error) {
		if (error.status) {
			const { status, message } = error;
			return res.status(status).json({
				status,
				message,
			});
		}

		return res.status(500).send('Server error');
	}
};