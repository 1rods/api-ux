import dotenv from "dotenv";
dotenv.config();

import express from "express";
import produtosRoutes from "./routes/produtos";
import editprodutosRoutes from "./routes/editproduto";
import addprodutosRoutes from "./routes/addprodutos";
import deleteprodutoRoutes from "./routes/deleteproduto";
import carrinhoRoutes from "./routes/carrinho";
import registerRoutes from "./routes/register";
import activateRoutes from "./routes/activate";
import loginRoutes from "./routes/login";
import logoutRoutes from "./routes/logout";
import "./cache";


if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido!");
}


const app = express();

app.use(express.json());
app.use("/produtos", produtosRoutes);
app.use("/editproduto", editprodutosRoutes);
app.use("/addprodutos", addprodutosRoutes);
app.use("/deleteproduto", deleteprodutoRoutes);
app.use("/carrinho", carrinhoRoutes);
app.use("/register", registerRoutes);
app.use("/activate", activateRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`online: http://localhost:${PORT}`));
