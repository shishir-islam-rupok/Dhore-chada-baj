const express = require('express');
const router = express.Router();
const { supabase } = require('../db');

// GET /api/reports - Fetch all reports
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase Error:', error);
    return res.status(500).json({ error: error.message });
  }
  
  res.json(data);
});

// POST /api/reports - Create a new report
router.post('/', async (req, res) => {
  const { type, description, location, incidentDate, anonymous } = req.body;

  // Map to DB column names (assuming snake_case in Supabase)
  const { data, error } = await supabase
    .from('reports')
    .insert([
      { 
        type, 
        description, 
        location, 
        incident_date: incidentDate, 
        anonymous,
        user_id: req.body.user_id || null, // Include user_id if provided
        evidence_url: req.body.evidence_url || null
      }
    ])
    .select();

  if (error) {
    console.error('Supabase Error:', error);
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

// PATCH /api/reports/:id/status - Update report status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const { data, error } = await supabase
    .from('reports')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Supabase Error:', error);
    return res.status(400).json({ error: error.message });
  }

  res.json(data[0]);
});

// GET /api/reports/:id/pdf - Generate and download report as PDF
router.get('/:id/pdf', async (req, res) => {
  const { id } = req.params;

  // Fetch report data
  const { data: report, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  try {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${id}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Header with branding
    doc.fontSize(24)
       .fillColor('#10b981')
       .text('Dhore Chada Baj', { align: 'center' })
       .moveDown(0.5);

    doc.fontSize(12)
       .fillColor('#64748b')
       .text('Report Document', { align: 'center' })
       .moveDown(2);

    // Report ID
    doc.fontSize(10)
       .fillColor('#94a3b8')
       .text('Report ID:', 50, doc.y)
       .fontSize(10)
       .fillColor('#1e293b')
       .text(report.id, 150, doc.y - 12)
       .moveDown(1.5);

    // Report Type
    doc.fontSize(14)
       .fillColor('#10b981')
       .text('Report Type', 50, doc.y)
       .moveDown(0.3);
    doc.fontSize(12)
       .fillColor('#1e293b')
       .text(report.type, 50, doc.y)
       .moveDown(1.5);

    // Description
    doc.fontSize(14)
       .fillColor('#10b981')
       .text('Description', 50, doc.y)
       .moveDown(0.3);
    doc.fontSize(12)
       .fillColor('#1e293b')
       .text(report.description, 50, doc.y, { width: 500 })
       .moveDown(1.5);

    // Location
    doc.fontSize(14)
       .fillColor('#10b981')
       .text('Location', 50, doc.y)
       .moveDown(0.3);
    doc.fontSize(12)
       .fillColor('#1e293b')
       .text(report.location, 50, doc.y)
       .moveDown(1.5);

    // Incident Date
    doc.fontSize(14)
       .fillColor('#10b981')
       .text('Incident Date', 50, doc.y)
       .moveDown(0.3);
    doc.fontSize(12)
       .fillColor('#1e293b')
       .text(new Date(report.incident_date).toLocaleDateString(), 50, doc.y)
       .moveDown(1.5);

    // Submission Date
    doc.fontSize(14)
       .fillColor('#10b981')
       .text('Submitted On', 50, doc.y)
       .moveDown(0.3);
    doc.fontSize(12)
       .fillColor('#1e293b')
       .text(new Date(report.created_at).toLocaleString(), 50, doc.y)
       .moveDown(1.5);

    // Status
    doc.fontSize(14)
       .fillColor('#10b981')
       .text('Status', 50, doc.y)
       .moveDown(0.3);
    doc.fontSize(12)
       .fillColor('#1e293b')
       .text((report.status || 'pending').toUpperCase(), 50, doc.y)
       .moveDown(2);

    // Footer
    doc.fontSize(10)
       .fillColor('#94a3b8')
       .text('This is an official report document from Dhore Chada Baj', 50, doc.page.height - 100, {
         align: 'center',
         width: doc.page.width - 100
       });

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error('PDF Generation Error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

module.exports = router;
