const path = require("path");
const db = require("./index")(path.resolve(__dirname, "./data"));
async function init() {
  await db.createTable(["movies", "actors", "years"]);
  //await db.createTable('movies');
  const rec = await db.insert("movies", {
    title: "Mission Impossible",
  });
  console.log(rec);
  console.log(db.getById("movies", rec[0].id));
  console.log(
    db.updateById("movies", rec[0].id, {
      favorite: true,
    })
  );
  await db.insert("movies", {
    title: "Twilight",
  });
  console.log(db.get("movies"));
}

init();
