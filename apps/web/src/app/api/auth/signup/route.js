import sql from "@/app/api/utils/sql";
import argon2 from "argon2";

export async function POST(request) {
  try {
    const { username, password, email } = await request.json();

    if (!username || !password) {
      return Response.json({ error: 'Username and password required' }, { status: 400 });
    }

    // Check if username already exists
    const existing = await sql`SELECT id FROM users WHERE username = ${username}`;
    
    if (existing.length > 0) {
      return Response.json({ error: 'Username already taken' }, { status: 400 });
    }

    // Hash password
    const hash = await argon2.hash(password);

    // Create user
    const users = await sql`
      INSERT INTO users (username, password_hash, email, role)
      VALUES (${username}, ${hash}, ${email || null}, 'customer')
      RETURNING id, username, role, email
    `;

    const user = users[0];

    return Response.json({ user });
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ error: 'Signup failed' }, { status: 500 });
  }
}
