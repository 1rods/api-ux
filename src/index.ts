import express from "express";
import produtosRoutes from "./routes/produtos";
import "./cache";

const app = express();

app.use(express.json());
app.use("/produtos", produtosRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`online: http://localhost:${PORT}`));
