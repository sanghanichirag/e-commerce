const jwt = require('jsonwebtoken');

const jwt_secret = 'Admin_Login_jwt_secret';

const fetchuser = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(400).json({ error: 'Enter valid token in Header' });
        }
        try {
            let data = jwt.verify(token, jwt_secret);
            req.user = data;
            next();
        } catch (error) {
            return res.status(400).json({ error: 'Invalid Token' });
        }
    }
    else {
        return res.status(400).json({ error: 'Invalid Token' });
    }

}

module.exports = fetchuser;