- install node.js 18^
- install PostgreSQL
- install redis
- intall docker // docker-compose
- npm i
start: - npm run dev \
start(compose)(só o basico(caso precise de algo mais especifico: https://docs.docker.com/reference/cli/docker/container/)): \
- docker-compose up -d (start)
- docker-compose stop (parar)
- docker-compose down (para e apaga)
- docker ps (ver os container)
- docker exec -it loja_db psql -U postgres -d api-ux -c "SELECT * FROM TABELA LIMIT 10;" (litar itens do db)

## FUNÇÕES API:

### Listar Produtos:
Pagina = page=1 \
Filtro = order=menor ou maior \
-GET http://localhost:3000/produtos?page=1&order=menor \
-GET http://localhost:3000/produtos?page=1 
________________________________________________________

### Editar Produtos DO ESTOQUE:
-Headers > Autorization = Bearer <token> \
Content-Type application/json

-PUT http://localhost:3000/editproduto/<$id> \
 { 
  "name_produto": "nome_do_produto",
  "valor_produto": "25.99",
  "qtd_produto": 11,
  "desc_produto": "Produto serve...",
  "img_produto":"img.png"
}
________________________________________________________

### Adicionar Novos Produtos PARA O ESTOQUE:
-Headers > Autorization = Bearer <token> \
Content-Type application/json

-POST http://localhost:3000/addprodutos \
 { 
  "name_produto": "nome_do_produto",
  "valor_produto": "25.99",
  "qtd_produto": 11,
  "desc_produto": "Produto serve...",
  "img_produto":"img.png"
}
________________________________________________________

### Deletar Produtos do ESTOQUE:
-Headers > Autorization = Bearer <token> \
Content-Type application/json

-DELETE http://localhost:3000/deleteproduto/<$id> \
________________________________________________________

### Listar Produtos do carrinho:
-Headers > Autorization = Bearer <token> \
Content-Type application/json

-GET http://localhost:3000/carrinho \
________________________________________________________

### Adicionar Produtos do carrinho:
-Headers > Autorization = Bearer <token> \
Content-Type application/json

-POST http://localhost:3000/carrinho \
{ 
  "produto_id": <$id>,
  "qtd_produto_cart": <$qtd>
}
________________________________________________________

### Atializar Produto do carrinho:
-Headers > Autorization = Bearer <token> \
Content-Type application/json

-POST http://localhost:3000/carrinho \
{
  "produto_id": <$id>,
  "qtd_produto_cart": <$qtd>
} \
Obs: se o valor for igual a zero, o item é deletado
________________________________________________________

### Remover Produto do carrinho:
-Headers > Autorization = Bearer <token> \
Content-Type application/json

-DELETE http://localhost:3000/carrinho \
(deleta o carrinho inteiro) \

-POST http://localhost:3000/carrinho
{
  "produto_id": 1,
  "qtd_produto_cart": 0
} \
(se o valor for igual a ZERO, ele deleta somente esse item)
________________________________________________________

### Register:
-POST http://localhost:3000/register \
{
  "email": "teste@teste.com",
  "username": "teste",
  "password": "teste"
}
________________________________________________________

### Login:
-POST http://localhost:3000/login \
{
  "username": "teste",
  "password": "teste"
}