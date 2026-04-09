module.exports = (mongoose) => {
  const Reservations = mongoose.model(
    'reservations',
    mongoose.Schema({
      firstName: String,
      lastName: String,
      pseudonym: String,
      birthDate: String,
      deathDate: String,
      nationality: String,
      mainGenre: String,
      books: [String],
    }),
  );

  return Reservations;
};
