const database = require("../database/models");

module.exports = class ProdutoService {
  async create(produto, idUsuario) {
    const produtoCriado = await database.produtos.create({
      nome: produto.nome,
      link_compra: produto.link_compra,
      preco: produto.preco,
      comprado: produto.comprado,
      id_usuario: idUsuario,
    });

    if (produto.listas) {
      await produtoCriado.setListas(produto.listas);
    }

    return produtoCriado;
  }

  async findAll(idUsuario) {
    const produtos = await database.produtos.findAll({
      where: {
        id_usuario: idUsuario,
      },
    });

    return produtos;
  }

  async findOne(idProduto, idUsuario) {
    const produto = await database.produtos.findOne({
      where: {
        id: idProduto,
        id_usuario: idUsuario,
      },
    });

    return produto;
  }

  async remove(idProduto, idUsuario) {
    const produto = await database.produtos.findOne({
      where: {
        id: idProduto,
        id_usuario: idUsuario,
      },
    });

    if (!produto) {
      return false;
    }

    await database.produtos.destroy({
      where: {
        id: idProduto,
      },
    });

    return true;
  }

  async addToList(idProduto, listas, idUsuario) {
    const produto = await database.produtos.findOne({
      where: {
        id: idProduto,
        id_usuario: idUsuario,
      },
    });

    if (!produto) {
      return false;
    }

    // permite apenas as listas que pertencem ao usuário
    const listasBanco = await database.listas.findAll({
      where: {
        id_usuario: idUsuario,
        id: listas,
      },
    });

    await produto.setListas(listasBanco);

    return true;
  }
};
