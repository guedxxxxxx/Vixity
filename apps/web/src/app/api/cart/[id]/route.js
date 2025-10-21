import sql from "@/app/api/utils/sql";

// Update cart item quantity
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { quantity } = await request.json();

    if (quantity === undefined) {
      return Response.json({ error: 'Quantity required' }, { status: 400 });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await sql`DELETE FROM cart_items WHERE id = ${id}`;
      return Response.json({ message: 'Item removed from cart' });
    }

    const updated = await sql`
      UPDATE cart_items 
      SET quantity = ${quantity}
      WHERE id = ${id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return Response.json({ error: 'Cart item not found' }, { status: 404 });
    }

    return Response.json({ cartItem: updated[0] });
  } catch (error) {
    console.error('Update cart item error:', error);
    return Response.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// Remove item from cart
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const deleted = await sql`DELETE FROM cart_items WHERE id = ${id} RETURNING *`;

    if (deleted.length === 0) {
      return Response.json({ error: 'Cart item not found' }, { status: 404 });
    }

    return Response.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Delete cart item error:', error);
    return Response.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}
