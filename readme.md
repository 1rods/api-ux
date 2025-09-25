- install node.js 18^
- install PostgreSQL
- install redis
- npm i
start: - npm run dev

FUNÇÕES API:

Listar Produtos:
Pagina = page=1
Filtro = order=menor ou maior
-GET http://localhost:3000/produtos?page=1&order=menor
________________________________________________________

Editar Produtos:
-Headers > Autorization = Bearer <token>
Content-Type application/json

-PUT http://localhost:3000/editproduto/<$id>
 {
  "name_produto": "250925",
  "valor_produto": "25,99",
  "qtd_produto": 11,
  "desc_produto": "testando produto",
  "img_produto":"img.png"
}
________________________________________________________

Adicionar Novos Produtos:
-Headers > Autorization = Bearer <token>
Content-Type application/json

-POST http://localhost:3000/addprodutos
{
  "name_produto": "250925",
  "valor_produto": "25,99",
  "qtd_produto": 11,
  "desc_produto": "testando produto",
  "img_produto":"img.png"
}
________________________________________________________

Deletar Produtos:
-Headers > Autorization = Bearer <token>
Content-Type application/json

-DELETE http://localhost:3000/deleteproduto/<$id>
________________________________________________________

Adicionar item do carrinho:
-Headers > Autorization = Bearer <token>
Content-Type application/json

-POST http://localhost:3000/carrinho
{
  "produto_id": <$id>,
  "qtd_produto_cart": <$qtd>
}
________________________________________________________

Atializar item do carrinho:
-Headers > Autorization = Bearer <token>
Content-Type application/json

-PUT http://localhost:3000/carrinho/<$id_cart>
{
  "produto_id": <$id>,
  "qtd_produto_cart": <$qtd>
}
Obs: se o valor for igual a zero, o item é deletado
________________________________________________________

Remover item do carrinho:
-Headers > Autorization = Bearer <token>
Content-Type application/json

-DELETE http://localhost:3000/carrinho/<$id_cart>
{
  "produto_id": <$id>,
}
________________________________________________________

Register:
-POST http://localhost:3000/register
{
  "email": "teste@teste.com",
  "username": "teste",
  "password": "teste"
}
________________________________________________________

Login:
-POST http://localhost:3000/login
{
  "username": "teste",
  "password": "teste"
}