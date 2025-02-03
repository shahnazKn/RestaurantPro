const mongoose = require('mongoose');
const User = require('./User');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: false },
  type: { type: String, required: true}
});

const deliveryStaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  availability : { type: Boolean },
  idProofNumber : { type: String, required: true },
  deliveryAssigned : { type: Boolean }
});

const revenueSchema = new mongoose.Schema({
  deliveryRevenue: { type: Number },
  takeAwayRevenue : { type: Number }
});

const orderStatisticsSchema = new mongoose.Schema({
  deliveryCount: { type: Number },
  takeawayCount : { type: Number },
  dineinCount : { type: Number }
});

const reservationSchema = new mongoose.Schema({
  guestName: { type: String },
  reservationTime: { type: Date },
  noOfPersons: {type: Number},
  status: {type: String, enum: ['Booked', 'Cancelled', 'Completed', 'No Show']}
});

const RestaurantOwnerSchema = new mongoose.Schema({
  contactNumber: { type: String, required: true },
  restaurantID: { type: String, unique: true, required: true },
  fssaiLicenceNumber: { type: String, required: true },
  restaurantName: { type: String, required: true },
  isVerified: { type: Boolean, required: true },
  bankDetails: {
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
  },
  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zipCode: { type: String, required: false },
    country: { type: String, required: false }
  },
  menuItems: [menuItemSchema],
  timings: {
    open: { type: String },
    close: { type: String }
  },
  deliveryStaff: [deliveryStaffSchema],
  revenue: {revenueSchema},
  orderStatistics: {orderStatisticsSchema},
  deliveryAvailable: { type: Boolean },
  takeAwayAvailable: { type: Boolean },
  dineInAvailable: { type: Boolean },
  dineInCapacity: { type: Number },
  reservation: [reservationSchema]
});

module.exports = User.discriminator('RestaurantOwner', RestaurantOwnerSchema);
