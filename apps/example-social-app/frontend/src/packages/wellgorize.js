export const wellgorize = (posts) => {
  // TODO: INSERT A MORE INTELLIGENT ALGORITHM HERE
  return posts.sort(() => Math.random() - 0.5);
};
