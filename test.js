const PDFDocument = require('pdf-lib').PDFDocument
const fs=require('fs')
var pdfBuffer1 = fs.readFileSync("63e5324f8fcdf8c46ca6cb087cb8c9ea"); 
var pdfBuffer2 = fs.readFileSync("661c6fa76c5f4883b6a500002dbfcb51");

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

merge(pdfBuffer1,pdfBuffer2)





