<template>
	<div class="shop">
		<el-card class="el-card">
			<div slot="header">
				<el-form :inline="true" :model="search_form" class="demo-form-inline">
					<el-form-item label="商品名称">
						<el-input v-model="search_form.name" placeholder="请输入商品名称" size="small"></el-input>
					</el-form-item>
					<el-button size="small" type="primary" @click="search">查询</el-button>
				</el-form>
				<el-upload
					style="display: inline;margin-left: 20px"
					class="upload-demo"
					:action="upload_url"
					:show-file-list="false"
					accept=".xlsx,.xls"
					:headers="upload_header"
					:data="upload_data"
					:file-list="fileList"
					:before-upload="beforeUploadFile"
					:on-success="handleAvatarSuccess"
				>
					<el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
			</div>
			<!--s 商品表格      -->
			<el-table :data="shop_list">
				<el-table-column label="商品名称" min-width="180" prop="name"></el-table-column>
				<el-table-column label="售价" min-width="180" prop="price"></el-table-column>
				<el-table-column label="成本价" min-width="180" prop="price"></el-table-column>
				<el-table-column label="商品分类ID" min-width="180" prop="stock"></el-table-column>
				<el-table-column label="供应商ID" min-width="180" prop="stock"></el-table-column>
				<el-table-column label="商品状态" min-width="180" prop="status">
					<!--					// TODO (Leo) 2022/10/13 18:50: 需要修改status的值对应后端的接口字段值-->
					<template v-slot="scope">
						<el-tag v-if="scope.row.status == 1" style="cursor: pointer" type="success" @click="change_status(2)">上架
						</el-tag>
						<el-tag v-else style="cursor: pointer" type="danger" @click="change_status(1)">下架</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
import { getToken } from '@/utils/auth'
import localStorage from '@/utils/localStorage'

export default {
	name: 'shop',
	data() {
		return {
			search_form: {
				name: ''
			},
			shop_list: [
				{
					name: '商品1',
					price: '100',
					stock: '100',
					status: 1
				},
				{
					name: '商品2',
					price: '100',
					stock: '100',
					status: 0
				}
			],
			upload_url: process.env.VUE_APP_BASE_API + '/v1/purchase/DeliverOrder', // 附件上传地址
			fileList: [],
			upload_header: {
				token: getToken()
			},
			upload_data: {
				admin_id: localStorage.get('admin_info').admin_id
			}
		}
	},
	methods: {
		// 限制上传文件类型
		beforeUploadFile(file) {
			const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
			const isXls = extension === 'xls'
			const isXlsx = extension === 'xlsx'
			if (!isXls && !isXlsx) {
				this.$message.warning('只能上传excel的文件')
			}
			return isXls || isXlsx
		},
		handleAvatarSuccess(file) {
			// this.getOrderList()
		},
		// 查询商品
		search() {
			console.log(this.search_form)
		},
		// 修改商品状态
		// TODO (Leo) 2022/10/13 18:50: 需要修改status的值对应后端的接口字段值
		change_status(status) {
			if (status === 1) {
				this.$confirm('是否上架该商品？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '上架成功!'
					})
				})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消上架'
						})
					})
			} else {
				this.$confirm('是否下架该商品？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '下架成功!'
					})
				})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消下架'
						})
					})
			}
		}
	}
}
</script>

<style lang='scss' scoped>
.shop {
  .el-card {
    margin: 20px;
  }
}
</style>
