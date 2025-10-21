import sql from "@/app/api/utils/sql";

// Get single product
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const products = await sql`SELECT * FROM products WHERE id = ${id}`;
    
    if (products.length === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ product: products[0] });
  } catch (error) {
    console.error('Get product error:', error);
    return Response.json({ error: 'Failed to get product' }, { status: 500 });
  }
}

// Update product (admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (body.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(body.name);
    }
    if (body.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(body.description);
    }
    if (body.price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(body.price);
    }
    if (body.stock !== undefined) {
      updates.push(`stock = $${paramCount++}`);
      values.push(body.stock);
    }
    if (body.category !== undefined) {
      updates.push(`category = $${paramCount++}`);
      values.push(body.category);
    }
    if (body.image_url !== undefined) {
      updates.push(`image_url = $${paramCount++}`);
      values.push(body.image_url);
    }

    if (updates.length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const products = await sql(query, values);
    
    if (products.length === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ product: products[0] });
  } catch (error) {
    console.error('Update product error:', error);
    return Response.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// Delete product (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const products = await sql`DELETE FROM products WHERE id = ${id} RETURNING *`;
    
    if (products.length === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
