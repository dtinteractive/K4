var passport = require('passport'),
    GitHubApi = require('github'),
    _ = require('lodash'),
    github = new GitHubApi({
        version: '3.0.0',
        protocol: 'https'
    });

module.exports = function (app) {
    // Login
    app.get('/login', function(req, res) {
        res.render('login', { user: req.user });
    });

    // Logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    // Github OAuth
    app.get('/auth/github', passport.authenticate('github'), function(req, res) {});

    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
        console.log(req.user);
        // Use the oauth token to authenticate the following github requests
        github.authenticate({
            type: 'oauth',
            token: req.user.oauthToken
        });
        github.user.getOrgs({}, function (err, orgs) {
            console.log(orgs);
            _.filter(orgs, function (org) {
                return org.login === 'dtinteractive';
            });
            if (orgs.length > 0) {
                res.redirect('/');
            } else {
                res.redirect('/login');
            }
        });
    });
};
