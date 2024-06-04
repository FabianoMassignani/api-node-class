import { Request, Response } from "express";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { IProductRepository } from "../repositorys/ProductIRepository";
import { NotFoundException } from "../exceptions/not-found";

class ProductController {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  getProducts = async (_req: Request, res: Response): Promise<Response> => {
    const products = await this.productRepository.findAll();

    return res.status(200).json({ data: products });
  };

  getProductById = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id as string;

    if (!id) {
      throw new BadRequestException(
        "Id não informado",
        ErrorCode.INVALID_PARAMS
      );
    }

    const product = await this.productRepository.findById(id);

    return res.status(200).json({ data: product });
  };

  createProduct = async (req: Request, res: Response): Promise<Response> => {
    const { nome, descricao, preco, quantidade } = req.body;

    for (const key in req.body) {
      if (!req.body[key]) {
        throw new BadRequestException(
          `${key} não informado`,
          ErrorCode.INVALID_PARAMS
        );
      }
    }

    let product = {
      nome: nome,
      descricao: descricao,
      preco: preco,
      quantidade: quantidade,
    };

    const productCreate = await this.productRepository.create(product);

    return res
      .status(201)
      .json({ data: productCreate, message: "Criado com sucesso" });
  };

  updateProduct = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id as string;
    const { nome, descricao, preco, quantidade } = req.body;

    if (!id) {
      throw new BadRequestException(
        "Id não informado",
        ErrorCode.INVALID_PARAMS
      );
    }

    let product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(
        "Produto não encontrado",
        ErrorCode.NOT_FOUND
      );
    }

    for (const key in req.body) {
      if (!req.body[key]) {
        throw new BadRequestException(
          `${key} não informado`,
          ErrorCode.INVALID_PARAMS
        );
      }
    }

    product = {
      _id: id,
      nome: nome,
      descricao: descricao,
      preco: preco,
      quantidade: quantidade,
    };

    const productUpdate = await this.productRepository.update(id, product);

    return res
      .status(200)
      .json({ data: productUpdate, message: "Atualizado com sucesso" });
  };

  deleteProduct = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestException(
        "Id não informado",
        ErrorCode.INVALID_PARAMS
      );
    }

    const product = await this.productRepository.delete(id);

    if (!product) {
      throw new NotFoundException("Product not found", ErrorCode.NOT_FOUND);
    }

    return res
      .status(200)
      .json({ data: product, message: "Deletado com sucesso" });
  };
}

export default ProductController;
