var fs = require('fs');
var parse = require('../lib/profile').parse;


describe('profile.parse', function() {
    describe('example profile', function() {
        var profile;

        before(function(done) {
            fs.readFile('test/data/example.json', 'utf8', function(err, data) {
                if (err) { return done(err); }
                profile = parse(data);
                done();
            });
        });

        it('should parse profile', function() {
            expect(profile.id).to.equal('G_-mnBf9b1j9A7a4ub4nFQ==');
            expect(profile.displayName).to.equal('John Smith');
            expect(profile.profileUrl).to.equal('https://gumroad.com/sailorjohn');
            expect(profile.emails).to.have.length(1);
            expect(profile.emails[0].value).to.equal('johnsmith@gumroad.com');
        });
    });
});
