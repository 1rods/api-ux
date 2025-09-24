Listar Produtos:
Pagina = page=1
Filtro = order=menor ou maior
- GET http://localhost:3000/produtos?page=1&order=menor

Editar Produtos:
Autorization = Auth Basic (Login e senha)
-PUT http://localhost:3000/editproduto/<$id>
 editavel: nome, imagem, valor, quantidade, descrição

Adicionar Novos Produtos:
Autorization = Auth Basic (Login e senha)
-POST http://localhost:3000/addprodutos
 prenchimento de valores: "name_produto, valor_produto, qtd_produto, desc_produto, img_produto"
 
Deletar Produtos:
Autorization = Auth Basic (Login e senha)
-DELETE http://localhost:3000/deleteproduto/<$id>
 prenchimento de valores: "name_produto, valor_produto, qtd_produto, desc_produto, img_produto"

Carrinho user:


Adicionar item do carrinho:
Autorization = Auth Basic (Login e senha)
-POST http://localhost:3000/carrinho
{
  "produto_id": <$id>,
  "qtd_produto_cart": <$qtd>
}

Atializar item do carrinho:
Autorization = Auth Basic (Login e senha)
-PUT http://localhost:3000/carrinho/<$id_cart>
{
  "produto_id": <$id>,
  "qtd_produto_cart": <$qtd>
}
Obs: se o valor for igual a zero, o item é deletado

Remover item do carrinho:
Autorization = Auth Basic (Login e senha)
-DELETE http://localhost:3000/carrinho/<$id_cart>
