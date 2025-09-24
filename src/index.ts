import express from "express";
import produtosRoutes from "./routes/produtos";
import editprodutosRoutes from "./routes/editproduto";
import addprodutosRoutes from "./routes/addprodutos";
import "./cache";

const app = express();

app.use(express.json());
app.use("/produtos", produtosRoutes);
app.use("/editproduto", editprodutosRoutes);
app.use("/addprodutos", addprodutosRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`online: http://localhost:${PORT}`));
