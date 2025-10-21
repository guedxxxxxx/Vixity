import sql from "@/app/api/utils/sql";

// Get all products, optionally filtered by category
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let products;
    if (category) {
      products = await sql`SELECT * FROM products WHERE category = ${category} ORDER BY created_at DESC`;
    } else {
      products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    }

    return Response.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    return Response.json({ error: 'Failed to get products' }, { status: 500 });
  }
}

// Create new product (admin only)
export async function POST(request) {
  try {
    const { name, description, price, stock, category, image_url } = await request.json();

    if (!name || !price || !category) {
      return Response.json({ error: 'Name, price, and category required' }, { status: 400 });
    }

    const products = await sql`
      INSERT INTO products (name, description, price, stock, category, image_url)
      VALUES (${name}, ${description || null}, ${price}, ${stock || 0}, ${category}, ${image_url || null})
      RETURNING *
    `;

    return Response.json({ product: products[0] });
  } catch (error) {
    console.error('Create product error:', error);
    return Response.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
