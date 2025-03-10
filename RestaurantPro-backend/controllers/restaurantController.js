const RestaurantOwner = require('../models/RestaurantOwner');
const User = require('../models/User');

// Get restaurant details
exports.getRestaurantDetails = async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const restaurant = await RestaurantOwner.findById(restaurantId);

    if (!restaurant) return res.status(404).json({ message: "Restaurant details not found" });

    return res.status(200).json({ restaurant: restaurant });
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant details", error });
  }
};

// Get restaurant details by id
exports.getRestaurantDetailsId = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await RestaurantOwner.findById(restaurantId);

    if (!restaurant) return res.status(404).json({ message: "Restaurant details not found" });

    return res.status(200).json({ restaurant: restaurant });
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant details", error });
  }
};

// Update restaurant owner details
exports.updateRestaurantDetails = async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const { timings, deliveryAvailable, takeAwayAvailable, dineInAvailable, dineInCapacity } = req.body;

    // Find the restaurant owner
    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Update the fields only if provided
    if (timings) {
      restaurant.timings.open = timings.open || restaurant.timings.open;
      restaurant.timings.close = timings.close || restaurant.timings.close;
    }
    if (deliveryAvailable !== undefined) restaurant.deliveryAvailable = deliveryAvailable;
    if (takeAwayAvailable !== undefined) restaurant.takeAwayAvailable = takeAwayAvailable;
    if (dineInAvailable !== undefined) restaurant.dineInAvailable = dineInAvailable;
    if (dineInCapacity !== undefined) restaurant.dineInCapacity = dineInCapacity;

    // Save the updated details
    await restaurant.save();

    res.status(200).json({
      message: "Restaurant details updated successfully",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update restaurant details", error: error.message });
  }
};

// Add a new menu item
exports.addMenuItem = async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const { name, description, price, category, type, stock } = req.body;

    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    restaurant.menuItems.push({ name, description, price, category, type, stock });
    await restaurant.save();

    res.status(201).json({ message: 'Menu item added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item', error });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const { menuId } = req.params;
    const { name, description, price, category, type, stock } = req.body;

    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const menuItem = restaurant.menuItems.id(menuId);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price) menuItem.price = price;
    if (category) menuItem.category = category;
    if (type) menuItem.type = type;
    if (stock !== undefined) menuItem.stock = stock;

    await restaurant.save();

    res.status(200).json({ message: 'Menu item updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item' });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const { menuId } = req.params;

    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const menuItem = restaurant.menuItems.id(menuId);
    // Remove the menu item using $pull
    const updatedRestaurant = await RestaurantOwner.findByIdAndUpdate(
      restaurantId,
      { $pull: { menuItems: { _id: menuId } } }, // Use $pull to remove from the array
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    await restaurant.save();

    res.status(200).json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error });
  }
};

// Get menu item by restaurant Id
exports.getMenuItem = async (req, res) => {
  try {
    const { restaurantId } = req.user;

    // Find the restaurant by ID
    const restaurant = await RestaurantOwner.findById(restaurantId).select('menuItems');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Return the menu items
    res.status(200).json({ menuItems: restaurant.menuItems });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items', error: error.message });
  }
}

// Get menu items by restaurant Id when restaurant owner is logged in
exports.getMenuItemById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Find the restaurant by ID
    const restaurant = await RestaurantOwner.findById(restaurantId).select('menuItems');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Return the menu items
    res.status(200).json({ menuItems: restaurant.menuItems });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items', error: error.message });
  }
}

// Add staff member
exports.addStaffMember = async (req, res) => {
  const { name, idProofNumber } = req.body;
  const { restaurantId } = req.user;
  let deliveryAssigned = false,
    availability = true;

  try {
    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const staffMember = restaurant.deliveryStaff.find(staff => staff.idProofNumber === idProofNumber);
    if (staffMember) {
      return res.status(400).json({ message: "Staff exist with same id proof" });
    }

    const newStaff = { name, idProofNumber, availability, deliveryAssigned };
    restaurant.deliveryStaff.push(newStaff);
    await restaurant.save();

    res.status(201).json({ message: "Staff member added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding staff member" });
  }
};

// Get staff members
exports.getStaffMember = async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ staffDetails: restaurant.deliveryStaff });
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff member" });
  }
};


