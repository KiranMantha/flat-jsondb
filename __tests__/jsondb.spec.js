const jsondb = require("../jsondb");
const path = require("path");
const fs = require("graceful-fs");
const del = require("del");
const lodash = require("lodash");
const lodashid = require("lodash-id");
const _ = Object.assign({}, lodash, lodashid);

describe("jsondb", () => {
  let db = null;
  let tempdir = path.normalize(__dirname + "/temp-db");
  beforeAll(() => {
    fs.mkdirSync(tempdir);
    db = jsondb(tempdir);
  });

  beforeEach(async () => {
    db.cleanCache();
    await db.createTable("movies");
  });

  afterEach(() => {
    db.truncateTable("movies");
  });

  afterAll(() => {
    del.sync(tempdir + "/**", {
      force: true
    });
    db = null;
  });

  test("create movies.json", () => {
    expect(fs.existsSync(tempdir + "/movies.json")).toBe(true);
  });

  test("create movies.json, actors.json", async () => {
    await db.createTable(["years", "actors"]);
    expect(fs.existsSync(tempdir + "/years.json")).toBe(true);
    expect(fs.existsSync(tempdir + "/actors.json")).toBe(true);
    db.dropTable("years");
    db.dropTable("actors");
  });

  test("check for records in new table", () => {
    db.createTable("actors");
    let data = db.get("actors");
    expect(data.length).toBe(0);
    db.dropTable("actors");
  });

  test("check insert", () => {
    const rec = db.insert("movies", {
      title: "Mission Impossible"
    });
    expect(rec[0].title).toBe("Mission Impossible");
  });

  test("insert arrayed data", () => {
    const rec = db.insert("movies", [
      { title: "Mission Impossible" },
      { title: "Twilight" }
    ]);

    expect(rec.length).toBe(2);
  });

  test("get on db", () => {
    db.insert("movies", {
      title: "Mission Impossible"
    });
    const recs = db.get("movies");
    expect(recs.length).toBeGreaterThan(0);
  });

  test("get on non-existing table", () => {
    let rec = db.get("test");
    expect(rec).toBeUndefined();
  });

  test("check getById", () => {
    const rec = db.insert("movies", {
      title: "Mission Impossible"
    });
    const rec1 = db.getById("movies", rec[0].id);
    expect(rec1).toMatchObject(rec[0]);
  });

  test("getWhere", () => {
    db.insert("movies", [
      { title: "Mission Impossible" },
      { title: "Twilight" }
    ]);

    let rec = db.getWhere("movies", { title: "Twilight" });
    expect(rec.length).toBe(1);
  });

  test("check updateById", () => {
    let rec = db.insert("movies", {
      title: "Mission Impossible"
    });
    rec = db.updateById("movies", rec[0].id, {
      title: "Twilight"
    });
    expect(rec.title).toBe("Twilight");
  });

  test("check updateWhere", () => {
    db.insert("movies", {
      title: "Mission Impossible"
    });
    let rec = db.updateWhere(
      "movies",
      {
        title: "Mission Impossible"
      },
      {
        title: "Twilight"
      }
    );
    expect(rec[0].title).toBe("Twilight");
  });

  test("removeById", () => {
    let rec = db.insert("movies", {
      title: "Mission Impossible"
    });
    db.removeById("movies", rec[0].id);
    rec = db.getById("movies", rec[0].id);
    expect(rec).toBeFalsy();
  });

  test("removeWhere", () => {
    db.insert("movies", [
      { title: "Mission Impossible", favorite: true },
      { title: "Twilight", favorite: true }
    ]);

    db.removeWhere("movies", { favorite: true });
    let rec = db.getWhere("movies", { favorite: true });
    expect(rec.length).toBe(0);
  });

  test("truncateTable", () => {
    let rec = db.insert("movies", {
      title: "Mission Impossible"
    });
    expect(rec.length).toBe(1);
    db.truncateTable("movies");
    rec = db.get("movies");
    expect(rec.length).toBe(0);
  });

  test("check dropTable", () => {
    db.dropTable("movies");
    expect(fs.existsSync(tempdir + "/movies.json")).toBe(false);
  });
});
