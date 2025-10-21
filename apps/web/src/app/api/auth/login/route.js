import sql from "@/app/api/utils/sql";
import argon2 from "argon2";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json({ error: 'Username and password required' }, { status: 400 });
    }

    // Check if user exists
    const users = await sql`SELECT * FROM users WHERE username = ${username}`;
    
    if (users.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];

    // Hash admin passwords on first login if they're still placeholder
    if (user.password_hash === 'placeholder') {
      // Admin hardcoded passwords
      const adminPasswords = {
        'guedx': 'Vx7#qP9rB2!',
        'ben': 'Nz4$kT8wX1@'
      };

      if (adminPasswords[username] && password === adminPasswords[username]) {
        // Hash and update the password
        const hash = await argon2.hash(password);
        await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${user.id}`;
        
        // Get staff profile if exists
        const profiles = await sql`SELECT * FROM staff_profiles WHERE user_id = ${user.id}`;
        const profile = profiles[0] || null;

        return Response.json({ 
          user: { 
            id: user.id, 
            username: user.username, 
            role: user.role,
            email: user.email 
          },
          profile
        });
      } else {
        return Response.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }

    // Verify password
    const valid = await argon2.verify(user.password_hash, password);
    
    if (!valid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Get staff profile if user is admin
    let profile = null;
    if (user.role === 'admin') {
      const profiles = await sql`SELECT * FROM staff_profiles WHERE user_id = ${user.id}`;
      profile = profiles[0] || null;
    }

    return Response.json({ 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        email: user.email 
      },
      profile
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}
