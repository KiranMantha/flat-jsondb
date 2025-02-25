import { existsSync, mkdirSync, rmdirSync } from 'graceful-fs';
import path from 'path';
import { JsonDB } from '../src/index.js';

describe('JsonDB', () => {
  let db = null;
  const tempDir = path.join(__dirname, 'temp-db');

  beforeAll(async () => {
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir);
    }
    db = new JsonDB(tempDir);
    db.cleanCache();
    await db.createTable('movies');
  });

  afterEach(async () => {
    await db.truncateTable('movies');
  });

  afterAll(() => {
    db = null;
    if (existsSync(tempDir)) {
      rmdirSync(tempDir, { recursive: true });
    }
  });

  it('should create movies.json', () => {
    expect(existsSync(`${tempDir}/movies.json`)).toBe(true);
  });

  it('should create years.json and actors.json', async () => {
    await db.createTable(['years', 'actors']);
    expect(existsSync(`${tempDir}/years.json`)).toBe(true);
    expect(existsSync(`${tempDir}/actors.json`)).toBe(true);
    db.dropTable('years');
    db.dropTable('actors');
  });

  it('should have no records in a new table', async () => {
    const data = await db.get('movies');
    expect(data.length).toBe(0);
  });

  it('should insert a record', async () => {
    const rec = await db.insert('movies', { title: 'Mission Impossible' });
    expect(rec[0].title).toBe('Mission Impossible');
  });

  it('should insert multiple records', async () => {
    const rec = await db.insert('movies', [{ title: 'Mission Impossible' }, { title: 'Twilight' }]);
    expect(rec.length).toBe(2);
  });

  it('should retrieve records from the database', async () => {
    await db.insert('movies', { title: 'Mission Impossible' });
    const recs = await db.get('movies');
    expect(recs.length).toBeGreaterThan(0);
  });

  it('should return undefined for a non-existing table', async () => {
    const rec = await db.get('nonexistent');
    expect(rec).toBeUndefined();
  });

  it('should retrieve a record by ID', async () => {
    const rec = await db.insert('movies', { title: 'Mission Impossible' });
    const recById = await db.getById('movies', rec[0].id);
    expect(recById).toMatchObject(rec[0]);
  });

  it('should retrieve records with specific attributes', async () => {
    await db.insert('movies', [{ title: 'Mission Impossible' }, { title: 'Twilight' }]);
    const rec = await db.getWhere('movies', { title: 'Twilight' });
    expect(rec.length).toBe(1);
  });

  it('should update a record by ID', async () => {
    let rec = await db.insert('movies', { title: 'Mission Impossible' });
    rec = await db.updateById('movies', rec[0].id, { title: 'Twilight' });
    expect(rec.title).toBe('Twilight');
  });

  it('should update records with specific attributes', async () => {
    await db.insert('movies', { title: 'Mission Impossible' });
    const rec = await db.updateWhere('movies', { title: 'Mission Impossible' }, { title: 'Twilight' });
    expect(rec[0].title).toBe('Twilight');
  });

  it('should remove a record by ID', async () => {
    const rec = await db.insert('movies', { title: 'Mission Impossible' });
    await db.removeById('movies', rec[0].id);
    const recById = await db.getById('movies', rec[0].id);
    expect(recById).toBeFalsy();
  });

  it('should remove records with specific attributes', async () => {
    await db.insert('movies', [
      { title: 'Mission Impossible', favorite: true },
      { title: 'Twilight', favorite: true }
    ]);
    await db.removeWhere('movies', { favorite: true });
    const rec = await db.getWhere('movies', { favorite: true });
    expect(rec.length).toBe(0);
  });

  it('should truncate a table', async () => {
    const rec = await db.insert('movies', { title: 'Mission Impossible' });
    expect(rec.length).toBe(1);
    await db.truncateTable('movies');
    const emptyRec = await db.get('movies');
    expect(emptyRec.length).toBe(0);
  });

  it('should drop a table', async () => {
    db.dropTable('movies');
    expect(existsSync(`${tempDir}/movies.json`)).toBe(false);
  });
});
