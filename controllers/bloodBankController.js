const BloodBank = require('../models/bloodBankModel');

// Add blood bottles to the inventory
const addBloodBottles = async (bloodData) => {
  try {
    const bloodBank = await BloodBank.findOne(); // Assuming there's only one record in the blood bank
    if (bloodBank) {
      // Iterate through the provided blood data
      bloodData.forEach(({ bloodGroup, quantity }) => {
        const existingBottle = bloodBank.availableBloodBottles.find(bottle => bottle.bloodGroup === bloodGroup);

        if (existingBottle) {
          // Update the quantity and donation date
          existingBottle.quantity += quantity;
          existingBottle.donationDate = new Date();
        } else {
          // Add a new blood bottle
          bloodBank.availableBloodBottles.push({
            bloodGroup,
            quantity,
            donationDate: new Date(),
          });
        }
      });

      bloodBank.updatedAt = new Date();
      await bloodBank.save();
      console.log('Blood bottles added to the inventory successfully');
    }
  } catch (error) {
    console.error('Error adding blood bottles to the inventory:', error);
  }
};

// Update blood bottle quantity in the inventory
const updateBloodBottles = async (bloodGroup, quantity) => {
  try {
    const bloodBank = await BloodBank.findOne(); // Assuming there's only one record in the blood bank
    if (bloodBank) {
      const existingBottle = bloodBank.availableBloodBottles.find(bottle => bottle.bloodGroup === bloodGroup);

      if (existingBottle) {
        if (existingBottle.quantity >= quantity) {
          // Update the quantity and donation date
          existingBottle.quantity -= quantity;
          existingBottle.donationDate = new Date();

          bloodBank.updatedAt = new Date();
          await bloodBank.save();
          console.log('Blood bottles updated in the inventory successfully');
          return true; // Successfully updated
        } else {
          console.log('Not enough quantity available for the requested blood group');
          return false; // Insufficient quantity
        }
      } else {
        console.log('Blood group not found in the inventory');
        return false; // Blood group not found
      }
    }
  } catch (error) {
    console.error('Error updating blood bottles in the inventory:', error);
    return false; // Error updating
  }
};

// Controller function to add blood banks
const addBloodBanks = async (req, res) => {
  console.log("request recieved");
  try {
    const bloodBanksToAdd = req.body;

    // Using insertMany to add multiple blood banks at once
    const addedBloodBanks = await BloodBank.insertMany(bloodBanksToAdd);

    res.status(201).json({ success: true, data: addedBloodBanks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  addBloodBottles,
  updateBloodBottles,
  addBloodBanks
};
