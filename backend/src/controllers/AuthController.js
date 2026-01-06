const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

class AuthController {
    constructor() {
        this.usersFilePath = path.join(__dirname, '../config/users.json');
    }

    getUsers() {
        const data = fs.readFileSync(this.usersFilePath, 'utf8');
        return JSON.parse(data);
    }

    md5(text) {
        return crypto.createHash('md5').update(text).digest('hex');
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const users = this.getUsers();
            const passwordHash = this.md5(password);

            const user = users.find(u => u.email === email && u.passwordHash === passwordHash);

            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            req.session.user = { email: user.email };

            return res.json({
                success: true,
                user: { email: user.email }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Login failed' });
        }
    }

    async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ error: 'Logout failed' });
                }
                res.clearCookie('connect.sid');
                return res.json({ success: true });
            });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({ error: 'Logout failed' });
        }
    }

    async getSession(req, res) {
        if (req.session && req.session.user) {
            return res.json({
                authenticated: true,
                user: req.session.user
            });
        }
        return res.json({ authenticated: false });
    }
}

module.exports = new AuthController();

