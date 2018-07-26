const jsondb = require('../jsondb');
const path = require('path');
const fs = require('graceful-fs');
const del = require('del');
const lodash = require('lodash');
const lodashid = require('lodash-id');
const _ = Object.assign({}, lodash, lodashid);

describe('jsondb', () => {
    let db = null;
    let tempdir = path.normalize(__dirname + '/temp-db');
    beforeAll(() => {
        fs.mkdirSync(tempdir);
        db = jsondb(tempdir);
    });

    beforeEach(() => {
        db.cleanCache();
        db.createTable('movies');
    });

    afterEach(() => {
        db.dropTable('movies');
    });

    afterAll(() => {
        del.sync(tempdir + '/**', {
            force: true
        });
        db = null;
    })

    test('create movies.json', () => {
        expect(fs.existsSync(tempdir + '/movies.json')).toBe(true);
    });

    test('create movies.json, actors.json', () => {
        db.createTable(['years', 'actors']);
        expect(fs.existsSync(tempdir + '/years.json')).toBe(true);
        expect(fs.existsSync(tempdir + '/actors.json')).toBe(true);
    });

    test('check for records in new table', () => {
        db.createTable('actors');
        let data = db.get('actors');
        expect(data.length).toBe(0);
    });

    test('check _.createId', () => {
        expect(db._.createId()).toBeTruthy();
    });

    test('check insert', () => {
        const rec = db.insert('movies', {
            title: 'Mission Impossible'
        });
        expect(rec.title).toBe('Mission Impossible');
        db.cleanCache();
    });

    test('get on db', () => {
        db.insert('movies', {
            title: 'Mission Impossible'
        });
        const recs = db.get('movies');
        expect(recs.length).toBeGreaterThan(0);
        db.cleanCache();
    })

    test('check getById', () => {
        const rec = db.insert('movies', {
            title: 'Mission Impossible'
        });
        const rec1 = db.getById('movies', rec.id);
        expect(rec1).toMatchObject(rec);
        db.cleanCache();
    });

    test('check updateById', () => {
        let rec = db.insert('movies', {
            title: 'Mission Impossible'
        });
        rec = db.updateById('movies', rec.id, {
            title: 'Twilight'
        });
        expect(rec.title).toBe('Twilight');
        db.cleanCache();
    });

    test('check updateWhere', () => {
        let rec = db.insert('movies', {
            title: 'Mission Impossible'
        });
        rec = db.updateWhere('movies', {
            title: 'Mission Impossible'
        }, {
            title: 'Twilight'
        });
        console.log(rec);
        expect(rec.title).toBe('Twilight');
        db.cleanCache();
    });

    test('check dropTable', () => {
        db.dropTable('movies');
        expect(fs.existsSync(tempdir + '/movies.json')).toBe(false);
    });
});