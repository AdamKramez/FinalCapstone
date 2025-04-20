const User = require('../models/user');

exports.saveArticle = async (req, res) => {
  const { userId, article } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: check if already saved
    const alreadySaved = user.savedArticles.some(a => a.url === article.url);
    if (alreadySaved) return res.status(400).json({ message: 'Article already saved' });

    user.savedArticles.push(article);
    await user.save();

    res.status(200).json({ message: 'Article saved successfully' });
  } catch (err) {
    console.error('Error saving article:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// get user to display articles in article slidebar
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
