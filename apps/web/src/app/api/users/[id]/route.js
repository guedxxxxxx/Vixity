import sql from "@/app/api/utils/sql";

// Get user profile
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const users = await sql`
      SELECT u.id, u.username, u.email, u.role,
             sp.display_name, sp.description, sp.role_title
      FROM users u
      LEFT JOIN staff_profiles sp ON u.id = sp.user_id
      WHERE u.id = ${id}
    `;

    if (users.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    return Response.json({ error: 'Failed to get user' }, { status: 500 });
  }
}

// Update user profile (admin only for staff profiles)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Update staff profile if provided
    if (body.display_name !== undefined || body.description !== undefined || body.role_title !== undefined) {
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (body.display_name !== undefined) {
        updates.push(`display_name = $${paramCount++}`);
        values.push(body.display_name);
      }
      if (body.description !== undefined) {
        updates.push(`description = $${paramCount++}`);
        values.push(body.description);
      }
      if (body.role_title !== undefined) {
        updates.push(`role_title = $${paramCount++}`);
        values.push(body.role_title);
      }

      if (updates.length > 0) {
        values.push(id);
        const query = `UPDATE staff_profiles SET ${updates.join(', ')} WHERE user_id = $${paramCount} RETURNING *`;
        await sql(query, values);
      }
    }

    // Get updated user
    const users = await sql`
      SELECT u.id, u.username, u.email, u.role,
             sp.display_name, sp.description, sp.role_title
      FROM users u
      LEFT JOIN staff_profiles sp ON u.id = sp.user_id
      WHERE u.id = ${id}
    `;

    return Response.json({ user: users[0] });
  } catch (error) {
    console.error('Update user error:', error);
    return Response.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
