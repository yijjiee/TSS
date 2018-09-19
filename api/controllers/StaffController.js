/**
 * StaffController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  show: async function(req, res) {
    let promise_1 = Staff.find({});

    Promise.all([promise_1]).then(function(result) {
      res.send(result);
    });
  }
};

