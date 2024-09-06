import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ProductsModule } from './products.module';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const databaseConnection: SequelizeModuleOptions = {
  dialect: 'sqlite',
  omitNull: true,
  autoLoadModels: true,
  synchronize: true,
};

const createProductDto: CreateProductDto = {
  name: 'Product1',
  price: 10,
  category: 'C1',
  rating: 1,
};

const updateProductDto: UpdateProductDto = {
  name: 'Product1-updated',
  price: 11,
  category: 'C2',
  rating: 2,
};

describe('ProductsModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SequelizeModule.forRoot(databaseConnection), ProductsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /products', async () => {
    return request(await app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect('[]');
  });
  
  it('POST /products', async () => {
  return request(await app.getHttpServer())
    .post('/products')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .send(createProductDto)
    .expect(201)
    .expect((res) => {
      expect(res.body.name).toBe(createProductDto.name);
      expect(res.body.price).toBe(createProductDto.price);
      expect(res.body.category).toBe(createProductDto.category);
      expect(res.body.rating).toBe(createProductDto.rating);
    });
});

it('PUT /products', async () => {
  const response = await request(await app.getHttpServer())
    .post('/products')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .send(createProductDto)
    .expect(201);

  const id = response.body.id;

  return request(await app.getHttpServer())
    .put(`/products/${id}`)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .send(updateProductDto)
    .expect(200)
    .expect((res) => {
      expect(res.body.name).toBe(updateProductDto.name);
      expect(res.body.price).toBe(updateProductDto.price);
      expect(res.body.category).toBe(updateProductDto.category);
      expect(res.body.rating).toBe(updateProductDto.rating);
    });
});

it('DELETE /products', async () => {
  const response = await request(await app.getHttpServer())
    .post('/products')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .send(createProductDto)
    .expect(201);

  const id = response.body.id;

  return request(await app.getHttpServer())
    .delete(`/products/${id}`)
    .expect(200)
    .expect((res) => {
      res.body = null;
    });
});



  afterAll(async () => {
    await app.close();
  });
});
