var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const loggingMiddleware = (req, res, next) => {
  console.log('ip:', req.ip);
  next();
}

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type User {
    id: String
    name: String
  }

  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String!
    author: String!
  }

  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    hello: String,
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(dices: Int!, sides: Int): [Int]
    roll(numRolls: Int!): [Int]
    getDie(numSides: Int): RandomDie
    getMessage(id: ID!): Message
    user(id: String): User
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// This class implements the RandomDie GraphQL type
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

// Maps id to User object
var fakeDatabase = {
  'a': {
    id: 'a',
    name: 'alice',
  },
  'b': {
    id: 'b',
    name: 'bob',
  },
};

// Maps username to content
var fakeDatabase = {};

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
  rollDice: ({dices, sides}) => {
    console.log(dices, sides);
    var output = [];
    for (var i = 0; i < dices; i++) {
      output.push(1 + Math.floor(Math.random() * (sides || 6)));
    }
    return output;
  },
  getDie: ({numSides}) => {
    return new RandomDie(numSides || 6);
  },
  getMessage: ({id}) => {
    console.log(fakeDatabase);
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage: ({input}) => {
    // Create a random id for our "database".
    var id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    console.log(fakeDatabase);
    return new Message(id, input);
  },
  updateMessage: ({id, input}) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
};

var app = express();
app.use(loggingMiddleware);
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// https://github.com/graphql/express-graphql
// graphqlHTTP({
//   schema: GraphQLSchema,
//   graphiql?: ?boolean,
//   rootValue?: ?any,
//   context?: ?any,
//   pretty?: ?boolean,
//   formatError?: ?Function,
//   validationRules?: ?Array<any>,
// }): Middleware
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
