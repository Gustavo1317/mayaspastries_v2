import pool from "../db.js";

export const renderPrincipal = async (req, res) => {
  res.render("principal");
};
export const renderAbout = async (req, res) => {
  res.render("pages/principal/about");
};

export const rendeLetter = async (req, res) => {
  try {
    const { rows: categories } = await pool.query("SELECT * FROM categories");
    const selectedCategory = req.query.category || "";
    const { rows: products } = await pool.query(`
      SELECT 
        bp.id,
        bp.name,
        bp.description,
        bp.image_url,
        c.name AS category,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'type', COALESCE(pt.type_name, 'No Type'),
                'size', COALESCE(pz.name, 'No Size'),
                'quantity', pd.quantity,
                'price', pd.price
            )
        ) AS product_details
      FROM base_products bp
      JOIN categories c ON bp.category_id = c.id
      LEFT JOIN product_details pd ON bp.id = pd.base_product_id
      LEFT JOIN product_types pt ON pd.product_type_id = pt.id
      LEFT JOIN product_size pz ON pd.product_size_id = pz.id
      GROUP BY bp.id, bp.name, bp.description, bp.image_url, c.name;
    `);
    res.render("pages/principal/letter", {
      products,
      categories,
      selectedCategory,
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const renderFAQ = async (req, res) => {
  res.render("pages/principal/FAQ");
};

// #region leeter

export const renderProductbyQuery = async (req, res) => {
  try {
    const searchWord = req.query.searchWord || "";
    const selectedCategory = req.query.category || "";

    let query = `
      SELECT 
        bp.id,
        bp.name,
        bp.description,
        bp.image_url,
        c.name AS category,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'type', COALESCE(pt.type_name, 'No Type'),
                'size', COALESCE(pz.name, 'No Size'),
                'quantity', pd.quantity,
                'price', pd.price
            )
        ) AS product_details
      FROM base_products bp
      JOIN categories c ON bp.category_id = c.id
      LEFT JOIN product_details pd ON bp.id = pd.base_product_id
      LEFT JOIN product_types pt ON pd.product_type_id = pt.id
      LEFT JOIN product_size pz ON pd.product_size_id = pz.id
      WHERE (bp.name ILIKE $1 OR bp.description ILIKE $1)
    `;

    const queryParams = [`%${searchWord}%`];

    if (selectedCategory) {
      query += " AND bp.category_id = $2";
      queryParams.push(selectedCategory);
    }

    query += " GROUP BY bp.id, bp.name, bp.description, bp.image_url, c.name";

    const { rows: products } = await pool.query(query, queryParams);

    // Obtener todas las categorías para el menú de selección
    const { rows: categories } = await pool.query(
      "SELECT id, name FROM categories"
    );

    res.render("pages/principal/letter", {
      products,
      searchWord,
      categories,
      selectedCategory,
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// #region details

export const renderProductDetails = async (req, res) => {
  const productId = req.params.id;

  try {
    // Consulta SQL para obtener los detalles del producto
    const { rows: products } = await pool.query(
      `
      SELECT 
        bp.id,
        bp.name,
        bp.category_id,
        bp.description,
        bp.image_url,
        c.name AS category,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'type', COALESCE(pt.type_name, ''),
                'size', COALESCE(pz.name, ''),
                'quantity', pd.quantity,
                'price', pd.price
            )
        ) AS product_details
      FROM base_products bp
      JOIN categories c ON bp.category_id = c.id
      LEFT JOIN product_details pd ON bp.id = pd.base_product_id
      LEFT JOIN product_size pz ON pd.product_size_id = pz.id
      LEFT JOIN product_types pt ON pd.product_type_id = pt.id
      WHERE bp.id = $1
      GROUP BY bp.id, bp.name, bp.description, bp.image_url, c.name;
    `,
      [productId]
    );

    // Si el producto no existe, enviar un mensaje de error
    if (products.length === 0) {
      return res.status(404).send("Producto no encontrado");
    }

    const product = products[0];
    console.log(product);
    const categoryId = products[0].category_id;

    // Obtener productos relacionados de la misma categoría
    const { rows: relatedProducts } = await pool.query(
      `SELECT * FROM base_products WHERE category_id = $1 and id != $2  LIMIT 5`,
      [categoryId, productId]
    );
    res.render("pages/principal/detail", {
      product,
      relatedProducts: relatedProducts,
    });
  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
    res.status(500).send("Error interno del servidor");
  }
};
