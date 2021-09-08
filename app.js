const axios = require("axios");
const moment = require("moment");
const colors = require("colors");
const username = process.env.BUTLER_USER;
const password = process.env.BUTLER_PASS;
const butler_api_key = process.env.BUTLER_API_KEY;
const headers = { "Content-Type": "application/json" };

/*  INFO
 * Environment Variables:
 * BUTLER_USER=
 * BUTLER_PASS=
 * DATABASE_URL=
 * BUTLER_API_KEY=
 *
 * getPurchases() - grabs Purchases and inserts into TransactionJob Table
 * createButlerTransactions() - creates Transactions and Invoices through Buchhaltungsbutler API.
 */

let params = process.argv.slice(2);

const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },

  searchPath: "public",
  pool: { min: 0, max: 7 },
});

async function getPurchases() {
  let results = await knex("Purchase")
    .join(
      "IndexedTransaction",
      "IndexedTransaction.id",
      "Purchase.indexedTransactionId"
    )
    .join("Profile", "Profile.id", "Purchase.purchasedByProfileId")
    .join("Offer", "Offer.id", "Purchase.purchasedItemId")
    .select(
      "Purchase.id as purchaseId",
      "Purchase.purchasedItemTitle",
      "Purchase.pricePerUnit",
      "Purchase.purchasedUnits",
      "Purchase.grandTotal",
      "IndexedTransaction.transactionHash",
      "Profile.firstName",
      "Profile.lastName",
      "Offer.id",
      "Offer.title",
      "Offer.description"
    );

  for (row of results) {
    const status = await setTransactionJob(row)
      .then(function (result) {
        console.log("Done.");
      })
      .catch(function (error) {
        console.log(`ERROR! ${error.code}: ${error.detail}`.magenta);
      });
  }
}

async function setTransactionJob(transactionData) {
  const data = [
    {
      transactionhash: transactionData.transactionHash,
      user: `${transactionData.firstName} ${transactionData.lastName}`,
      status: "UNPROCESSED",
      purchaseId: transactionData.purchaseId,
    },
  ];
  console.log(`\nimporting ${transactionData.transactionHash}...`);
  return await knex("TransactionJobs")
    .insert(data)
    .then(function (result) {
      console.log("Imported.".green);
    })
    .catch(function (error) {
      console.log(`Not imported! ${error.code}: ${error.detail}`.magenta);
    });
}

async function createButlerTransactions() {
  let results = await knex("TransactionJobs")
    .join("Purchase", "Purchase.id", "TransactionJobs.purchaseId")
    .select(
      "TransactionJobs.transactionhash",
      "TransactionJobs.status",
      "TransactionJobs.user",
      "Purchase.purchasedItemTitle",
      "Purchase.purchasedAt",
      "Purchase.pricePerUnit",
      "Purchase.purchasedUnits",
      "Purchase.grandTotal",
      "Purchase.purchasedItemVat"
    )
    .where("TransactionJobs.status", "UNPROCESSED");

  for (row of results) {
    const invoice = await insertButlerTransaction(row).then((response) => {
      updateTransactionJobStatus(
        row.transactionhash,
        "TRANSACTION CREATED"
      ).then((updateStatusResponse) => {
        console.log(
          "\nUpdated TransactionJobStatus to TRANSACTION CREATED for ",
          row.transactionhash
        );
      });
    });
  }
}

async function insertButlerTransaction(transactionData) {
  return new Promise(function (resolve, reject) {
    date = new Date(transactionData.purchasedAt);
    transactionData.purchasedAt = moment(date).format("YYYY-MM-DD HH:mm:ss");
    // console.log("BUTLERS: ", transactionData);
    console.log(
      `\nimporting Transaction To Butler:  ${transactionData.transactionhash}...`
    );
    // Get Accounts
    axios
      .post(
        "https://webapp.buchhaltungsbutler.de/api/v1/transactions/add",
        // "http://localhost:1337/butler",
        {
          api_key: butler_api_key,
          account: 1250,
          to_from: transactionData.user,
          amount: transactionData.grandTotal,
          booking_date: transactionData.purchasedAt,
          booking_text: transactionData.purchasedItemTitle,
          purpose: transactionData.transactionhash,
          payment_reference: transactionData.transactionhash,
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
          resolve("Transaction Imported into Butler.");
          updateTransactionJobStatus(
            transactionData.transactionhash,
            "TRANSACTION CREATED"
          )
            .then((resolve) => {
              console.log(
                `\nTransaction Created for ${transactionData.transactionhash}`
                  .green
              );

              insertButlerInvoice(transactionData)
                .then((results) => {})
                .catch((err) => {
                  console.log(err);
                  reject(err);
                });
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log("Error creating Transaction");
        }
        reject(error.response.data.message);
      });
  });
}

function insertButlerInvoice(transactionData) {
  return new Promise(function (resolve, reject) {
    date = new Date(transactionData.purchasedAt);
    transactionData.purchasedAt = moment(date).format("YYYY-MM-DD");

    console.log(
      `\ncreating Invoice in Butler:  ${transactionData.transactionhash}...`
    );
    axios
      .post(
        "https://webapp.buchhaltungsbutler.de/api/v1/invoices/create",
        // "http://localhost:1337/invoice",
        {
          api_key: butler_api_key,

          type: "invoice",
          show_prices_type: "gross",
          company_name: transactionData.user,
          item_name: [transactionData.purchasedItemTitle],
          item_amount: [transactionData.purchasedUnits],
          item_unit: ["Stk."],
          item_vat: [transactionData.purchasedItemVat],
          item_single_price: [transactionData.pricePerUnit],
          contact_person_name: transactionData.user,
          date: transactionData.purchasedAt,
          payment_reference: transactionData.transactionhash,
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
          console.log(
            `\nInvoice Created for ${transactionData.transactionhash}`.green
          );
          updateTransactionJobStatus(
            transactionData.transactionhash,
            "INVOICE CREATED"
          ).then((results) => {
            console.log(
              "\nUpdated TransactionJobStatus to INVOICE CREATED for ",
              transactionData.transactionhash
            );
          });

          resolve("Invoice Created.");
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log("Error creating Invoice  ", error.response.data.message);
        }
        reject(error.response.data.message);
      });
  });
}

function updateTransactionJobStatus(transactionHash, status) {
  return new Promise(function (resolve, reject) {
    knex("TransactionJobs")
      .update("status", status)
      .where("transactionhash", transactionHash)
      .then((results) => {
        resolve("TransactionJob Status updated to ", status);
      })
      .catch((err) => {
        reject("Error setting TransactionJob Status!", err);
      });
  });
}

getPurchases();
