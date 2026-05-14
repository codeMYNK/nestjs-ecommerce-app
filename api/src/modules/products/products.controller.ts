import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService){}

    //Create Product
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: "Create a new product (Admin Only)",
    })
    @ApiBody({
        type: CreateProductDto
    })
    @ApiResponse({
        status: 201,
        description: "Product created successfully",
        type: ProductResponseDto,
    })
    @ApiResponse({
        status: 409,
        description: 'Sku already exists',
    })
    @ApiResponse({
        status:403,
        description: "Forbidden - Admin role required"
    })

    async create(@Body() createProductDto: CreateProductDto) : Promise<ProductResponseDto> {
        return await this.productsService.create(createProductDto);
    }
}
