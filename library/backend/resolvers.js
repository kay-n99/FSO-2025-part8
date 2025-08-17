const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");
const User = require("./models/user");
const Book = require("./models/book");
const Author = require("./models/author");
const pubsub = require("./pubsub");
const JWT_SECRET = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (root, args) => {
      let filter = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          return [];
        }
        filter.author = author._id;
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }
      return Book.find(filter).populate("author");
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      // const book = { ...args, id: uuid()}
      // books = books.concat(book)
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "Unauthenticated" },
        });
      }
      try {
        const existingAuthor = await Author.findOne({ name: args.author });

        let author;
        if (existingAuthor) {
          author = existingAuthor;
        } else {
          author = new Author({ name: args.author });
          await author.save();
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id, 
        });

        await book.save();
        const savedBook = await book.populate("author");

        pubsub.publish("BOOK_ADDED", { bookAdded: savedBook });
        return savedBook;
      } catch (error) {
        throw new GraphQLError("saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not Authenticated", {
          extensions: { code: "Unaunticated" },
        });
      }
      try {
        const author = await Author.findOne({ name: args.name });
        if (!author) {
          throw new GraphQLError(`Author ${args.name} not found`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        author.born = args.born;
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError("Editing author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error: error.message,
          }``,
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      try {
        return await user.save();
      } catch (error) {
        throw new GraphQLError("Creating user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error: error.message,
          },
        });
      }
    },
    login: async (root, args) => {
      if (args.password !== "secret") {
        throw new GraphQLError("Wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const user = await User.findOne({ username: args.username });
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const userForToken = { username: user.username, id: user._id };
      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
