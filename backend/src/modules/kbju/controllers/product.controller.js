const db = require('../../../db'); 

exports.search = async (req, res) => {
  const { q } = req.query;
  try {
    const { rows } = await db.query(
      "SELECT * FROM products WHERE LOWER(name) LIKE $1 LIMIT 10",
      [`%${q.toLowerCase()}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: [product] } = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
