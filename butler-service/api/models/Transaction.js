/**
 * Transaction.js
 *
 * @description :: A model definition representing the buchhaltungsbutlers transaction fields.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    api_key: {
      type: "string",
      defaultsTo:
        "ktdcc4.2a45fc3eq1fl7ak7f4dc79ffQQLFGT8Ca0ba7e59oap8sl848f1f6dc0MVTTAQRL",
    },
    account: {
      type: "number",
      columnType: "FLOAT",
      defaultsTo: 1250,
    },
    to_from: {
      type: "string",
      required: true,
    },
    amount: {
      type: "number",
      columnType: "FLOAT",
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
  customToJSON: function () {
    return _.omit(this, ["api_key", "account"]);
  },
};
sails.config.models.migrate = "drop";
