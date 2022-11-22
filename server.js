const express = require('express')
const app = express()
const port = 3000
const path=require('path')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const PDFDocument = require('pdf-lib').PDFDocument
const fs=require('fs')
app.use('/static',express.static('/uploads'))

async function merge(pdfBuffer1,pdfBuffer2) {
  var pdfsToMerge = [pdfBuffer1, pdfBuffer2]
  

  const mergedPdf = await PDFDocument.create(); 
for (const pdfBytes of pdfsToMerge) { 
  const pdf = await PDFDocument.load(pdfBytes); 
  const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
  copiedPages.forEach((page) => {
       mergedPdf.addPage(page); 
  }); 
} 

const buf = await mergedPdf.save();        // Uint8Array

let path = 'merged.pdf'; 
fs.open(path, 'w', function (err, fd) {
  fs.write(fd, buf, 0, buf.length, null, function (err) {
      fs.close(fd, function () {
          console.log('wrote the file successfully');
      }); 
  }); 
}); 
  
}
function sleep(ms) {
  return new Promise((resolve) => {
  
    setTimeout(resolve, ms);
  });
}

app.get('/', (req, res) => {
  // res.redirect('http://localhost:3000/merged.pdf')
  // res.sendFile(path.join(__dirname, '/merged.pdf'));
  res.sendFile(path.join(__dirname, '/index.html'));
})


  
    
    app.post('/merge',upload.array('uploaded_file',2),async function (req, res, next) {
  
      // console.log(req.files);
    
      var pdfBuffer1 = fs.readFileSync(path.join(__dirname,req.files[0].path)); 
      var pdfBuffer2 = fs.readFileSync(path.join(__dirname,req.files[1].path));
    
     
      await  merge(pdfBuffer1,pdfBuffer2)
      await sleep(500);
      
    
      res.sendFile(path.join(__dirname, '/merged.pdf'));
    
    
     
      })
    

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

})