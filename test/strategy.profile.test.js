var fs = require('fs');
var GumroadStrategy = require('../lib/strategy');

describe('Strategy#userProfile', function() {
    var strategy =  new GumroadStrategy({
            clientID: 'ABC123',
            clientSecret: 'secret'
        },
        function() {});

    // mock
    strategy._oauth2.get = function(url, accessToken, callback) {
        if (url != 'https://api.gumroad.com/v2/user') { return callback(new Error('wrong url argument')); }
        if (accessToken != 'token') { return callback(new Error('wrong token argument')); }

        var body = fs.readFileSync('test/data/example.json', 'utf8');

        callback(null, body, undefined);
    };

    describe('loading profile', function() {
        var profile;

        before(function(done) {
            strategy.userProfile('token', function(err, p) {
                if (err) { return done(err); }
                profile = p;
                done();
            });
        });

        it('should parse profile', function() {
            expect(profile.provider).to.equal('gumroad');

            expect(profile.id).to.equal('G_-mnBf9b1j9A7a4ub4nFQ==');
            expect(profile.displayName).to.equal('John Smith');
            expect(profile.profileUrl).to.equal('https://gumroad.com/sailorjohn');
            expect(profile.emails).to.have.length(1);
            expect(profile.emails[0].value).to.equal('johnsmith@gumroad.com');
        });

        it('should set raw property', function() {
            expect(profile._raw).to.be.a('string');
        });

        it('should set json property', function() {
            expect(profile._json).to.be.an('object');
        });
    });

    describe('encountering an error', function() {
        var err, profile;

        before(function(done) {
            strategy.userProfile('wrong-token', function(e, p) {
                err = e;
                profile = p;
                done();
            });
        });

        it('should error', function() {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.constructor.name).to.equal('InternalOAuthError');
            expect(err.message).to.equal('Failed to fetch user profile');
        });

        it('should not load profile', function() {
            expect(profile).to.be.undefined;
        });
    });
});
