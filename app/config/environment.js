module.exports = function(environment) {
    var ENV = {
        contentSecurityPolicy: {
            'default-src': "'self' 'http://localhost:*/*' 'http://fonts.gstatic.com/*'",
            'style-src': "'self' 'unsafe-inline' http://fonts.googleapis.com/",
            'font-src': "'self' http://fonts.googleapis.com/",
        }
    }
};
