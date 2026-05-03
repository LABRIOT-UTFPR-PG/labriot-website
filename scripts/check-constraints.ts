import { openDb } from '../lib/db';

async function check() {
  const db = await openDb();
  const constraints = await db.all("SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'team' AND constraint_type = 'CHECK'");
  console.log(constraints);
  process.exit(0);
}

check();
