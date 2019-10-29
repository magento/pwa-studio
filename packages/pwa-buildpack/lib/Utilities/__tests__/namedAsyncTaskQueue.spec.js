jest.useFakeTimers();

const namedAsyncTaskQueue = require('../namedAsyncTaskQueue');

const wait = ms => new Promise(res => setTimeout(res, ms));
const be = msg => () => Promise.resolve(msg);
const push = arr => item => arr.push(item);
const die = msg => Promise.reject(new Error(msg));

// jest.useFakeTimers turns timers synchronous, but not promises.
// see https://github.com/facebook/jest/pull/5171
// in the meantime, this function unsticks the works
const runTimers = async (timeout = 0) => {
    Promise.resolve().then(() => {
        if (timeout) {
            jest.advanceTimersByTime(timeout);
        } else {
            jest.runAllTimers();
        }
        jest.runAllImmediates();
        jest.runAllTicks();
    });
    await wait(timeout);
};

const runTimersX = async num => {
    while(num--) {
        await runTimers();
    }
}

test('runs a task if empty', () =>
    new Promise(async done => {
        expect.assertions(5);
        const tasks = namedAsyncTaskQueue('consciousness');
        tasks.on('error', error => {
            expect(error).toHaveProperty('message');
            expect(error.message).toMatch(
                /Errors occurred while running NamedAsyncTaskQueue\[consciousness\]/
            );
            expect(error.message).toMatch(/alive/);
            done();
        });
        const results = [];
        const moment = () =>
            wait(500)
                .then(be('happy'))
                .then(push(results));
        tasks.add(moment, 'wait and be happy');
        const life = () =>
            be('alive')()
                .then(die)
                .then(push(results));
        tasks.add(life, 'be alive for a time you cannot subjectively measure');
        await runTimers();
        expect(results).toHaveLength(1);
        expect(results[0]).toBe('happy');
    }));

test('runs async tasks serially', () => new Promise(async done => {
    const path = 'discontent->ennui->compassion->detachment';
    const taken = [];
    const tasks = namedAsyncTaskQueue('transcendence');
    const wallow = () =>
        wait(500)
            .then(be('discontent'))
            .then(push(taken));
    const reward = () =>
        wait(2)
            .then(be('ennui'))
            .then(push(taken));
    const lesson = () => be('compassion')().then(push(taken));
    const growth = () =>
        wait(600)
            .then(be('detachment'))
            .then(push(taken));
    tasks.add(
        wallow,
        'spin the fluff of your dismay into a gossamer thread of lost time'
    );
    await runTimers(150);
    tasks.add(reward, 'seek oblivion, find only loneliness');
    tasks.add(lesson, 'learn it is pain that isolates everyone');
    tasks.add(growth, 'become distinguisable from all suffering');

    await runTimersX(4);

    expect(taken.join('->')).toEqual(path);
    done();
}));

test('reports emptiness accurately', async () => {
    const tasks = namedAsyncTaskQueue('empties slowly');
    expect(tasks.isEmpty()).toBe(true);
    tasks.add(() => wait(200));
    expect(tasks.isEmpty()).toBe(false);
    await runTimers(250);
    expect(tasks.isEmpty()).toBe(true);
    tasks.add(() => wait(10));
    tasks.add(() => wait(20));
    tasks.add(() => wait(200));
    await runTimers(150);
    expect(tasks.isEmpty()).toBe(false);
    await runTimersX(2);
    expect(tasks.isEmpty()).toBe(true);
});

test('emits empty event', async () => {
    let times = 0;
    const tasks = namedAsyncTaskQueue('low volume');
    tasks.on('empty', () => {
        times++;
    });
    tasks.add(() => wait(1000));
    await jest.advanceTimersByTime(400); // wait(400);;
    expect(times).toEqual(0);
    await jest.advanceTimersByTime(700); // wait(700);;
    expect(times).toEqual(1);

    let justInTime = false;
    tasks.add(() => {}, 'do nothing');
    tasks.on('empty', () => {
        justInTime = true;
    });
    await jest.advanceTimersByTime(100); // wait(100);;
    expect(times).toEqual(2);
    expect(justInTime).toBe(true);
});

test('deals with non-async jobs that do not return promises', async () => {
    const tasks = namedAsyncTaskQueue('I.D.I.C.');
    const reports = [];
    tasks.add(async () => {
        await jest.advanceTimersByTime(100); // wait(100);;
        reports.push('async1');
    });
    tasks.add(() => {
        reports.push('async2');
    });
    await jest.advanceTimersByTime(500); // wait(500);;
});

test('handles when a task throws synchronously', async () => {
    expect.assertions(3);
    const tasks = namedAsyncTaskQueue('mistakes are made');
    tasks.on('error', e => {
        expect(e.message).toMatch(/Sync error/);
        expect(tasks.isEmpty()).toBe(true);
    });
    expect(() =>
        tasks.add(() => {
            throw new Error('Sync error');
        }, 'its a sync thing you wouldnt understand')
    ).not.toThrowError();
    await jest.advanceTimersByTime(100); // wait(100);;
});

test('handles when a task throws asynchronously', async () => {
    expect.assertions(3);
    const tasks = namedAsyncTaskQueue("mistakes will have been maden't");
    tasks.on('error', e => {
        expect(e.message).toMatch(/Async error/);
        expect(tasks.isEmpty()).toBe(true);
    });
    expect(() =>
        tasks.add(async () => {
            await wait(400);
            throw new Error('Async error');
        }, 'an error is an error')
    ).not.toThrowError();
    await jest.advanceTimersByTime(1000); // wait(1000);;
});

test('reports errors appropriately', async () => {
    expect.assertions(3);
    const tasks = namedAsyncTaskQueue();
    expect(tasks.getError()).toBeNull();
    tasks.add(() => die('messed up du'));
    tasks.on('error', e => {
        expect(e.message).toEqual(tasks.getError().message);
    });
    await jest.advanceTimersByTime(123); // wait(123);;
    expect(tasks.getError()).not.toBeNull();
});