// Get staff count - by taking count of delivery staff
exports.getStaffCount = async (req, res) => {
  const { restaurantId } = req.user;

  try {
    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const staffCount = restaurant.deliveryStaff.length;
    res.status(200).json({ staffCount });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving staff count" });
  }
};


// Delete staff member
exports.deleteStaffMember = async (req, res) => {
  const { staffId } = req.params;
  const { restaurantId } = req.user;

  try {
    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const staffIndex = restaurant.deliveryStaff.findIndex(staff => staff._id.toString() === staffId);
    if (staffIndex === -1) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    restaurant.deliveryStaff.splice(staffIndex, 1);
    await restaurant.save();

    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff member" });
  }
};


// Edit staff member
exports.editStaffMember = async (req, res) => {
  const { staffId } = req.params;
  const { name, availability, idProofNumber, deliveryAssigned } = req.body;
  const { restaurantId } = req.user;

  try {
    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const staffMember = restaurant.deliveryStaff.find(staff => staff._id.toString() === staffId);
    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    if (name) staffMember.name = name;
    if (availability !== undefined) staffMember.availability = availability;
    if (idProofNumber) staffMember.idProofNumber = idProofNumber;
    if (deliveryAssigned !== undefined) staffMember.deliveryAssigned = deliveryAssigned;

    await restaurant.save();
    res.status(200).json({ message: "Staff member updated successfully", staff: staffMember });
  } catch (error) {
    res.status(500).json({ message: "Error updating staff member" });
  }
};


// Add reservation details
exports.addReservationDetails = async (req, res) => {
  const { guestName, reservationTime, noOfPersons } = req.body;
  const { restaurantId } = req.user;

  try {
    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    let dineInCapacity = restaurant.dineInCapacity;
    if (noOfPersons > dineInCapacity) {
      return res.status(200).json({ message: "Restaurant is full" });
    }

    dineInCapacity = dineInCapacity - noOfPersons;

    const reservation = {
      guestName,
      reservationTime: new Date(reservationTime),
      noOfPersons,
      status: 'Booked'
    };

    if (!restaurant.reservation) restaurant.reservation = [];
    restaurant.dineInCapacity = dineInCapacity;
    restaurant.reservation.push(reservation);


    await restaurant.save();
    res.status(201).json({ message: "Reservation added successfully", reservation });
  } catch (error) {
    res.status(500).json({ message: "Error adding reservation" });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const { reservationId } = req.params;
    const { status } = req.body;

    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant owner not found" });

    let dineInCapacity = restaurant.dineInCapacity;

    const reservation = restaurant.reservation.find(booking => booking._id.toString() === reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (status != 'Booked') {
      dineInCapacity += reservation.noOfPersons;
    }

    restaurant.dineInCapacity = dineInCapacity;
    reservation.status = status;

    await restaurant.save();
    res.status(200).json({ message: "Reservation updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error updating reservation" });
  }
};

// Search Restaurants by Name
exports.searchRestaurants = async (req, res) => {
  try {
    // Get the search query from the request
    let { query } = req.query;
    if (!query) {
      query = '';
    }

    // Case-insensitive search for restaurantName
    const restaurants = await User.find({
      role: "RestaurantOwner"
    });

    if (restaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found" });
    }

    res.status(200).json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: "Error searching restaurants", error: error.message });
  }
};

// Search Menu Items in a Selected Restaurant
exports.searchMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    let { query } = req.query;
    if (!query) {
      query = '';
    }

    // Find the restaurant by ID
    const restaurant = await User.findOne({ _id: restaurantId, role: "RestaurantOwner" });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Filter menu items that match the search query
    const matchedMenuItems = restaurant.menuItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    );

    if (matchedMenuItems.length === 0) {
      return res.status(404).json({ message: "No menu items found for this restaurant" });
    }

    res.status(200).json({ menuItems: matchedMenuItems });
  } catch (error) {
    res.status(500).json({ message: "Error searching menu items", error: error.message });
  }
};

// Update staff availability
exports.updateStaffAvailability = async (req, res) => {
  const { staffId } = req.params;
  const { availability } = req.body;
  const { restaurantId } = req.user;

  try {
    const restaurant = await RestaurantOwner.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const staffMember = restaurant.deliveryStaff.find(staff => staff._id.toString() === staffId);
    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    staffMember.availability = availability;
    await restaurant.save();
    
    res.status(200).json({ 
      message: "Staff availability updated successfully", 
      staff: staffMember 
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating staff availability" });
  }
};

