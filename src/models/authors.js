module.exports = (mongoose) => {
  const Authors = mongoose.model(
    'authors',
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

  return Authors;
};
