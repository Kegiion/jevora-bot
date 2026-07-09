const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', passport.authenticate('discord', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect(`/dashboard/${req.user.guilds[0]?.id}`);
});

router.post('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

module.exports = router;