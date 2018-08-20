/**
 * GroupController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  'import': async function(req, res) {
    res.view();
  },

  'uploadFile': async function(req, res) {
    req.file("groupFile").upload({
        dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
        saveAs: req.file("groupFile")._files[0].stream.filename,
      },
      function (err, uploadedFile) {
        if (err) {
          return res.serverError(err);
        } else {
          let group_filename = uploadedFile[0].filename;
          let xtension = group_filename.slice(group_filename.lastIndexOf(".") + 1, group_filename.length);

          let Excel = require('exceljs');
          let path = require('path');
          let filePath = path.resolve("assets/uploads", group_filename);

          if (xtension == "xlsx") {
            let workbook = new Excel.Workbook();
            workbook.xlsx.readFile(filePath)
              .then(async function() {
                let worksheet = workbook.getWorksheet(1);
                for (let row_index = 1; row_index <= worksheet.rowCount; row_index++) {
                  let row = worksheet.getRow(row_index);
                  try {
                    await Group.create({
                      group_index: row.getCell(1).value,
                      group_size: row.getCell(2).value,
                    });
                  } catch (err) {
                    res.serverError(err);
                    break;
                  }

                  if (row_index == worksheet.rowCount)
                    res.redirect('/module/addnew');
                }
              });
          } else if (xtension == "csv") {

          }
        }
      });
  },
};

