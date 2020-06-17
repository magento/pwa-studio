const { sections, changes } = require('../../../envVarDefinitions.json');
const envalid = require('envalid');
const { isExpired, MAX_WARNING_DAYS } = require('../CompatEnvAdapter');

const NOT_BLANK = /.+/;
const VALID_ENV_VAR_NAME = /^[A-Z]+(?:_[A-Z0-9]+)*$/;
const validChangeTypes = new Set(['removed', 'renamed']);

describe('sections collection', () => {
    sections.forEach(({ name, variables }) => {
        describe(`"${name}" section`, () => {
            it('has a name and a variables collection', () => {
                expect(name).toMatch(NOT_BLANK); // not blank
                expect(variables).toBeDefined();
                expect(variables.length).toBeGreaterThan(0);
            });
            it('variables have valid names, types, and options', () => {
                variables.forEach(def => {
                    expect(def.name).toMatch(VALID_ENV_VAR_NAME);
                    expect(envalid[def.type]).toBeDefined();
                    expect(def.desc).toMatch(NOT_BLANK);
                    expect(() => envalid[def.type](def)).not.toThrow();
                });
            });
        });
    });
});

describe('changes collection', () => {
    it('contains recent changes for possibly warning the developer', () => {
        changes.forEach(change => {
            expect(change.name).toMatch(VALID_ENV_VAR_NAME);
            expect(validChangeTypes.has(change.type)).toBe(true);
            expect(change.reason).toMatch(NOT_BLANK);
            expect(change).toHaveProperty('dateChanged');
            const start = new Date(change.dateChanged).getTime();
            expect(isNaN(start)).toBeFalsy();
            expect(start).toBeGreaterThan(0);

            if (change.hasOwnProperty('warnForDays')) {
                const duration = new Date(change.warnForDays).getTime();
                expect(isNaN(duration)).toBeFalsy();
                expect(duration).toBeGreaterThan(0);
                expect(duration).toBeLessThanOrEqual(MAX_WARNING_DAYS);
            }

            expect(
                isExpired(
                    change.dateChanged,
                    change.warnForDays,
                    MAX_WARNING_DAYS
                )
            ).not.toBeFalsy();
        });
    });
});
