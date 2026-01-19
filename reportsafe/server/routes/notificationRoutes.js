const express = require('express');
const router = express.Router();
const { supabase } = require('../db');

// GET /api/notifications/user/:userId - Get notifications for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// POST /api/notifications/send - Send notification to user
router.post('/send', async (req, res) => {
  const { user_id, report_id, message, type } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: 'User ID and message are required' });
  }

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id,
      report_id,
      message,
      type: type || 'info'
    })
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// POST /api/notifications/broadcast - Send notification to all users
router.post('/broadcast', async (req, res) => {
  const { message, type } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Get all users
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();

  if (userError) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }

  // Create notifications for all users
  const notifications = users.users.map(user => ({
    user_id: user.id,
    message,
    type: type || 'info'
  }));

  const { data, error } = await supabase
    .from('notifications')
    .insert(notifications)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ success: true, count: data.length, notifications: data });
});

module.exports = router;
