/**
 * ============================================================
 * SAFARIA Platform - PDF Receipt Generator
 * ============================================================
 * Generates PDF receipts for reservations using PDFKit
 * ============================================================
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

/**
 * Generate PDF Receipt for Reservation
 * @param {Object} reservationData - Reservation and payment details
 * @param {string} outputPath - Path to save the PDF (used for temp file in /tmp)
 * @returns {Promise<Buffer>} - PDF buffer for Cloudinary upload
 */
const generateReceipt = (reservationData, outputPath) => {
    return new Promise((resolve, reject) => {
        try {
            // Create a new PDF document
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });

            // Collect PDF data in buffer
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Add SAFARIA logo at the top
            const logoPath = path.join(__dirname, '../assets/logoSAFARIA.png');
            try {
                if (fs.existsSync(logoPath)) {
                    doc.image(logoPath, 250, 40, { width: 100 })
                       .moveDown(4);
                }
            } catch (err) {
                console.log('Logo not found, using text header');
            }

            // Add SAFARIA branding header
            doc.fontSize(32)
               .fillColor('#2563eb')
               .text('SAFARIA', { align: 'center' })
               .moveDown(0.5);

            doc.fontSize(12)
               .fillColor('#666666')
               .text('Discover Authentic Morocco', { align: 'center' })
               .moveDown(2);

            // Receipt Title
            doc.fontSize(24)
               .fillColor('#000000')
               .text('Payment Receipt', { align: 'center' })
               .moveDown(1);

            // Transaction Info
            doc.fontSize(10)
               .fillColor('#666666')
               .text(`Receipt #: ${reservationData.receiptNumber}`, { align: 'right' })
               .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
               .text(`Transaction ID: ${reservationData.transactionId}`, { align: 'right' })
               .moveDown(2);

            // Horizontal line
            doc.strokeColor('#2563eb')
               .lineWidth(2)
               .moveTo(50, doc.y)
               .lineTo(550, doc.y)
               .stroke()
               .moveDown(1);

            // Customer Information
            doc.fontSize(14)
               .fillColor('#2563eb')
               .text('Customer Information')
               .moveDown(0.5);

            doc.fontSize(11)
               .fillColor('#000000')
               .text(`Email: ${reservationData.customerEmail}`)
               .text(`Phone: ${reservationData.customerPhone}`)
               .text(`Number of Guests: ${reservationData.guests}`)
               .moveDown(2);

            // Reservation Details
            doc.fontSize(14)
               .fillColor('#2563eb')
               .text('Reservation Details')
               .moveDown(0.5);

            doc.fontSize(11)
               .fillColor('#000000')
               .text(`Item: ${reservationData.itemName}`)
               .text(`Type: ${reservationData.itemType.toUpperCase()}`)
               .text(`Check-in: ${reservationData.checkIn}`)
               .text(`Check-out: ${reservationData.checkOut}`)
               .text(`Duration: ${reservationData.days} night(s)`)
               .moveDown(2);

            // Special Requests
            if (reservationData.specialRequests && reservationData.specialRequests !== 'None') {
                doc.fontSize(14)
                   .fillColor('#2563eb')
                   .text('Special Requests')
                   .moveDown(0.5);

                doc.fontSize(10)
                   .fillColor('#666666')
                   .text(reservationData.specialRequests, {
                       width: 500,
                       align: 'left'
                   })
                   .moveDown(2);
            }

            // Price Breakdown
            doc.fontSize(14)
               .fillColor('#2563eb')
               .text('Price Breakdown')
               .moveDown(0.5);

            const y = doc.y;
            
            // Item line
            doc.fontSize(11)
               .fillColor('#000000')
               .text(`${reservationData.itemPrice} DH × ${reservationData.days} night(s)`, 50, y)
               .text(`${reservationData.subtotal} DH`, 400, y, { width: 150, align: 'right' });
            
            doc.moveDown();

            // Service Fee
            doc.text('Service Fee (10%)', 50, doc.y)
               .text(`${reservationData.serviceFee} DH`, 400, doc.y, { width: 150, align: 'right' });
            
            doc.moveDown();

            // Taxes
            doc.text('Taxes (5%)', 50, doc.y)
               .text(`${reservationData.taxes} DH`, 400, doc.y, { width: 150, align: 'right' });
            
            doc.moveDown(1.5);

            // Total line
            doc.strokeColor('#2563eb')
               .lineWidth(1)
               .moveTo(50, doc.y)
               .lineTo(550, doc.y)
               .stroke()
               .moveDown(0.5);

            doc.fontSize(16)
               .fillColor('#2563eb')
               .text('TOTAL', 50, doc.y)
               .text(`${reservationData.total} DH`, 400, doc.y, { width: 150, align: 'right' });
            
            doc.moveDown(2);

            // Payment Status Badge
            doc.roundedRect(50, doc.y, 100, 30, 5)
               .fillAndStroke('#22c55e', '#22c55e');

            doc.fontSize(12)
               .fillColor('#ffffff')
               .text('PAID', 50, doc.y + 8, { width: 100, align: 'center' });

            doc.moveDown(3);

            // Footer
            doc.fontSize(9)
               .fillColor('#999999')
               .text('Thank you for choosing SAFARIA!', { align: 'center' })
               .moveDown(0.5)
               .text('For any questions, contact us at: contact@safaria.ma', { align: 'center' })
               .moveDown(0.5)
               .text('www.safaria.ma | +212 123 456 789', { align: 'center' });

            // Finalize PDF
            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Upload PDF buffer to Cloudinary
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string} receiptNumber - Receipt number for filename
 * @returns {Promise<string>} - Cloudinary URL
 */
const uploadReceiptToCloudinary = (pdfBuffer, receiptNumber) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                folder: 'safaria/receipts',
                public_id: `receipt_${receiptNumber}_${Date.now()}`,
                format: 'pdf',
                access_mode: 'public', // Make PDF publicly accessible
                type: 'upload' // Ensure it's a regular upload (not authenticated)
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        uploadStream.end(pdfBuffer);
    });
};

/**
 * Generate unique receipt number
 */
const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `SAF-${year}${month}${day}-${random}`;
};

/**
 * Generate unique transaction ID
 */
const generateTransactionId = () => {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

module.exports = {
    generateReceipt,
    uploadReceiptToCloudinary,
    generateReceiptNumber,
    generateTransactionId
};
