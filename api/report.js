// api/report.js
// Serverless function to receive and forward creator profile reports to owner email and/or webhook.

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { id, creatorId, creatorName, creatorHandle, reason, details, contact, submittedAt } = req.body || {};

    if (!creatorId || !reason) {
      return res.status(400).json({ error: 'creatorId and reason are required.' });
    }

    const reportRecord = {
      id: id || `rep_${Date.now()}`,
      creatorId,
      creatorName: creatorName || 'Unknown',
      creatorHandle: creatorHandle || 'N/A',
      reason,
      details: details || 'No additional details provided',
      contact: contact || 'Anonymous',
      submittedAt: submittedAt || new Date().toISOString()
    };

    console.log('[Creator Profile Report Received]', reportRecord);

    const webhookUrl = process.env.REPORT_WEBHOOK_URL;
    const supportEmail = process.env.SUPPORT_EMAIL || 'support@bookcreator.in';

    // 1. Forward to Custom Webhook if set (e.g., Slack / Discord / Zapier / Make)
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚩 *Profile Reported on BookCreator.in*\n*Creator:* ${reportRecord.creatorName} (@${reportRecord.creatorHandle})\n*Reason:* ${reportRecord.reason}\n*Details:* ${reportRecord.details}\n*Reporter Contact:* ${reportRecord.contact}`,
            report: reportRecord
          })
        });
      } catch (webhookErr) {
        console.warn('[Report Webhook Dispatch Error]', webhookErr.message);
      }
    }

    // 2. Forward to Support Email via FormSubmit AJAX bridge
    try {
      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(supportEmail)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `[BookCreator Report] Flagged Profile: @${reportRecord.creatorHandle} (${reportRecord.reason})`,
          _template: 'table',
          report_id: reportRecord.id,
          creator_name: reportRecord.creatorName,
          creator_handle: `@${reportRecord.creatorHandle}`,
          report_reason: reportRecord.reason,
          details: reportRecord.details,
          reporter_contact: reportRecord.contact,
          submitted_at: reportRecord.submittedAt
        })
      });
    } catch (emailErr) {
      console.warn('[Report Email Dispatch Warning]', emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Report logged and dispatched to administrator.',
      reportId: reportRecord.id
    });
  } catch (err) {
    console.error('[API Report Error]', err);
    return res.status(500).json({ error: 'Internal server error processing report: ' + err.message });
  }
};
