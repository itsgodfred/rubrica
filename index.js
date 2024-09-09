const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./database");
const PORT = 4000;
const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/contacts", async (req, res) => {
  try {
    const contacts = await pool.query("SELECT * FROM contact");
    res.json(contacts.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/addcontact", async (req, res) => {
  try {
    const { nome, cognome, numero } = req.body;
    if (!nome) {
      return res.json({
        error: "nome is required",
      });
    }
    if (!cognome) {
      return res.json({
        error: "cognome is required",
      });
    }
    if (!numero) {
      return res.json({
        error: "numero is required",
      });
    }
    if (/[a-zA-Z]/.test(numero)) {
      return res.json({
        error: "numero must contain only numbers",
      });
    }

    const newContact = await pool.query(
      `
    INSERT INTO CONTACT (nome, cognome, numero) VALUES ($1, $2, $3) RETURNING *
  `,
      [nome, cognome, numero]
    );

    res.json(newContact.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/deletecontact/:id", async (req, res) => {
  const { id } = req.params; // Extract id from URL parameters

  try {
    // Execute the DELETE query
    const result = await pool.query(
      "DELETE FROM contact WHERE contact_id = $1 RETURNING *",
      [id]
    );

    // Successfully deleted
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
