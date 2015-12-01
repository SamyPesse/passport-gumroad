// Parse Gumroad user
// https://gumroad.com/api#user
function parse(json) {
    if ('string' == typeof json) {
        json = JSON.parse(json);
    }

    var profile = {};
    profile.id = String(json.user.user_id);
    profile.displayName = json.user.name;
    profile.profileUrl = json.user.url;
    if (json.user.email) {
        profile.emails = [{ value: json.user.email }];
    }

    return profile;
}

module.exports = {
    parse: parse
};
