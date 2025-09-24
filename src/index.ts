import express from "express";
import produtosRoutes from "./routes/produtos";
import editprodutosRoutes from "./routes/editproduto";
import addprodutosRoutes from "./routes/addprodutos";
import deleteprodutoRoutes from "./routes/deleteproduto";
import carrinhoRoutes from "./routes/carrinho";
import "./cache";

const app = express();

app.use(express.json());
app.use("/produtos", produtosRoutes);
app.use("/editproduto", editprodutosRoutes);
app.use("/addprodutos", addprodutosRoutes);
app.use("/deleteproduto", deleteprodutoRoutes);
app.use("/carrinho", carrinhoRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`online: http://localhost:${PORT}`));
