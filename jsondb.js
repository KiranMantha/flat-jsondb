// jsondb.js
import path from 'path';
import { JsonDB } from './dist/index.js';

const db = new JsonDB(path.resolve('data'));

async function init() {
  try {
    // Create tables for movies, actors, and years
    await db.createTable(['movies', 'actors', 'years']);

    // Insert a new movie record
    const rec = await db.insert('movies', {
      title: 'Mission Impossible'
    });
    console.log('Inserted Record:', rec);

    // Retrieve the inserted movie by ID
    const movieById = await db.getById('movies', rec[0].id);
    console.log('Movie by ID:', movieById);

    // Update the inserted movie to mark it as a favorite
    const updatedMovie = await db.updateById('movies', rec[0].id, {
      favorite: true
    });
    console.log('Updated Movie:', updatedMovie);

    // Insert another movie record
    await db.insert('movies', {
      title: 'Twilight'
    });

    // Retrieve all movies
    const allMovies = await db.get('movies');
    console.log('All Movies:', allMovies);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

init();
