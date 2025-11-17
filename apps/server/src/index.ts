import { Hono } from "hono";
import { HelloPath } from "./types";
import { db } from "./db";
import { records } from "./schema";
import { sql } from "drizzle-orm";

const app = new Hono();

// Initialize database tables on startup
async function initDb() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS records (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

initDb();

app.use("*", async (c, next) => {
  c.res.headers.set("Access-Control-Allow-Origin", "*");
  c.res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  c.res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  if (c.req.method === "OPTIONS") {
    return c.text("OK", 200);
  }
  await next();
});

app.get("/", (c) => {
  return c.json({
    random: Math.random(),
    string: `Hello ${Math.random()}!`
  } as HelloPath);
});

// GET route to read all records from the database
app.get("/records", async (c) => {
  try {
    const allRecords = await db.select().from(records);
    return c.json({
      success: true,
      data: allRecords,
      count: allRecords.length
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch records"
      },
      500
    );
  }
});

// POST route to save a new record to the database
app.post("/records", async (c) => {
  try {
    const body = await c.req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return c.json(
        {
          success: false,
          error: "Name is required and must be a string"
        },
        400
      );
    }

    const newRecord = await db.insert(records).values({ name }).returning();

    return c.json(
      {
        success: true,
        data: newRecord[0]
      },
      201
    );
  } catch (error) {
    console.error("Error creating record:", error);
    return c.json(
      {
        success: false,
        error: "Failed to create record"
      },
      500
    );
  }
});

export default { fetch: app.fetch, port: 5000 };
