// Submit feedback
const createFeedback = async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;

    if (!name || !email || !message || !rating) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const feedback = {
      id: Date.now(),
      name,
      email,
      message,
      rating,
      createdAt: new Date(),
    };

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};

// Get feedback
const getAllFeedback = async (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
  });
};

module.exports = {
  createFeedback,
  getAllFeedback,
};