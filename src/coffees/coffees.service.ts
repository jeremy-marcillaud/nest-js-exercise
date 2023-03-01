import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/create-coffee.dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>
    ){}
    
    findAll() {
        return this.coffeeRepository.find()
    }

    async findOne(id){
        const coffee = await this.coffeeRepository.findOne({where: {id: +id}})
        if(!coffee){
            throw new HttpException(`Coffee #${id} does not exist`, HttpStatus.NOT_FOUND)
        }
        return coffee
    }
    async create(createCoffeeDto: CreateCoffeeDto){
        const coffee = await this.coffeeRepository.create(createCoffeeDto)
        return this.coffeeRepository.save(coffee)
    }
    async update(id: string, updateCoffeeDto: UpdateCoffeeDto){
        const existingCoffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto
        })
        if(!existingCoffee){
           throw new Error(`Coffee #${id} not found`)
        }
        return this.coffeeRepository.save(existingCoffee)
    }
    async remove(id){
        const coffee = await this.findOne(id)
        return this.coffeeRepository.remove(coffee)
    }
}
