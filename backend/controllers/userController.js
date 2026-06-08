const User = require('../models/User');

// @desc    Get all users (Admin Only)
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: users.length, 
      data: users 
    });
  } catch (error) {
    console.error("Fetch Users API Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete user (Admin Only)
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account!" });
    }

    await User.findByIdAndDelete(req.params.id);
    
    res.status(204).send(); 
  } catch (error) {
    console.error("Delete User API Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};