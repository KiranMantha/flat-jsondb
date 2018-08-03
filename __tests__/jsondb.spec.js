const jsondb = require("../jsondb");
const path = require("path");
const fs = require("graceful-fs");
const lodash = require("lodash");
const lodashid = require("lodash-id");
const _ = Object.assign({}, lodash, lodashid);
const del = require('del');

describe("jsondb", () => {
  let db = null;
  let tempdir = path.join(__dirname, "temp-db");
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

  it("create movies.json", async() => {
    expect(fs.existsSync(tempdir + "/movies.json")).toBe(true);
  });

  it("create movies.json, actors.json", async () => {
    await db.createTable(["years", "actors"]);
    expect(fs.existsSync(tempdir + "/years.json")).toBe(true);
    expect(fs.existsSync(tempdir + "/actors.json")).toBe(true);
    db.dropTable("years");
    db.dropTable("actors");
  });

  it("check for records in new table", async () => {
    await db.createTable("actors");
    let data = db.get("actors");
    expect(data.length).toBe(0);
    db.dropTable("actors");
  });

  it("check insert", async () => {
    const rec = await db.insert("movies", {
      title: "Mission Impossible"
    });
    expect(rec[0].title).toBe("Mission Impossible");
  });

  it("insert arrayed data", async () => {
    const rec = await db.insert("movies", [
      { title: "Mission Impossible" },
      { title: "Twilight" }
    ]);

    expect(rec.length).toBe(2);
  });

  it("get on db", async () => {
    await db.insert("movies", {
      title: "Mission Impossible"
    });
    const recs = db.get("movies");
    expect(recs.length).toBeGreaterThan(0);
  });

  it("get on non-existing table", async () => {
    let rec = await db.get("it");
    expect(rec).toBeUndefined();
  });

  it("check getById", async () => {
    const rec = await db.insert("movies", {
      title: "Mission Impossible"
    });
    const rec1 = db.getById("movies", rec[0].id);
    expect(rec1).toMatchObject(rec[0]);
  });

  it("getWhere", async () => {
    await db.insert("movies", [
      { title: "Mission Impossible" },
      { title: "Twilight" }
    ]);

    let rec = db.getWhere("movies", { title: "Twilight" });
    expect(rec.length).toBe(1);
  });

  it("check updateById", async () => {
    let rec = await db.insert("movies", {
      title: "Mission Impossible"
    });
    rec = await db.updateById("movies", rec[0].id, {
      title: "Twilight"
    });
    expect(rec.title).toBe("Twilight");
  });

  it("check updateWhere",async () => {
    await db.insert("movies", {
      title: "Mission Impossible"
    });
    let rec = await db.updateWhere(
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

  it("removeById",async () => {
    let rec = await db.insert("movies", {
      title: "Mission Impossible"
    });
    db.removeById("movies", rec[0].id);
    rec = db.getById("movies", rec[0].id);
    expect(rec).toBeFalsy();
  });

  it("removeWhere", async() => {
    await db.insert("movies", [
      { title: "Mission Impossible", favorite: true },
      { title: "Twilight", favorite: true }
    ]);

    await db.removeWhere("movies", { favorite: true });
    let rec = db.getWhere("movies", { favorite: true });
    expect(rec.length).toBe(0);
  });

  it("truncateTable", async() => {
    let rec = await db.insert("movies", {
      title: "Mission Impossible"
    });
    expect(rec.length).toBe(1);
    db.truncateTable("movies");
    rec = await db.get("movies");
    expect(rec.length).toBe(0);
  });

  it("check dropTable", async() => {
    db.dropTable("movies");
    expect(fs.existsSync(tempdir + "/movies.json")).toBe(false);
  });
});
