const jwt = require('jsonwebtoken');
const { auth } = require('express-oauth2-jwt-bearer')
require('dotenv').config();

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const validateAccessToken = auth({
    audience: process.env.AUTHO_AUDIENCE,
    issuerBaseURL: process.env.AUTHO_BASE_URL,
    tokenSigningAlg: 'RS256'
});


// Middleware function to check access token scope
const checkRequiredPermissions = (requiredPermissions) => {
    return (req, res, next) => {
        // Extract the access token from the request headers
        const accessToken = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({ message: 'Access token missing' });
        }
        // Decode the access token payload
        const decodedToken = jwt.decode(accessToken);
        // Check if the decoded token has the 'permission' claim
        if (decodedToken && decodedToken.permissions) {
            // Check if the required permission exists
            const includesRequiredPermissions = requiredPermissions.every(permission => decodedToken.permissions.includes(permission));
            if (includesRequiredPermissions) {
                // User has the required permission
                next();
            } else {
                // User does not have the required permission
                return res.status(403).json({ message: 'Insufficient scope' });
            }
        } else {
            // 'scope' claim is missing
            return res.status(401).json({ message: 'Access token invalid' });
        }
    };
};

module.exports = {
    checkRequiredPermissions, validateAccessToken
};
