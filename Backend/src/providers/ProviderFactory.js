const ConsoleProvider = require("./ConsoleProvider");
const EmailProvider = require("./EmailProvider");

class ProviderFactory {
    static getProvider(channel) {
        switch (channel) {
            case "console":
                return ConsoleProvider;

            case "email":
                return EmailProvider;

            default:
                throw new Error(`Unsupported notification channel: ${channel}`);
        }
    }
}

module.exports = ProviderFactory;