import sql from "@/app/api/utils/sql";

// Add message to ticket
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { senderId, message, imageUrl } = await request.json();

    if (!senderId || (!message && !imageUrl)) {
      return Response.json({ error: 'Sender ID and message or image required' }, { status: 400 });
    }

    const messages = await sql`
      INSERT INTO ticket_messages (ticket_id, sender_id, message, image_url)
      VALUES (${id}, ${senderId}, ${message || null}, ${imageUrl || null})
      RETURNING *
    `;

    return Response.json({ message: messages[0] });
  } catch (error) {
    console.error('Add message error:', error);
    return Response.json({ error: 'Failed to add message' }, { status: 500 });
  }
}
