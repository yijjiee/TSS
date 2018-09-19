/**
 * LessonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  show: async function(req, res) {
    let promise_1 = req.param("module_code") != null ? Module.find({code: req.param("module_code")}) : Module.find({});
    let promise_2 = req.param("module_code") != null ? Lesson.find({module_code: req.param("module_code")}).populate("possible_venues").populate("groups_assigned") : Lesson.find({}).populate("possible_venues").populate("groups_assigned");

    Promise.all([promise_1, promise_2]) .then(function (result) {
       res.send(result);
    });
  },

  'uploadFile': async function(req, res) {
    req.file("lessonFile").upload({
        dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
        saveAs: req.file("lessonFile")._files[0].stream.filename,
      },
      function (err, uploadedFile) {
        if (err) {
          return res.serverError(err);
        } else {
          let moduleFilename = uploadedFile[0].filename;
          let xtension = moduleFilename.slice(moduleFilename.lastIndexOf(".") + 1, moduleFilename.length);
          const fs = require('fs');

          if (xtension == "txt") {
            fs.readFile(uploadedFile[0].fd, 'utf8', async function(err, data) {
              let data_arr = data.split("\r\n");
              let affectedRows = 0;

              for (let i = 0; i < data_arr.length; i++) {
                // Module Related
                let module_code = data_arr[i].slice(5, 11);
                let module = await Module.findOne({code: module_code});
                if (!module)
                  continue;

                // Lesson Related
                let lesson_type = data_arr[i].slice(11, 14);
                let lesson_week = [];
                let lesson_freq = "WEEKLY";
                let num_of_lessons = 2;

                if (lesson_type == "TUT")
                  num_of_lessons = 1;

                for (let j = 51; j < 64; j++) {
                  lesson_week.push(data_arr[i].slice(j, j+1));
                }
                if (lesson_week[1] == "N" && lesson_week[3] == "N" && lesson_week[5] == "N" && lesson_week[7] == "N" && lesson_week[9] == "N" && lesson_week[11] == "N")
                  lesson_freq = "ODD";
                else if (lesson_week[0] == "N" && lesson_week[2] == "N" && lesson_week[4] == "N" && lesson_week[6] == "N" && lesson_week[8] == "N" && lesson_week[10] == "N" && lesson_week[12] == "N")
                  lesson_freq = "EVEN";

                let lesson = await Lesson.findOrCreate({lesson_type: lesson_type, module_code: module_code}, {
                  lesson_type: lesson_type,
                  num_of_lessons: num_of_lessons,
                  frequency: lesson_freq,
                  module_code: module_code,
                });

                // Possible Venues Related
                let venueName = data_arr[i].slice(31, 51).trim();
                let venue = await Venue.findOne({name: venueName});
                let possible_venue = await PossibleVenues.findOrCreate({lesson_id: lesson.id, venue_id: venue.id,}, {
                  lesson_id: lesson.id,
                  venue_id: venue.id,
                });

                // Group Assignment Related
                let group_index = data_arr[i].slice(14, 19).trim();
                let group = await Group.findOrCreate({group_index: group_index}, {
                  group_index: group_index,
                  group_size: 35,
                });
                let group_assignment = await GroupsAssignment.findOrCreate({lesson_id: lesson.id, group_index: group_index}, {
                  lesson_id: lesson.id,
                  group_index: group_index,
                });

                // Slots Retrieval Related
                let start_time = data_arr[i].slice(21,26);
                let end_time = data_arr[i].slice(26, 31);
                let slot = await Slot.findOrCreate({start_time: start_time, end_time: end_time}, {
                  start_time: start_time,
                  end_time: end_time,
                });

                // Lesson Allocation Related
                let year_sem = data_arr[i].slice(0, 5);
                let day = data_arr[i].slice(19, 21).trim();
                let lesson_allocation = await LessonAllocation.findOrCreate({
                  study_year_sem: year_sem,
                  lesson_day: day,
                  group_index: group_index,
                  venue_id: venue.id,
                  slot_id: slot.id,
                  lesson_id: lesson.id,
                }, {
                  study_year_sem: year_sem,
                  lesson_day: day,
                  group_index: group_index,
                  venue_id: venue.id,
                  slot_id: slot.id,
                  lesson_id: lesson.id,
                });

                if (lesson_allocation)
                  affectedRows++;
              }
            });
          }
          fs.unlink("assets/uploads/" + moduleFilename, function(err) {
            if (err)
              res.serverError(err);
          });
          res.redirect("/module");
        }
      });
  },
};

