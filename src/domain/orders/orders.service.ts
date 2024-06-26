import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultPageSize } from 'src/querying/util/querying.constants';
import { Order } from './entities/order.entity';

import { PaginationDto } from 'src/querying/dto/pagination.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemDto } from './dto/order-item.dto';
import { Product } from '../products/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';
import { PaginationService } from 'src/querying/pagination.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto;

    const itemsWithPrice = await Promise.all(
      items.map((item) => this.createOrderItemWithPrice(item)),
    );

    const order = this.orderRepository.create({
      ...createOrderDto,
      items: itemsWithPrice,
    });

    return await this.orderRepository.save(order);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page } = paginationDto;
    const limit = paginationDto.limit ?? DefaultPageSize.ORDER;
    const offset = this.paginationService.calculateOffset(limit, page);
    const [data, count] = await this.orderRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    const meta = this.paginationService.createMeta(limit, page, count);
    return { data, meta };
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: {
        items: { product: true },
        customer: true,
        payment: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async remove(id: number) {
    const product = await this.orderRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('User not found');

    return this.orderRepository.remove(product);
  }

  private async createOrderItemWithPrice(
    orderItemDto: OrderItemDto,
  ): Promise<OrderItem> {
    const { id } = orderItemDto.product;

    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { price } = product;

    const orderItem = this.orderItemRepository.create({
      ...orderItemDto,
      price,
    });

    return orderItem;
  }
}
