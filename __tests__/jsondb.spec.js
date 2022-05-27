const jsondb = require("../index");
const path = require("path");
const fs = require("graceful-fs");

describe("jsondb", () => {
  let db = null;
  let tempdir = path.join(__dirname, "temp-db");
  beforeAll(async () => {
    fs.mkdirSync(tempdir);
    db = jsondb(tempdir);
    db.cleanCache();
    await db.createTable("movies");
  });

  afterEach(async () => {
    await db.truncateTable("movies");
  });

  afterAll(() => {
    db = null;
  });

  it("create movies.json", () => {
    expect(fs.existsSync(tempdir + "/movies.json")).toBe(true);
  });

  it("create years.json, actors.json", async () => {
    await db.createTable(["years", "actors"]);
    expect(fs.existsSync(tempdir + "/years.json")).toBe(true);
    expect(fs.existsSync(tempdir + "/actors.json")).toBe(true);
    db.dropTable("years");
    db.dropTable("actors");
  });

  it("check for records in new table", async () => {
    let data = await db.get("movies");
    expect(data.length).toBe(0);
  });

  it("check insert", async () => {
    const rec = await db.insert("movies", {
      title: "Mission Impossible",
    });
    expect(rec[0].title).toBe("Mission Impossible");
  });

  it("insert arrayed data", async () => {
    const rec = await db.insert("movies", [
      {
        title: "Mission Impossible",
      },
      {
        title: "Twilight",
      },
    ]);

    expect(rec.length).toBe(2);
  });

  it("get on db", async () => {
    await db.insert("movies", {
      title: "Mission Impossible",
    });
    const recs = await db.get("movies");
    expect(recs.length).toBeGreaterThan(0);
  });

  it("get on non-existing table", async () => {
    let rec = await db.get("it");
    expect(rec).toBeUndefined();
  });

  it("check getById", async () => {
    const rec = await db.insert("movies", {
      title: "Mission Impossible",
    });
    const rec1 = await db.getById("movies", rec[0].id);
    expect(rec1).toMatchObject(rec[0]);
  });

  it("getWhere", async () => {
    await db.insert("movies", [
      {
        title: "Mission Impossible",
      },
      {
        title: "Twilight",
      },
    ]);

    let rec = await db.getWhere("movies", {
      title: "Twilight",
    });
    expect(rec.length).toBe(1);
  });

  it("check updateById", async () => {
    let rec = await db.insert("movies", {
      title: "Mission Impossible",
    });
    rec = await db.updateById("movies", rec[0].id, {
      title: "Twilight",
    });
    expect(rec.title).toBe("Twilight");
  });

  it("check updateWhere", async () => {
    await db.insert("movies", {
      title: "Mission Impossible",
    });
    let rec = await db.updateWhere(
      "movies",
      {
        title: "Mission Impossible",
      },
      {
        title: "Twilight",
      }
    );
    expect(rec[0].title).toBe("Twilight");
  });

  it("removeById", async () => {
    let rec = await db.insert("movies", {
      title: "Mission Impossible",
    });
    await db.removeById("movies", rec[0].id);
    rec = await db.getById("movies", rec[0].id);
    expect(rec).toBeFalsy();
  });

  it("removeWhere", async () => {
    await db.insert("movies", [
      {
        title: "Mission Impossible",
        favorite: true,
      },
      {
        title: "Twilight",
        favorite: true,
      },
    ]);

    await db.removeWhere("movies", {
      favorite: true,
    });
    let rec = await db.getWhere("movies", {
      favorite: true,
    });
    expect(rec.length).toBe(0);
  });

  it("truncateTable", async () => {
    let rec = await db.insert("movies", {
      title: "Mission Impossible",
    });
    expect(rec.length).toBe(1);
    await db.truncateTable("movies");
    rec = await db.get("movies");
    expect(rec.length).toBe(0);
  });

  it("check dropTable", async () => {
    db.dropTable("movies");
    expect(fs.existsSync(tempdir + "/movies.json")).toBe(false);
  });
});
