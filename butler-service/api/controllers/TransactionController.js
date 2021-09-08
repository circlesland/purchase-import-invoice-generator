/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  friendlyName: "Welcome transaction",

  description:
    "Look up the specified transaction and welcome them, or redirect to a signup page if no transaction was found.",

  inputs: {
    transactionId: {
      description: "The ID of the transaction to look up.",
      // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
      // if the `transactionId` parameter is not a number.
      type: "number",
      // By making the `transactionId` parameter required, Sails will automatically respond with
      // `res.badRequest` if it's left out.
      required: true,
    },
    api_key: {
      type: "string",
    },
    account: {
      type: "number",
    },
    to_from: {
      type: "string",
      required: true,
    },
    amount: {
      type: "number",
      required: true,
    },
    booking_date: {
      type: "string",
      required: true,
    },
    booking_text: {
      type: "string",
      required: true,
    },
    purpose: {
      type: "string",
      required: true,
    },
    payment_reference: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      statusCode: 201,
      description: "New transaction created",
    },
    notFound: {
      description:
        "No transaction with the specified ID was found in the database.",
      responseType: "notFound",
    },
    error: {
      description: "Something went wrong",
    },
  },

  fn: async function ({ transactionId }) {
    // Look up the transaction whose ID was specified in the request.
    // Note that we don't have to validate that `transactionId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    var transaction = await Transaction.findOne({ id: transactionId });

    // If no transaction was found, respond "notFound" (like calling `res.notFound()`)
    if (!transaction) {
      throw "notFound";
    }

    // Display a personalized welcome view.
    return {
      name: transaction.name,
    };
  },
};
