/**
 * ModuleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let self = module.exports = {
  index: async function (req, res) {
    let modules = await Module.find({});
      // .populate("lessons")
      // .then(async function (module) {
      //   for (let i = 0; i < module.length; i++) {
      //     let lessons = module[i].lessons;
      //     for (let j = 0; j < lessons.length; j++) {
      //       lessons[j].possible_venues = await PossibleVenues.find({lesson_id: lessons[j].id}).then(async function (pvenues) {
      //         let venue_arr = [];
      //         for (let i = 0; i < pvenues.length; i++) {
      //             venue_arr.push(Venue.find({id: pvenues[i].venue_id}));
      //         }
      //         return Promise.all(venue_arr).then(function (results) {
      //           return results;
      //         });
      //       });
      //     }
      //   }
      //   res.view({
      //     modules: module,
      //   });
      // });
    res.view({
      modules: modules,
    });
  },
  create: async function(req, res) {
    let module = await Module.create(req.allParams()).fetch();
    req.params.module_code= module.code;

    if (module) {
      let lesson_types = req.param("lesson_type");

      for (index in lesson_types) {

        let lesson = await Lesson.create({
          lesson_type: lesson_types[index],
          num_of_lessons: req.param("num_of_lessons")[index],
          frequency: req.param("frequency")[index],
          module_code: req.param("module_code"),
        }).fetch();

        if (lesson) {
          let venue_arr = req.param("possible_venues")[index].split(",");
          let group_arr = req.param("groups")[index].split(",");
          req.params.lesson_id = lesson.id;
          for (let i = 0; i < venue_arr.length; i++) {
            let venue = await Venue.findOne({name: venue_arr[i]});
            req.params.venue_id = venue.id;
            await PossibleVenues.create(req.allParams());
          }

          for (let i = 0; i < group_arr.length; i++) {
            let group = await Group.findOne({group_index: group_arr[i]});
            req.params.group_index = group.group_index;
            await GroupsAssignment.create(req.allParams());
          }
        }
      }
    }
    let module_created = await Module.find({code: module.code}).populate("lessons");
    res.redirect("/module");
  },
  'addnew': async function (req, res) {
    let venues = await Venue.find({select: ['venue_type', 'name', 'capacity'] });
    let groups = await Group.find({select: ['group_index', 'group_size']});
    res.view({
      venues: venues,
      groups: groups,
    });
  },
  'import': async function(req, res) {
    res.view();
  },
  'uploadFile': async function(req, res) {
    req.file("moduleFile").upload({
        dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
        saveAs: req.file("moduleFile")._files[0].stream.filename,
      },
      function (err, uploadedFile) {
        if (err) {
          return res.serverError(err);
        } else {
          let moduleFilename = uploadedFile[0].filename;
          let xtension = moduleFilename.slice(moduleFilename.lastIndexOf(".") + 1, moduleFilename.length);

          let Excel = require('exceljs');
          let path = require('path');
          let filePath = path.resolve("assets/uploads", moduleFilename);

          if (xtension == "xlsx")
          {
            let workbook = new Excel.Workbook();
            workbook.xlsx.readFile(filePath)
              .then(async function() {
                let worksheet = workbook.getWorksheet(1);
                for (let row_index = 2; row_index <= worksheet.rowCount; row_index++) {
                  let row = worksheet.getRow(row_index);
                  let module, sharedModule;
                  try {
                      module = await Module.findOrCreate({ code: row.getCell(1).value }, {
                        code: row.getCell(1).value,
                        name: row.getCell(2).value,
                        academic_units: row.getCell(3).value,
                        cohort_size: row.getCell(4).value,
                      });
                      if (row.getCell(5).value == true) {
                        let tempCode = "CE";
                        if (row.getCell(1).value.toString().slice(0, 2) == "CE")
                          tempCode = "CZ";
                        sharedModule = await Module.findOrCreate({ code: tempCode + row.getCell(1).value.toString().slice(2) }, {
                          code: tempCode + row.getCell(1).value.toString().slice(2),
                          name: row.getCell(2).value,
                          academic_units: row.getCell(3).value,
                          cohort_size: row.getCell(4).value,
                        });
                      }
                  } catch(err) {
                    res.serverError(err);
                    break;
                  }

                  /**
                   * Leaving bottom for further enhancement (The excel file to be able to build the behind columns with lecture / tutorial / lab / additional lesson details)
                   */
                  // if (module != null) {
                  //   if (row.getCell(6).value > 0) {
                  //     let lesson = await Lesson.create({
                  //       lesson_type: "LEC",
                  //       num_of_lessons: row.getCell(6).value,
                  //       frequency: row.getCell(8).value,
                  //       module_code: module.code,
                  //     }).fetch();
                  //
                  //     if (lesson) {
                  //       let result = await self.createLessons(row, lesson, 6, 8);
                  //       if (result != "OK")
                  //         res.serverError(result);
                  //     }
                  //   }
                  //
                  //   if (row.getCell(10).value > 0) {
                  //     let lesson = await Lesson.create({
                  //       lesson_type: "TUT",
                  //       num_of_lessons: row.getCell(10).value,
                  //       frequency: row.getCell(12).value,
                  //       module_code: module.code,
                  //     }).fetch();
                  //
                  //     if (lesson) {
                  //       let result = await self.createLessons(row, lesson, 10, 12);
                  //       if (result != "OK")
                  //         res.serverError(result);
                  //     }
                  //   }
                  //
                  //   if (row.getCell(14).value > 0) {
                  //     let lesson = await Lesson.create({
                  //       lesson_type: "LAB",
                  //       num_of_lessons: row.getCell(14).value,
                  //       frequency: row.getCell(16).value,
                  //       module_code: module.code,
                  //     }).fetch();
                  //
                  //     if (lesson) {
                  //       let result = await self.createLessons(row, lesson, 15, 17);
                  //       if (result != "OK")
                  //         res.serverError(result);
                  //     }
                  //   }
                  // }
                }
                // worksheet.eachRow({includeEmpty: true}, function(row, rowNumber) {
                //   let currRow = worksheet.getRow(rowNumber);
                //   let module_code = currRow.getCell(1).value;
                //   let module_name = currRow.getCell(2).value;
                //   let academic_units = currRow.getCell(3).value;
                //   let cohort_size = currRow.getCell(4).value;
                //   let lec_lessons = currRow.getCell(5).value;
                //   let lec_possible_venues = currRow.getCell(6).value;
                //   let lec_freq = currRow.getCell(7).value;
                // });
              })
              .then(function() {
                const filesystem = require('fs');
                filesystem.unlink("assets/uploads/" + moduleFilename, function(err) {
                  if (err)
                    res.serverError(err);
                });
                res.redirect("/module");
              });
          }
          else if (xtension == "csv")
          {

          }
          else
          {
            res.serverError();
          }
        }
    });
  },


  createLessons: async function (row, lesson, venues_index, group_index) {
    let venue_arr = row.getCell(venues_index).value.toString().split(",");
    let group_arr = row.getCell(group_index).value.toString().split(",");
    for (let i = 0; i < venue_arr.length; i++) {
      try {
        let venue = await Venue.findOne({name: venue_arr[i].trim()});
        await PossibleVenues.create({
          lesson_id: lesson.id,
          venue_id: venue.id,
        });
      } catch (err) {
        return err;
      }
    }

    for (let i = 0; i < group_arr.length; i++) {
      try {
        let group = await Group.findOne({group_index: group_arr[i].trim()});
         await GroupsAssignment.create({
          lesson_id: lesson.id,
          group_index: group.group_index,
        });
      } catch (err) {
        return err;
      }
    }

    return "OK";
  },


  /* Function below only for Weekly Planner */
  'planner': async function(req, res) {
    let modules = await Module.find({}).populate("lessons");
    res.view('schedule/schedule_timetable', {
      modules: modules,
    });
  },
};

