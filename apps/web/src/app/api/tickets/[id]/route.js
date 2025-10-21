import sql from "@/app/api/utils/sql";

// Get single ticket with messages
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const tickets = await sql`
      SELECT t.*,
             u.username as customer_username,
             u.email as customer_email,
             s.username as staff_username,
             sp.display_name as staff_display_name
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN users s ON t.assigned_staff_id = s.id
      LEFT JOIN staff_profiles sp ON s.id = sp.user_id
      WHERE t.id = ${id}
    `;

    if (tickets.length === 0) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Get messages
    const messages = await sql`
      SELECT tm.*, u.username, u.role
      FROM ticket_messages tm
      JOIN users u ON tm.sender_id = u.id
      WHERE tm.ticket_id = ${id}
      ORDER BY tm.created_at ASC
    `;

    return Response.json({ 
      ticket: tickets[0],
      messages 
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    return Response.json({ error: 'Failed to get ticket' }, { status: 500 });
  }
}

// Update ticket (admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (body.status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(body.status);
    }
    if (body.assigned_staff_id !== undefined) {
      updates.push(`assigned_staff_id = $${paramCount++}`);
      values.push(body.assigned_staff_id);
    }

    if (updates.length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE tickets SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const tickets = await sql(query, values);
    
    if (tickets.length === 0) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return Response.json({ ticket: tickets[0] });
  } catch (error) {
    console.error('Update ticket error:', error);
    return Response.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
