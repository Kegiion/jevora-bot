const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.user) {
    return res.render('login', { user: null });
  }
  res.render('index', { user: req.user });
});

router.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.render('dashboard', { user: req.user, guildId: null });
});

router.get('/dashboard/:guildId', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.render('dashboard', { user: req.user, guildId: req.params.guildId });
});

router.get('/dashboard/:guildId/welcome', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.render('welcome', { user: req.user, guildId: req.params.guildId });
});

router.get('/dashboard/:guildId/autoping', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.render('autoping', { user: req.user, guildId: req.params.guildId });
});

router.get('/dashboard/:guildId/autorole', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.render('autorole', { user: req.user, guildId: req.params.guildId });
});

router.get('/dashboard/:guildId/giveaways', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.render('giveaways', { user: req.user, guildId: req.params.guildId });
});

router.get('/dashboard/:guildId/logging', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.render('logging', { user: req.user, guildId: req.params.guildId });
});

module.exports = router;