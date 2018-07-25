const jsondb = require('../jsondb');
const tempfile = require('tempfile');
const fs = require('graceful-fs');
const rimraf = require('rimraf');
const lodash = require('lodash');
const lodashid = require('lodash-id');
const _ = Object.assign({}, lodash, lodashid);

describe('jsondb', () => {
    let db;
    let tempdir = '';
    beforeEach(() => {
        tempdir = tempfile();
        db = jsondb(tempdir);    
        db.createTable('movies');    
    });

    afterEach(() => {
        fs.rmdirSync(tempdir);
    });

    test('create movies.json', () => {
        expect(fs.existsSync(tempdir + '/movies.json')).toBe(true);
    });

    test('create movies.json, actors.json', () => {
        db.createTable(['years', 'actors']);
        expect(fs.existsSync(tempdir + '/years.json')).toBe(true);
        expect(fs.existsSync(tempdir + '/actors.json')).toBe(true);
    });

    test('check _.createId', () => {
        expect(db._.createId()).toBeTruthy();
    });

    test('check insert', () => {
        const rec = db.insert('movies', { title: 'Mission Impossible' });
        expect(rec.title).toBe('Mission Impossible');
    });

    test('get on db', () => {
        db.insert('movies', { title: 'Mission Impossible' });
        const recs = db.get('movies');
        console.log(recs);
        expect(recs.length).toBe(1);
    })

    test('check getById', () => {
        const rec = db.insert('movies', { title: 'Mission Impossible' });
        const rec1 = db.getById('movies', rec.id);
        expect(rec1).toMatchObject(rec);
    });

    test('check dropTable', () => {
        db.dropTable('movies');
        expect(fs.existsSync(tempdir + '/movies.json')).toBe(false);
    });
});