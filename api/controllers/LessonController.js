/**
 * LessonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  show: async function(req, res) {
    let promise_1 = Module.find({code: req.param("module_code")});
    let promise_2 = Lesson.find({module_code: req.param("module_code")}).populate("possible_venues").populate("groups_assigned");

    Promise.all([promise_1, promise_2]) .then(function (result) {
       res.send(result);
    });
  },
};

