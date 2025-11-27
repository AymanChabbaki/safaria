/**
 * Test script to validate payment request data structure
 * Run this to check if the payment endpoint will work
 */

// Sample data from your console log
const testPaymentData = {
  reservationData: {
    itemType: 'caravane',
    itemId: 2,
    itemName: 'Nuit Sous les Étoiles',
    itemPrice: '450.00',
    itemImage: 'http://localhost:5000/uploads/caravanes/merzouga-desert-360.jpg',
    // Add the rest of the fields that should be present:
    checkIn: '2025-12-01',
    checkOut: '2025-12-03', 
    startDate: '12/1/2025',
    endDate: '12/3/2025',
    guests: 2,
    email: 'test@example.com',
    phone: '+212600000000',
    specialRequests: 'Test request',
    message: 'Test request',
    days: 2,
    subtotal: 1800,
    serviceFee: 180,
    taxes: 90,
    total: 2070,
    totalPrice: 2070
  },
  payment: {
    cardNumber: '1234567890123456',
    cardHolder: 'ANAS ANA',
    expiryDate: '12/31',
    cvv: '123',
    billingAddress: 'Sidi Moumen, Walili 5 IMM 5 APP 13'
  }
};

// Check required fields
console.log('=== VALIDATION TEST ===\n');

const { reservationData, payment } = testPaymentData;

const requiredReservationFields = [
  'itemId', 'itemType', 'itemName', 'itemPrice',
  'checkIn', 'checkOut', 'guests', 'email', 'phone',
  'days', 'subtotal', 'serviceFee', 'taxes', 'total'
];

const requiredPaymentFields = ['cardNumber', 'cardHolder'];

console.log('Checking reservation fields:');
requiredReservationFields.forEach(field => {
  const exists = reservationData[field] !== undefined && reservationData[field] !== null;
  console.log(`  ${field}: ${exists ? '✓' : '✗'} ${exists ? `(${reservationData[field]})` : 'MISSING'}`);
});

console.log('\nChecking payment fields:');
requiredPaymentFields.forEach(field => {
  const exists = payment[field] !== undefined && payment[field] !== null;
  console.log(`  ${field}: ${exists ? '✓' : '✗'} ${exists ? `(${payment[field]})` : 'MISSING'}`);
});

console.log('\n=== TEST COMPLETE ===');
