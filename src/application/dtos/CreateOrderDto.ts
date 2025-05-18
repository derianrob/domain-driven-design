import {
  IsString,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";
import { Expose } from "class-transformer";

export class OrderItemDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Expose()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @Expose()
  @IsEmail()
  customerEmail: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
