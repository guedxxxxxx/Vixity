import sql from "@/app/api/utils/sql";

// Get tickets (all for admin, user's own for customers)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const isAdmin = searchParams.get('isAdmin') === 'true';

    let tickets;
    if (isAdmin) {
      // Get all tickets with user info and staff info
      tickets = await sql`
        SELECT t.*, 
               u.username as customer_username,
               u.email as customer_email,
               s.username as staff_username,
               sp.display_name as staff_display_name
        FROM tickets t
        JOIN users u ON t.user_id = u.id
        LEFT JOIN users s ON t.assigned_staff_id = s.id
        LEFT JOIN staff_profiles sp ON s.id = sp.user_id
        ORDER BY t.created_at DESC
      `;
    } else if (userId) {
      // Get user's own tickets
      tickets = await sql`
        SELECT t.*,
               s.username as staff_username,
               sp.display_name as staff_display_name
        FROM tickets t
        LEFT JOIN users s ON t.assigned_staff_id = s.id
        LEFT JOIN staff_profiles sp ON s.id = sp.user_id
        WHERE t.user_id = ${userId}
        ORDER BY t.created_at DESC
      `;
    } else {
      return Response.json({ error: 'User ID required' }, { status: 400 });
    }

    return Response.json({ tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    return Response.json({ error: 'Failed to get tickets' }, { status: 500 });
  }
}

// Create ticket
export async function POST(request) {
  try {
    const { userId, orderSummary, totalPrice } = await request.json();

    if (!userId || !orderSummary) {
      return Response.json({ error: 'User ID and order summary required' }, { status: 400 });
    }

    const tickets = await sql`
      INSERT INTO tickets (user_id, order_summary, total_price, status)
      VALUES (${userId}, ${orderSummary}, ${totalPrice || null}, 'open')
      RETURNING *
    `;

    // Clear user's cart after creating ticket
    await sql`DELETE FROM cart_items WHERE user_id = ${userId}`;

    return Response.json({ ticket: tickets[0] });
  } catch (error) {
    console.error('Create ticket error:', error);
    return Response.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
