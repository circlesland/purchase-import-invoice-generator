const GraphAPI = "https://api.thegraph.com/subgraphs/name/circlesubi/circles";

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
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
  fn: async function (_, exits) {
    // utilService.axios
    //   .post(
    //     "https://webapp.buchhaltungsbutler.de/api/v1/accounts/get",
    //     {
    //       api_key:
    //         "ktdcc4.2a45fc3eq1fl7ak7f4dc79ffQQLFGT8Ca0ba7e59oap8sl848f1f6dc0MVTTAQRL",
    //       account: 1250,
    //       to_from: "Herr Rock",
    //       amount: 12.22,
    //       booking_date: "2021-08-25 09:00:00",
    //       booking_text:
    //         "0xf220996c4ba0bb637f0468dd94a71bba8dc1daa692f1ef38187ce8dd608aa960",
    //       purpose:
    //         "0xf220996c4ba0bb637f0468dd94a71bba8dc1daa692f1ef38187ce8dd608aa960",
    //       payment_reference:
    //         "0xf220996c4ba0bb637f0468dd94a71bba8dc1daa692f1ef38187ce8dd608aa960",
    //     },
    //     {
    //       auth: {
    //         username: username,
    //         password: password,
    //       },
    //       headers: headers,
    //     }
    //   )
    //   .then((response) => {
    //     if (response.data) {
    //       console.log(response.data);
    //     }
    //   })
    //   .catch(function (error) {
    //     if (error.response) {
    //       console.log(error.response.data);
    //       console.log(error.response.status);
    //     }
    //   });
    await sails.helpers.butlerapi();
    // var transaction = await Transaction.findOne({ id: transactionId });

    // If no transaction was found, respond "notFound" (like calling `res.notFound()`)
    // if (!transaction) {
    //   throw "notFound";
    // }
    exits.success({ message: "LogRocket Sails API 2002" });
  },
};
