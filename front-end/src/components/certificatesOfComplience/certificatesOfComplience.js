import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCertificates } from '../../app/features/certicatesOfComplience/certificatesAsyncThunk';
import jsPDF from 'jspdf';
import Spinner from 'react-bootstrap/Spinner';

const CertificateOfCompliance = () => {
  const dispatch = useDispatch();
  const certificatesData = useSelector((state) => state.certificates.data);
  const isLoading = useSelector((state) => state.certificates.loading);
  const [selectedCertificateIndex, setSelectedCertificateIndex] = useState("");
  const [selectedDate, setSelectedDate] = useState(formatToday());
  const [selectedInvoice, setSelectedInvoice] = useState("");
  

  const handlePrintPDF = () => {
    const pdf = new jsPDF();
  
    certificatesData.forEach((certificate, index) => {
      if (index > 0) {
        pdf.addPage(); // Add a new page for each certificate after the first one
      }
  
      // Certificate details
      pdf.text(`Company Name: `, 10, 10);
        pdf.setFont('helvetica', 'bold'); // Set the font to bold
        pdf.text(`Shamrock International`, 60, 10);
        pdf.setFont('helvetica', 'normal');

        pdf.text(`Address: `, 10, 20);
        pdf.setFont('helvetica', 'bold'); // Set the font to bold
        pdf.text(`1475 East Industrial Drive Itasca, IL 60143`, 60, 20);
        pdf.setFont('helvetica', 'normal'); // Reset the font style to normal
        
        pdf.text(`Country: `, 10, 30);
        pdf.setFont('helvetica', 'bold'); // Set the font to bold
        pdf.text(`U.S.A`, 60, 30);
        pdf.setFont('helvetica', 'normal'); // Reset the font style to normal
        
      // Certificate of Compliance
        pdf.setFont('helvetica', 'bold'); // Set the font to bold
        pdf.text('Certificate of Compliance', 105, 40, { align: 'center' });
        pdf.setFont('helvetica', 'normal'); // Reset the font style to normal

        const longText = `THIS LETTER HEREBY CERTIFIES THAT THE LOT OF MATERIAL PROVIDED FOR THE BELOW MENTIONED PURCHASE ORDER COMPLIES IN ALL RESPECTS WITH ALL DIMENSIONS AND SPECIFICATIONS DESCRIBED ON YOUR PURCHASE ORDER AND PRINT.`;

        const splitText = pdf.splitTextToSize(longText, 180); // Adjust the width as needed
        
        pdf.text(splitText, 10, 50);
        
        const styledText = (text, x, y, options = {}) => {
            pdf.setFont('helvetica', options.bold ? 'bold' : 'normal');
            pdf.text(text, x, y, { align: options.center ? 'center' : 'left', maxWidth: options.wrap ? 180 : undefined });
            pdf.setFont('helvetica', 'normal'); // Reset the font style to normal
          
            if (options.underline) {
                pdf.setLineWidth(0.5);
                pdf.line(x, y + 1 , 135, y + 1);
              }
          };

          styledText('Invoice No:', 10, 90, { fieldNameBold: true });
          styledText(`${selectedInvoice? selectedInvoice: ""}`, 55, 90, { valueBold: true, underline: true });
          
          styledText('Pack Slip No:', 10, 100, { fieldNameBold: true });
          styledText(`${certificate.DocNum}`, 55, 100, { valueBold: true, underline: true });
          
          styledText('Customer:', 10, 110, { fieldNameBold: true });
          styledText(`${certificate.CardName}`, 55, 110, { valueBold: true, underline: true });
          
          styledText('Purchase Order:', 10, 120, { fieldNameBold: true });
          styledText(`${certificate['PO Number']}`, 55, 120, { valueBold: true, underline: true });
          
          styledText('Customer PN:', 10, 130, { fieldNameBold: true });
          styledText(`${certificate.U_SIF_CustPN}`, 55, 130, { valueBold: true, underline: true });
          
          styledText('Customer Rev:', 10, 140, { fieldNameBold: true });
          styledText(`${certificate.Rev}`, 55, 140, { valueBold: true, underline: true });
          
          styledText('Shamrock PN:', 10, 150, { fieldNameBold: true });
          styledText(`${certificate.ItemCode}`, 55, 150, { valueBold: true, underline: true });
          
          styledText('Quantity:', 10, 160, { fieldNameBold: true });
          styledText(`${certificate.Quantity}`, 55, 160, { valueBold: true, underline: true });
          
          styledText('Lot Number:', 10, 170, { fieldNameBold: true });
          styledText(`${certificate.BatchNumber}`, 55, 170, { valueBold: true, underline: true });
          
          styledText('# of Cartons:', 10, 180, { fieldNameBold: true });
          styledText(`${certificate.Ctns}`, 55, 180, { valueBold: true, underline: true });
          
          styledText('Final Audit Date:', 10, 190, { fieldNameBold: true });
          styledText(`${formatAsMMDDYYYY(selectedDate)}`, 55, 190, { valueBold: true, underline: true });
          
          styledText('Country of Origin:', 10, 200, { fieldNameBold: true });
          styledText(`${certificate.COO}`, 55, 200, { valueBold: true, underline: true });
          
    });
  
    // Save the PDF with a single file name
    pdf.save('certificates-of-compliance.pdf');
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleInvoiceChange = (event) =>{
    setSelectedInvoice(event.target.value);
  }

  function formatAsMMDDYYYY(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  }

  function formatToday() {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
  }
  

  const handleDispatchFetch = () => {
    dispatch(fetchCertificates(selectedCertificateIndex)); // Update with your appropriate argument
  };

  if (!certificatesData || certificatesData.length === 0) {
    return <div className='container text-center pt-3'>
        <input
        type="text"
        placeholder="Enter SO Number"
        value={selectedCertificateIndex}
        onChange={(value) =>{ setSelectedCertificateIndex(value.target.value)}}
      />
      <button onClick={handleDispatchFetch}>Get Certificates</button>

      {isLoading? 
      <div className='container text-center mt-5'>
      <Spinner animation="border" variant="primary" />
      </div>: ""}

    </div>;
  }

  return (
    <div className='container'>
      <div className='text-center pt-3'>
      <input
      type="text"
      placeholder="Enter SO Number"
      value={selectedCertificateIndex}
      onChange={(value) =>{ setSelectedCertificateIndex(value.target.value)}}
    />
    <button onClick={handleDispatchFetch}>Get Certificates</button>
    </div>
      {isLoading? 
      <div className='container text-center mt-5'>
      <Spinner animation="border" variant="primary" />
      </div>:
      <div>
    <div className='container m-2'>
    <label className='me-3' htmlFor="datePicker">DATE:</label>
    <input
      type="date"
      id="datePicker"
      value={selectedDate}
      onChange={handleDateChange}
    />
  </div>

  <div className='container m-2'>
    <label className='me-2' htmlFor="Invoice">Invoice No:</label>
    <input
      type="text"
      id="Invoice"
      value={selectedInvoice}
      onChange={handleInvoiceChange}
    />
  </div>

    <div id="pdf-content">
      {certificatesData.map((certificate, index) => (
        <div key={index} style={{ marginBottom: '20px', border: '1px solid #000', padding: '20px' }}>
              <div >
              <p>Shamrock PN:	{certificate.ItemCode}</p>    			
              <p> Quantity: {certificate.Quantity}</p>  			
              <p>Lot Number: {certificate.BatchNumber}</p>   			
              <p># of Cartons:{certificate.Ctns}</p>
              </div>
              </div>

      ))}
    </div>
    <button onClick={handlePrintPDF}>Download Certificates</button>
    </div>}
      
    </div>
  );
};

export default CertificateOfCompliance;

