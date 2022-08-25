const { inspect } = require('util');
const spliceLoader = require('../loaders/splice-source-loader');
const { evalEsModule, runLoader } = require('../../TestHelpers');

const bard = `
const sonnet134 = \`
So, now I have confess'd that he is thine,
And I my self am mortgag'd to thy will,
Myself I'll forfeit, so that other mine
Thou wilt restore to be my comfort still:
But thou wilt not, nor he will not be free,
For thou art covetous, and he is kind;
He learn'd but surety-like to write for me,
Under that bond that him as fast doth bind.
The statute of thy beauty thou wilt take,
Thou usurer, that putt'st forth all to use,
And sue a friend came debtor for my sake;
So him I lose through my unkind abuse.
Him have I lost; thou hast both him and me:
He pays the whole, and yet am I not free.\`;

export default function() {
    return sonnet134;
}
`;

const runSpliceLoader = async instructions => {
    const result = await runLoader(spliceLoader, bard, { query: instructions });
    const errors = [];
    result.context.getCalls('emitError').forEach(([emitted]) => {
        if (!(emitted instanceof Error)) {
            throw new Error(
                `this.emitError called with non-error ${emitted}. Instructions: ${inspect(
                    instructions
                )}`
            );
        }
        errors.push(emitted.message);
    });
    return {
        output: result.output,
        error: errors.length === 1 ? errors[0] : errors
    };
};

const failSpliceLoader = async instructions => {
    const result = await runSpliceLoader(instructions);
    expect(result.output).toEqual(bard);
    return result.error;
};

describe('errors if', () => {
    it('there is no "insert" or "remove" in instruction', async () => {
        await expect(failSpliceLoader([{ at: 100 }])).resolves.toMatch(
            'Nothing to insert or remove'
        );
    });

    it('"insert" is not a string', async () => {
        await expect(
            failSpliceLoader([{ insert: {}, at: 100 }])
        ).resolves.toMatch('An "insert" property must be a string.');
    });

    it('"remove" is not a nonnegative int', async () => {
        const error = await failSpliceLoader(
            [-99, 1.5, NaN, undefined].map(remove => ({ remove }))
        );
        expect(error).toHaveLength(4);
        error.forEach(msg =>
            expect(msg).toMatch(
                'A "remove" property must be an integer greater than or equal to 0.'
            )
        );
    });

    it('conflicting options are given', async () => {
        await expect(
            failSpliceLoader([{ insert: 'iamb', at: 100, before: 'doth' }])
        ).resolves.toMatch('Must have one and only one');
    });
});

describe('the "at" property', () => {
    it('must be a nonnegative int', async () => {
        await expect(
            failSpliceLoader([{ insert: 'iamb', at: -100 }])
        ).resolves.toMatch(
            'An "at" property must be an integer greater than or equal to 0.'
        );
    });

    it('must be less than the source length', async () => {
        await expect(
            failSpliceLoader([{ insert: 'iamb', at: bard.length + 5 }])
        ).resolves.toMatch('Out of range');
    });

    it('inserts and/or removes at the specified numeric index', async () => {
        const { output, error } = await runSpliceLoader([
            { at: 243, insert: '(BONK BONK)', remove: 9 },
            { at: 21, insert: '(bonk bonk) ' },
            { at: 301, remove: 3 }
        ]);
        expect(error).toHaveLength(0);
        const sonnet = evalEsModule(output)();
        expect(sonnet).toMatch("\n(bonk bonk) So, now I have confess'd");
        expect(sonnet).toMatch('\nFor thou art (BONK BONK) and he is kind;');
        expect(sonnet).toMatch('sur-like');
    });
});

describe('the "before" property', () => {
    it('must be a nonempty string', async () => {
        const error = await failSpliceLoader(
            [null, ''].map(before => ({
                insert: '(burst of static)',
                before
            }))
        );

        expect(error).toHaveLength(2);
        error.forEach(msg =>
            expect(msg).toMatch(
                `A "before" property must be a non-empty string.`
            )
        );
    });

    it('errors if the string is not found in the source', async () => {
        await expect(
            failSpliceLoader([
                { insert: '(burst of static)', before: "putts'nt've" }
            ])
        ).resolves.toMatch('was not found');
    });

    it('inserts and/or removes before the first match of the search string', async () => {
        const before = "putt'st";
        const { output, error } = await runSpliceLoader([
            { insert: '(burst of static)', before, remove: before.length }
        ]);
        expect(error).toHaveLength(0);
        const sonnet = evalEsModule(output)();
        expect(sonnet).toMatch(
            'Thou usurer, that (burst of static) forth all to us'
        );
    });
});

describe('the "after" property', () => {
    it('must be a nonempty string', async () => {
        const error = await failSpliceLoader(
            [null, ''].map(after => ({
                insert: '(burst of static)',
                after
            }))
        );

        expect(error).toHaveLength(2);
        error.forEach(msg =>
            expect(msg).toMatch(
                `An "after" property must be a non-empty string.`
            )
        );
    });

    it('errors if the string is not found in the source', async () => {
        await expect(
            failSpliceLoader([
                { insert: '(burst of static)', after: "putts'nt've" }
            ])
        ).resolves.toMatch('was not found');
    });

    it('inserts and/or removes after the first match of the search string', async () => {
        const after = "putt'st";
        const { output, error } = await runSpliceLoader([
            { insert: ' (burst of static)', after }
        ]);
        expect(error).toHaveLength(0);
        const sonnet = evalEsModule(output)();
        expect(sonnet).toMatch(
            "Thou usurer, that putt'st (burst of static) forth all to us"
        );
    });
});
