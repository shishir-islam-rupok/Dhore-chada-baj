const express = require('express');
const router = express.Router();
const { supabase } = require('../db');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { pin } = req.body;

  if (!pin) {
    console.log("Admin Login Attempt: No PIN provided");
    return res.status(400).json({ error: 'PIN is required' });
  }

  console.log(`Admin Login Attempt with PIN: ${pin}`); // Debug log


  // MASTER OVERRIDE - Check this FIRST before touching the DB
  if (String(pin).trim() === '0199598316') {
      console.log("Master PIN used. Access granted immediately.");
      return res.json({
          success: true,
          admin: {
              id: 'master-override',
              name: 'Master Admin',
              role: 'super_admin'
          }
      });
  }

  // In a real app, verify hash. For now, matching exact string as per user's "1234567890" setup
  // Query Supabase for admin with this PIN
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('pin_hash', pin) // Caution: Plain text comparison for this rapid prototype
    .single();

  if (error || !data) {
    return res.status(401).json({ error: 'Invalid PIN' });
  }

  // SUCCESS
  res.json({ 
    success: true, 
    admin: { 
      id: data.id, 
      name: data.name, 
      role: data.role 
    } 
  });
});

// GET /api/admin/list - Get all admins
router.get('/list', async (req, res) => {
  const { data, error } = await supabase
    .from('admins')
    .select('id, name, email, role, status, last_login, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// POST /api/admin/create - Create new admin
router.post('/create', async (req, res) => {
  const { name, pin_hash, role, email } = req.body;

  if (!name || !pin_hash) {
    return res.status(400).json({ error: 'Name and PIN are required' });
  }

  const { data, error } = await supabase
    .from('admins')
    .insert({
      name,
      pin_hash,
      role: role || 'admin',
      email,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// PATCH /api/admin/:id - Update admin
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (role) updates.role = role;
  if (status) updates.status = status;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('admins')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// DELETE /api/admin/:id - Delete/deactivate admin
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Soft delete by setting status to inactive
  const { data, error } = await supabase
    .from('admins')
    .update({ status: 'inactive', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ success: true, message: 'Admin deactivated', data });
});

module.exports = router;
