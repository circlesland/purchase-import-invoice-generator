let axios = require("axios");
const username = "basic_income_lab_gmbh";
const password = "LLDA9xoqwxR08CB";
const headers = { "Content-Type": "application/json" };

module.exports = {
  friendlyName: "Butlerapi",

  description: "Butlerapi something.",

  inputs: {
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
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    sails.log("HI");

    axios
      .post(
        "https://webapp.buchhaltungsbutler.de/api/v1/accounts/get",
        {
          api_key:
            "ktdcc4.2a45fc3eq1fl7ak7f4dc79ffQQLFGT8Ca0ba7e59oap8sl848f1f6dc0MVTTAQRL",
          account: 1250,
          to_from: "Herr Rock",
          amount: 12.22,
          booking_date: "2021-08-25 09:00:00",
          booking_text:
            "0xf220996c4ba0bb637f0468dd94a71bba8dc1daa692f1ef38187ce8dd608aa960",
          purpose:
            "0xf220996c4ba0bb637f0468dd94a71bba8dc1daa692f1ef38187ce8dd608aa960",
          payment_reference:
            "0xf220996c4ba0bb637f0468dd94a71bba8dc1daa692f1ef38187ce8dd608aa960",
        },
        {
          auth: {
            username: username,
            password: password,
          },
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data) {
          sails.log(response.data);
        }
      })
      .catch(function (error) {
        if (error.response) {
          sails.log(error.response.data);
          sails.log(error.response.status);
        }
      });
  },
};
