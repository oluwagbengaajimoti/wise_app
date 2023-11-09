const axios = require("axios");

module.exports.createPayment = async (req, res, next) => {
  const host = process.env.wise_host;
  const payment = req.body.payment;
  const apiKey = process.env.apiKey;

  let profile_id = "";
  let quote_id = "";
  let recipient_account_id = "";
  let GUID = "";
  let transfer_id = "";
  let balanceTransactionId = "";
  let quote_uuid = "";

  try {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    // 1. Get profile list

    await axios
      .get(`${host}/v1/profiles`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          profile_id = response.data[0].id;
        } else {
          return res.status(401).json({ error: "Unauthorized User" });
        }
      })
      .catch((profile_err) => {
        throw profile_err;
      });

    //2. Create quote

    const quote_data = {
      source: payment.currency,
      target: payment.currency,
      sourceAmount: payment.price,
      targetAmount: null,
      rateType: "FIXED",
      profile: profile_id,
    };

    try {
      const response = await axios.post(`${host}/v1/quotes`, quote_data, {
        headers,
      });

      const response2 = await axios.post(`${host}/v2/quotes`, quote_data, {
        headers,
      });

      if (response.status === 200) {
        quote_id = response.data.id;
        quote_uuid = response2.data.id;
      } else {
        return res.status(403).json({ error: "Bad Request" });
      }
    } catch (quote_error) {
      throw quote_error;
    }

    // 2. Choose/create recipient & 3. Create account

    try {
      const response = await axios.get(
        `${host}/v1/accounts?currency=${payment.currency}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (response.status === 200) {
        //   recipient_account_id = response.data[0].id;
        // } else {
        try {
          const response_res = await axios.get(
            `${host}/v1/quotes/${quote_id}/account-requirements`,
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Accept-Minor-Version": 1,
              },
            }
          );

          if (response_res.status === 200) {
            try {
              const response_res_res = await axios.post(
                `${host}/v1/quotes/${quote_id}/account-requirements`,
                {
                  type: process.env.bank_type,
                  details: {
                    legalType: "PRIVATE", ///Optional
                    address: {
                      country: process.env.country,
                    },
                  },
                },
                { headers }
              );

              if (response_res_res.status === 200) {
                const data = {
                  accountHolderName:
                    payment.first_name + " " + payment.last_name,
                  currency: payment.currency,
                  type: process.env.bank_type,
                  details: {
                    address: {
                      city: process.env.city,
                      countryCode: process.env.country,
                      postCode: process.env.postCode,
                      state: process.env.state,
                      firstLine: process.env.firstLine,
                    },
                    legalType: process.env.legalType,
                    abartn: process.env.abartn,
                    accountType: process.env.accountType,
                    accountNumber: process.env.accountNumber,
                    email: process.env.email,
                  },
                };

                try {
                  const accountRes = await axios.post(
                    `${host}/v1/accounts`,
                    data,
                    { headers }
                  );

                  if (accountRes.status === 200) {
                    recipient_account_id = accountRes.data.id;
                  } else {
                    return res.status(401).json({ error: "Unauthorized User" });
                  }
                } catch (accounts_err1) {
                  throw accounts_err1;
                }
              } else {
                return res.status(401).json({ error: "Unauthorized User" });
              }
            } catch (accounts_err2) {
              throw accounts_err2;
            }
          } else {
            return res.status(401).json({ error: "Unauthorized User" });
          }
        } catch (accounts_err3) {
          throw accounts_err3;
        }
      }
    } catch (accounts_err4) {
      throw accounts_err4;
    }

    /// Create transfer

    /// 1. Generate GUID for idempotency
    try {
      const response = await axios.get(
        `https://www.uuidgenerator.net/api/guid`,
        {
          Authorization: `Bearer ${apiKey}`,
        }
      );

      if (response.status === 200) {
        GUID = response.data;
      } else {
        return res.status(401).json({ error: "Unauthorized User" });
      }
    } catch (guid_error) {
      return res.status(500).json({ error: guid_error });
    }

    //2. Get transfer extra info dynamic form

    try {
      const response = await axios.post(
        `${host}/v1/transfer-requirements`,
        {
          targetAccount: recipient_account_id,
          quoteUuid: quote_uuid,
        },
        { headers }
      );

      if (response.status === 200) {
        const response_res = await axios.post(
          `${host}/v1/transfer-requirements`,
          {
            targetAccount: recipient_account_id,
            quoteUuid: quote_uuid,
            details: {
              reference: "my ref",
              sourceOfFunds: "verification.source.of.funds.other",
            },
          },
          { headers }
        );

        if (response_res.status === 200) {
          console.log("_____", response_res.data[0].type);
        } else {
          return res.status(401).json({ error: "Unauthorized User" });
        }
      } else {
        return res.status(401).json({ error: "Unauthorized User" });
      }
    } catch (trans_error) {
      throw trans_error;
    }

    // Create transfer

    try {
      const response = await axios.post(
        `${host}/v1/transfers`,
        {
          targetAccount: recipient_account_id,
          quoteUuid: quote_uuid,
          customerTransactionId: GUID,
          details: {
            reference: "my ref",
            sourceOfFunds: "verification.transfers.purpose.pay.bills",
          },
        },
        { headers }
      );

      if (response.status === 200) {
        transfer_id = response.data.id;
      } else {
        return res.status(401).json({ error: "Unauthorized User" });
      }
    } catch (trans_err) {
      throw trans_err;
    }

    try {
      const response = await axios.post(
        `${host}/v3/profiles/${profile_id}/transfers/${transfer_id}/payments`,
        {
          type: "BALANCE",
        },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      if (response.status === 200) {
        balanceTransactionId = response.data.balanceTransactionId;
        return res.status(200).json({ success: balanceTransactionId });
      } else {
        return res.status(401).json({ error: "Unauthorized User" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (err) {
    await axios
      .get(`${host}/v1/borderless-accounts?profileId=${profile_id}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data[0].id);
          return res.status(200).json({ success: response.data[0].id });
        } else {
          return res.status(401).json({ error: "Unauthorized User" });
        }
      })
      .catch((profile_err) => {
        throw profile_err;
      });
    // return res.status(500).json({ error: err });
  }
};

module.exports.test = async (req, res, next) => {
  return res.status(200).json({ success: "Payment is working" });
};
