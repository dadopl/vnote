const nodemailer = require('nodemailer');

class EmailController {
    constructor() {
        this.transporter = null;
        this.initTransporter();
    }

    initTransporter() {
        const mailerDsn = process.env.MAILER_DSN;

        if (!mailerDsn) {
            console.warn('MAILER_DSN not configured - email sending disabled');
            return;
        }

        try {
            // Parse DSN format: smtp://user:password@host:port?encryption=tls
            const url = new URL(mailerDsn);

            this.transporter = nodemailer.createTransport({
                host: url.hostname,
                port: parseInt(url.port) || 587,
                secure: url.port === '465',
                auth: {
                    user: decodeURIComponent(url.username),
                    pass: decodeURIComponent(url.password)
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            console.log('Email transporter initialized');
        } catch (error) {
            console.error('Failed to initialize email transporter:', error.message);
        }
    }

    async send(req, res) {
        try {
            const { recipient, subject, rawText, correctedText, text, textType } = req.body;

            if (!recipient) {
                return res.status(400).json({ error: 'Recipient email is required' });
            }

            if (!this.transporter) {
                return res.status(500).json({
                    error: 'Email service not configured. Set MAILER_DSN in .env.local'
                });
            }

            // Build email body based on textType
            let body = '';

            if (textType === 'raw' || textType === 'both') {
                body += '=== Raw Text ===\n\n' + (rawText || '') + '\n\n';
            }

            if (textType === 'corrected' || textType === 'both') {
                body += '=== Corrected Text ===\n\n' + (correctedText || text || '') + '\n\n';
            }

            if (!body.trim()) {
                return res.status(400).json({ error: 'No text content to send' });
            }

            const mailOptions = {
                from: process.env.MAIL_FROM || this.transporter.options.auth.user,
                to: recipient,
                subject: subject || 'Voice Notes',
                text: body
            };

            await this.transporter.sendMail(mailOptions);

            res.json({ success: true, message: 'Email sent successfully' });

        } catch (error) {
            console.error('Email send error:', error);
            res.status(500).json({ error: 'Failed to send email: ' + error.message });
        }
    }
}

module.exports = new EmailController();

