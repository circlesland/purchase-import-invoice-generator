/**
 * schema.js (Incomplete)
 */
const { makeExecutableSchema } = require('graphql-tools');
const { _authenticate, _authorize } = require('../policies/auth');

// Construct a schema using the GraphQL schema language
const typeDefs = `
  directive @authenticate on FIELD_DEFINITION | FIELD
  directive @authorize(scope: String!) on FIELD_DEFINITION | FIELD

  type Error {
    code: String!
    message: String!
    attrName: String
    row: Int
    moduleError: ModuleError
  }

  type ModuleError {
    code: String!
    message: String!
    attrNames: [String]
  }

  type ErrorResponse {
    errors: [Error]
  }

  # model types will be added here
  # TODO

  type Query {
    # model query declaration will be added here
    # TODO
  }

  type Mutation {
    # model mutation declaration will be added here
    # TODO
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    # model query resolver code will be added here
    # TODO
  },

  Mutation: {
    # model mutation resolver code will be added here
    # TODO
  },

  # model references resolvers code will be added here
  # TODO
};

const directiveResolvers = {
  // Will be called when a @authenticate directive is applied to a field or field definition.
  async authenticate(resolve, parent, directiveArgs, context, info) {
    if (context.user === undefined) {
      user = await _authenticate(context);
      if (user.errors !== undefined) {
        return user; // user authentication failed
      }
    }
    return resolve();
  },

  // Will be called when a @authorize directive is applied to a field or field definition.
  async authorize(resolve, parent, directiveArgs, context, info) {
    if (!await _authorize(context.user, directiveArgs.scope)) {
      return {
        errors: [
          {
            code: 'E_NO_PERMISSION',
            message: 'Expected resource Authorization: ' + directiveArgs.scope
          }
        ]
      };
    }
    return resolve();
  }
};

// Get a GraphQL.js Schema object
module.exports.schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers
});