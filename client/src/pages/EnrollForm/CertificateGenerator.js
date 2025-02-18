import React from 'react';
import { jsPDF } from 'jspdf';

const CertificateGenerator = ({ courseName, studentName, completionDate }) => {
  const generateCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Add title
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 100);

    // Add content
    ctx.font = '24px Arial';
    ctx.fillText(`This is to certify that`, canvas.width / 2, 200);
    
    ctx.font = 'bold 32px Arial';
    ctx.fillText(studentName, canvas.width / 2, 250);
    
    ctx.font = '24px Arial';
    ctx.fillText(`has successfully completed the course`, canvas.width / 2, 300);
    
    ctx.font = 'bold 32px Arial';
    ctx.fillText(courseName, canvas.width / 2, 350);
    
    ctx.font = '24px Arial';
    ctx.fillText(`on ${completionDate}`, canvas.width / 2, 400);


    const pdf = new jsPDF('l', 'pt', 'a4');
    pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 842, 595);
    pdf.save(`${courseName}_certificate.pdf`);
  };

  return (
    <button onClick={generateCertificate}>
      Generate and Download Certificate
    </button>
  );
};

export default CertificateGenerator;