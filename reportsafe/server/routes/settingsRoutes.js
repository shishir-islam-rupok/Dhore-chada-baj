const express = require('express');
const router = express.Router();
const { supabase } = require('../db');

// GET /api/settings - Get all settings
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Convert to key-value object
  const settings = {};
  data.forEach(setting => {
    settings[setting.key] = setting.value;
  });

  res.json(settings);
});

// GET /api/settings/:key - Get specific setting
router.get('/:key', async (req, res) => {
  const { key } = req.params;

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Setting not found' });
  }

  res.json(data);
});

// PUT /api/settings/:key - Update setting
router.put('/:key', async (req, res) => {
  const { key } = req.params;
  const { value, description } = req.body;

  if (!value) {
    return res.status(400).json({ error: 'Value is required' });
  }

  const updates = {
    value,
    updated_at: new Date().toISOString()
  };

  if (description) updates.description = description;

  const { data, error } = await supabase
    .from('site_settings')
    .update(updates)
    .eq('key', key)
    .select()
    .single();

  if (error) {
    // If setting doesn't exist, create it
    const { data: newData, error: insertError } = await supabase
      .from('site_settings')
      .insert({ key, value, description })
      .select()
      .single();

    if (insertError) {
      return res.status(400).json({ error: insertError.message });
    }

    return res.json(newData);
  }

  res.json(data);
});

module.exports = router;
