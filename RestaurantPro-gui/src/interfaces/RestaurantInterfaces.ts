export interface MenuItem {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  type: 'veg' | 'non-veg' | 'contains-egg';
}

export interface DeliveryStaff {
  _id?: string;
  name: string;
  availability: boolean;
  idProofNumber: string;
  deliveryAssigned: boolean;
}

export interface Revenue {
  deliveryRevenue: number;
  takeAwayRevenue: number;
}

export interface OrderStatistics {
  deliveryCount: number;
  takeawayCount: number;
  dineinCount: number;
}

export interface Reservation {
  _id?: string;
  guestName: string;
  reservationTime: Date;
  noOfPersons: number;
  status: 'Booked' | 'Cancelled' | 'Completed' | 'No Show';
}

export interface RestaurantTimings {
  open: string;
  close: string;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Restaurant {
  _id?: string;
  contactNumber: string;
  restaurantID: string;
  fssaiLicenceNumber: string;
  restaurantName: string;
  isVerified: boolean;
  bankDetails: BankDetails;
  address: Address;
  menuItems: MenuItem[];
  timings: RestaurantTimings;
  deliveryStaff: DeliveryStaff[];
  revenue: Revenue;
  orderStatistics: OrderStatistics;
  deliveryAvailable: boolean;
  takeAwayAvailable: boolean;
  dineInAvailable: boolean;
  dineInCapacity: number;
  reservation: Reservation[];
} 