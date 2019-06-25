const deleteAccount = async (req, res) => {
  var u = req.cookies.user;
  res.clearCookie("logedIn");
  try {
    const db = req.app.locals.db;
    let userObject = await db
      .collection("users")
      .findOne(
        { about: u },
        { _id: 1, username: 1, userEmail: 0, password: 0 }
      );
    let username = userObject.userName;
    await db.collection("cookies").deleteOne({ cookieID: u });
    await db.collection("users").deleteOne({ about: u });
    await db.collection("pictures").deleteMany({ user: username });
    res.render("index");
  } catch (err) {
    if (err) {
      res.render("error");
    }
  }
};

module.exports = {
  deleteAccount
};
