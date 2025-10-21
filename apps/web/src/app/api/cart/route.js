import sql from "@/app/api/utils/sql";

// Get user's cart
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'User ID required' }, { status: 400 });
    }

    const cartItems = await sql`
      SELECT ci.*, p.name, p.description, p.price, p.stock, p.image_url, p.category
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ${userId}
      ORDER BY ci.created_at DESC
    `;

    return Response.json({ cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    return Response.json({ error: 'Failed to get cart' }, { status: 500 });
  }
}

// Add item to cart
export async function POST(request) {
  try {
    const { userId, productId, quantity } = await request.json();

    if (!userId || !productId) {
      return Response.json({ error: 'User ID and product ID required' }, { status: 400 });
    }

    // Check if item already in cart
    const existing = await sql`
      SELECT * FROM cart_items 
      WHERE user_id = ${userId} AND product_id = ${productId}
    `;

    if (existing.length > 0) {
      // Update quantity
      const updated = await sql`
        UPDATE cart_items 
        SET quantity = quantity + ${quantity || 1}
        WHERE user_id = ${userId} AND product_id = ${productId}
        RETURNING *
      `;
      return Response.json({ cartItem: updated[0] });
    } else {
      // Insert new item
      const inserted = await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${userId}, ${productId}, ${quantity || 1})
        RETURNING *
      `;
      return Response.json({ cartItem: inserted[0] });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    return Response.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}
