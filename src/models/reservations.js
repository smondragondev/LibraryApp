module.exports = (mongoose) => {
  const Reservations = mongoose.model(
    'reservations',
    mongoose.Schema({
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books',   
        required: true,
      },
      contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contacts',   
        required: true,
      },
      issuedDate: {
        type: Date,
        required: true,
      },
      returnedDate: {
        type: Date
      },
      status: {
        type: String,
        enum: ['active','returned','overdue'],
        default: 'active'
      }
    }, {timestamp: true}),
  );

  return Reservations;
};
