const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const buildpackVersion = require('../../package.json').version;

class CompatEnvAdapter {
    static isExpired({ dateChanged, warnForDays }) {
        const today = new Date();
        today.setUTCHours(0); // start of today!
        const daysToWarn = isNaN(warnForDays) ? Infinity : warnForDays;
        const ttl =
            Math.min(CompatEnvAdapter.MAX_WARNING_DAYS, daysToWarn) *
            ONE_DAY_MS; // max is also default
        const elapsed = today - new Date(dateChanged || 0).getTime();
        return elapsed > ttl;
    }
    constructor(definitions) {
        this._sortedChanges = definitions.changes.slice().sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }

            if (nameA > nameB) {
                return 1;
            }

            return 0;
        });
    }
    apply(env) {
        const warnings = [];
        const mappedLegacyValues = {};
        for (const change of this._sortedChanges) {
            if (
                // If the project has not set or overridden this var, do not warn.
                !env.hasOwnProperty(change.name) ||
                // If this change has expired, do not warn.
                CompatEnvAdapter.isExpired(change)
            ) {
                continue;
            }

            switch (change.type) {
                case 'removed':
                    warnings.push(this.warnRemoved(change, env));
                    break;
                case 'renamed':
                    // If this env already uses the new name, don't overwrite it
                    // with the value of the old name.
                    if (
                        change.supportLegacy &&
                        !env.hasOwnProperty(change.update)
                    ) {
                        mappedLegacyValues[change.update] = env[change.name];
                    }
                    warnings.push(this.warnRenamed(change, env));
                    break;
                default:
                    break;
            }
        }
        return {
            env: {
                ...env,
                ...mappedLegacyValues
            },
            warnings
        };
    }
    warnRemoved(change, env) {
        return `Environment variable ${change.name} has been removed in ${
            CompatEnvAdapter.RELEASE_NAME
        }, because ${change.reason}.\nCurrent value is ${
            env[change.name]
        }, but it will be ignored.`;
    }
    warnRenamed(change, env) {
        let logMsg = `Environment variable ${change.name} has been renamed in ${
            CompatEnvAdapter.RELEASE_NAME
        }. Its new name is ${change.update}.`;
        if (change.supportLegacy) {
            if (!env.hasOwnProperty(change.update)) {
                logMsg +=
                    '\nThe old variable will continue to work for the next several versions, but it will eventually be removed. Please migrate it as soon as possible.';
            }
        } else {
            logMsg += `\nThe old variable is no longer functional. Please migrate to the new ${
                change.update
            } variable as soon as possible.`;
        }
        return logMsg;
    }
}

CompatEnvAdapter.MAX_WARNING_DAYS = 180; // 6 mos

CompatEnvAdapter.RELEASE_NAME = `PWA Studio Buildpack v${buildpackVersion}`;

module.exports = CompatEnvAdapter;
