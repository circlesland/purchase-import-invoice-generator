const GraphAPI = "https://api.thegraph.com/subgraphs/name/circlesubi/circles";
let { gql } = require("graphql-tag");
let axios = require("axios");

export const ProfilesByCirclesAddressDocument = gql`
  query profilesByCirclesAddress($circlesAddresses: [String!]!) {
    profiles(query: { circlesAddress: $circlesAddresses }) {
      id
      circlesAddress
      firstName
      lastName
      dream
      country
      avatarUrl
      avatarCid
      avatarMimeType
      cityGeonameid
      city {
        geonameid
        name
        country
        latitude
        longitude
        population
      }
    }
  }
`;

module.exports = {
  friendlyName: "Circles user data",

  description: "",

  inputs: {
    safeAddress: {
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
    let token = "0x4a9aFfA9249F36fd0629f342c182A4e94A13C2e0";

    let safeAddresses = [token];

    let graph = axios
      .post(
        GraphAPI,
        JSON.stringify({
          query: gql`
        query profilesByCirclesAddress(${safeAddresses}: [String!]!) {
          profiles(query: { circlesAddress: ${safeAddresses} }) {
            id
            circlesAddress
            firstName
            lastName
            dream
            country
            avatarUrl
            avatarCid
            avatarMimeType
            cityGeonameid
            city {
              geonameid
              name
              country
              latitude
              longitude
              population
            }
          }
        }
      `,
          variables: {
            circlesAddresses: safeAddresses.map((o) => o.toLowerCase()),
          },
        }),
        {}
      )
      .then((response) => {
        sails.log(response.status, response.statusText);

        if (response.data) {
          sails.log(response.data);
        }
        // sails.log(response.status);
        // sails.log(response.statusText);
        // sails.log(response.headers);
        // sails.log(response.config);
      })
      .catch(function (error) {
        if (error.response) {
          sails.log(error.response.data);
          sails.log(error.response.status);
          // sails.log(error.response.headers);
        }
      });
  },
};
