/**
 * ModuleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
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
          res.json(moduleFilename);
          let xtension = moduleFilename.slice(moduleFilename.lastIndexOf(".") + 1, moduleFilename.length);

          let Excel = require('exceljs');
          let path = require('path');
          let filePath = path.resolve("assets/uploads", moduleFilename);
          console.log(filePath);

          if (xtension == "xlsx")
          {
            let workbook = new Excel.Workbook();
            workbook.xlsx.readFile(filePath)
              .then(function() {
                let worksheet = workbook.getWorksheet(1);
                for (let row_index = 1; row_index <= worksheet.rowCount; row_index++) {
                  let row = worksheet.getRow(row_index);
                  let cell_values = [];
                  for (let cell_index = 1; cell_index <= row.cellCount; cell_index++) {
                    let cell = row.getCell(cell_index);
                    cell_values.push(cell.value);
                  }
                  console.log(cell_values);
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
  }
};

