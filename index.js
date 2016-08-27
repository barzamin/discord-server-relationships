const Discord = require('discord.js');

const config = require('./config.json');

const client = new Discord.Client({forceFetchUsers: true});
const serverId = process.argv[2];

const loginHandler = (err, token) => {
	if (err) {
		console.log("Error logging into Discord: " + err);
		return;
	} else {
		console.log("Logged into Discord with token " + token);
	}
};

if ('loginToken' in config) client.loginWithToken(config.loginToken, loginHandler);
else client.login(config.email, config.password, loginHandler);

client.on('ready', () => {
	const server = client.servers.get("id", serverId);
	console.log("Analyzing server \"" + server.name + "\" (" + serverId + ")");
	for (user of server.members.filter(m => m !== client.user)) {
		const mutuals = client.servers.filter(s => s !== server).filter(s => !!s.members.get(user.id));

		if (mutuals.length !== 0) {
			console.log("User " + user.username +
				" is mutual to you in the following servers other than \"" + server.name + "\": ")
			console.log(mutuals.map(m => m.name));
		}
	}
	console.log("Done analyzing server!");
	client.logout(() => process.exit());
});