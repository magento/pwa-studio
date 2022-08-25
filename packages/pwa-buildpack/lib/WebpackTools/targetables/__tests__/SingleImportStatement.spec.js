const SingleImportStatement = require('../SingleImportStatement');

test('feeds back good error on nonstring argument', () => {
    expect(() => new SingleImportStatement(8)).toThrowError(
        'Bad import statement'
    );
});

test('feeds back good error on bad syntax argument', () => {
    expect(() => new SingleImportStatement('aj kasd k //')).toThrowError(
        `Bad import statement`
    );
});

test('feeds back good error on valid JS that is not an import declaration', () => {
    expect(
        () => new SingleImportStatement('import("dynamically")')
    ).toThrowError('Bad import statement');
});

test('feeds back good error on multiple bindings', () => {
    [
        'import { Potato, Corn } from "@vandelay/industries.chips"',
        'import Chips, { Potato, Corn } from "@vandelay/industries.chips"',
        '* as Latex, { Diapers } from "./vandelay/exports"',
        '{ Potato as Chips, Corn as Popcorn, Salt } from "./vandelay/exports"'
    ].forEach(stmt => {
        expect(() => new SingleImportStatement(stmt)).toThrowError(
            'exactly one binding'
        );
    });
});

test('contains parsed node, statement, and binding, adding import keyword and semicolon if necessary', () => {
    [
        'LongMatches from "@vandelay/industries";',
        'import Chips from "@vandelay/industries.chips";',
        'import { Potato as Chips } from "@vandelay/industries.chips"',
        'import { Corn } from "@vandelay/industries.chips"',
        '* as Latex from "./vandelay/exports"'
    ].forEach(stmt => {
        expect(new SingleImportStatement(stmt)).toMatchSnapshot({
            node: expect.objectContaining({ type: 'ImportDeclaration' })
        });
    });
});

test('changeBinding on a default import returns a new instance with changes', () => {
    const statement = new SingleImportStatement(
        'LongMatches from "@vandelay/industries"'
    );
    expect(statement).toMatchObject({
        binding: 'LongMatches',
        imported: 'default',
        statement: 'import LongMatches from "@vandelay/industries";\n'
    });
    expect(statement.changeBinding('shorter_matches')).toMatchObject({
        binding: 'shorter_matches',
        imported: 'default',
        statement: 'import shorter_matches from "@vandelay/industries";\n'
    });
});

test('changeBinding on a direct named import returns a new instance with changes', () => {
    const statement = new SingleImportStatement(
        '{ Potato } from "@vandelay/industries"'
    );
    expect(statement).toMatchObject({
        binding: 'Potato',
        imported: 'Potato',
        statement: 'import { Potato } from "@vandelay/industries";\n'
    });
    expect(statement.changeBinding('spud$dd')).toMatchObject({
        binding: 'spud$dd',
        imported: 'Potato',
        statement: 'import { Potato as spud$dd } from "@vandelay/industries";\n'
    });
});

test('changeBinding on an already aliased import returns a new instance with changes', () => {
    const statement = new SingleImportStatement(
        '{ Potato as Tater } from "@vandelay/industries"'
    );
    expect(statement).toMatchObject({
        binding: 'Tater',
        imported: 'Potato',
        statement: 'import { Potato as Tater } from "@vandelay/industries";\n'
    });
    expect(statement.changeBinding('spud$dd')).toMatchObject({
        binding: 'spud$dd',
        imported: 'Potato',
        statement: 'import { Potato as spud$dd } from "@vandelay/industries";\n'
    });
});

test('changeBinding on an aliased namespace import returns a new instance with changes', () => {
    const statement = new SingleImportStatement(
        '* as Imports from "@vandelay/industries"'
    );
    expect(statement).toMatchObject({
        binding: 'Imports',
        imported: '*',
        statement: 'import * as Imports from "@vandelay/industries";\n'
    });
    expect(statement.changeBinding('Lies')).toMatchObject({
        binding: 'Lies',
        imported: '*',
        statement: 'import * as Lies from "@vandelay/industries";\n'
    });
});
