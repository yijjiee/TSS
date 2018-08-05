/**
 * ModuleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: function (req, res, next) {
    Module.find(function foundModules(err, modules) {
      if (err) return next(err);

      res.view({
        modules: modules
      });
    });
  },
  create: async function(req, res, next) {
    res.send(req.param("num_lesson_types"));
    // let module = await Module.create(req.allParams()).fetch();
    //
    // req.params.module_id = module.id;
    //
    // if (module) {
    //   let venue_arr = req.param("lec_venues").split(",");
    //   let lesson = await Lesson.create(req.allParams()).fetch();
    //
    //   if (lesson) {
    //     req.params.lesson_id = lesson.id;
    //     for (let i = 0; i < venue_arr.length; i++) {
    //       let venue = await Venue.findOne({name: venue_arr[i]});
    //       req.params.venue_id = venue.id;
    //       await PossibleVenues.create(req.allParams());
    //     }
    //
    //     res.json(await PossibleVenues.find({lesson_id: lesson.id}));
    //   }
    // }
  },
};

