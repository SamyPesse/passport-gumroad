var util = require('util');
var url = require('url');
var OAuth2Strategy = require('passport-oauth2');
var Profile = require('./profile');
var InternalOAuthError = OAuth2Strategy.InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Gumroad authentication strategy authenticates requests by delegating to
 * Gumroad using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Gumroad application's Client ID
 *   - `clientSecret`  your Gumroad application's Client Secret
 *   - `callbackURL`   URL to which Gumroad will redirect the user after granting authorization
 *   — `userAgent`     All API requests MUST include a valid User Agent string.
 *                     e.g: domain name of your application.
 *
 * Examples:
 *
 *     passport.use(new GumroadStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/gumroad/callback',
 *         userAgent: 'myapp.com'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    options = options || {};

    options.authorizationURL = options.authorizationURL || 'https://gumroad.com/oauth/authorize';
    options.tokenURL = options.tokenURL || 'https://gumroad.com/oauth/token';
    options.scopeSeparator = options.scopeSeparator || ',';
    options.customHeaders = options.customHeaders || {};

    if (!options.customHeaders['User-Agent']) {
        options.customHeaders['User-Agent'] = options.userAgent || 'passport-gumroad';
    }

    OAuth2Strategy.call(this, options, verify);
    this.name = 'gumroad';
    this._userProfileURL = options.userProfileURL || 'https://api.gumroad.com/v2/user';
    this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Gumroad.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `gumroad`
 *   - `id`               the user's Gumroad ID
 *   - `username`         the user's Gumroad username
 *   - `displayName`      the user's full name
 *   - `profileUrl`       the URL of the profile for the user on Gumroad
 *   - `emails`           the user's email addresses
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
    this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
        var json;

        if (err) {
            return done(new InternalOAuthError('Failed to fetch user profile', err));
        }

        try {
            json = JSON.parse(body);
        } catch (ex) {
            return done(new Error('Failed to parse user profile'));
        }

        var profile = Profile.parse(json);
        profile.provider  = 'gumroad';
        profile._raw = body;
        profile._json = json;

        done(null, profile);
    });
}

module.exports = Strategy;
