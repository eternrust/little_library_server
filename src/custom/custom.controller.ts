import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, HttpCode, HttpStatus } from '@nestjs/common'
import { CustomService } from './custom.service'
import { CreateCustomDto } from './dto/create-custom.dto'
import { UpdateCustomDto } from './dto/update-custom.dto'
import { ApiTags } from '@nestjs/swagger'
import { CreateCustomPageDto } from './dto/create-custom-page.dto'
import { UpdateCustomPageDto } from './dto/update-custom-page.dto'

@ApiTags('custom')
@Controller('custom')
export class CustomController {
	constructor(private readonly customService: CustomService) {}

	@Post('create')
	async create(@Request() req, @Body() createCustomDto: CreateCustomDto) {
		return await this.customService.create(req.user, createCustomDto)
	}

	@Post('create/page')
	async createPage(@Request() req, @Body() createCustomPageDto: CreateCustomPageDto) {
		return await this.customService.createPage(req.user, createCustomPageDto)
	}

	@HttpCode(HttpStatus.OK)
	@Post('bookmark/:id')
	async bookmark(@Request() req, @Param('id') id: string) {
		return await this.customService.bookmark(req.user, +id)
	}

	@Get('user/me')
	async findMe(@Request() req) {
		return await this.customService.findByUser(req.user.id)
	}

	@Get('user/:id')
	async findByUser(@Param('id') id: string) {
		console.log(id)
		return await this.customService.findByUser(+id)
	}

	@Get('search')
	async search(@Query('word') word) {
		return await this.customService.search(word)
	}

	@Get('recommend')
	async recommend() {
		return await this.customService.recommendCustom()
	}

	@Get(':id')
	async find(@Request() req, @Param('id') id: string) {
		return await this.customService.find(+id, true, req.user.id)
	}

	@Delete(':id')
	delete(@Request() req, @Param('id') id: string) {
		this.customService.delete(req.user.id, +id)
	}

	@Patch('update/page/:id')
	updatePage(@Request() req, @Param('id') id: string, @Body() updateCustomPageDto: UpdateCustomPageDto) {
		return this.customService.updatePage(req.user, +id, updateCustomPageDto)
	}

	@Patch('update/:id')
	update(@Request() req, @Param('id') id: string, @Body() updateCustomDto: UpdateCustomDto) {
		return this.customService.update(req.user.id, +id, updateCustomDto)
	}
}
