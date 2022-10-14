<template>
	<div class="order">
		<el-card class="el-card">
			<!--s头部搜索      -->
			<div slot="header">
				<el-form :label-position="labelPosition" inline size="small">
					<el-form-item label="订单号">
						<el-input v-model="search_form.id" placeholder="请输入订单号"></el-input>
					</el-form-item>
					<el-button size="mini" type="primary" @click="getOrderList">查找</el-button>
				</el-form>
				<el-button size="small" type="danger" @click="exportGlobalExcel()">生成发货单</el-button>
				<!--				<el-button type="danger" @click="upload()">上传发货单</el-button>-->
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
			<!--e头部搜索      -->
			<!--s显示订单表格   -->
			<el-table :data="table_data.data">
				<el-table-column label="订单ID" min-width="180" prop="id"></el-table-column>
				<el-table-column label="订单号" min-width="180" prop="order_id"></el-table-column>
				<!--				<el-table-column label="订单金额" min-width="180" prop="total_price"></el-table-column>-->
				<el-table-column label="下单时间" min-width="180" prop="add_time"></el-table-column>
				<!--        // (Leo) 2022/9/30 15:22: 订单状态需要对接后端接口-->
				<!--				<el-table-column label="订单状态" min-width="180" prop="status">-->
				<!--					<template v-slot="scope">-->
				<!--						<el-tag v-if="scope.row.status === 1" type="success">已支付</el-tag>-->
				<!--						<el-tag v-else-if="scope.row.status === 2" type="danger">已取消</el-tag>-->
				<!--						<el-tag v-else-if="scope.row.status === 3" type="warning">已退款</el-tag>-->
				<!--						<el-tag v-else-if="scope.row.status === 4" type="info">已完成</el-tag>-->
				<!--						<el-tag v-else-if="scope.row.status === 5" type="info">已发货</el-tag>-->
				<!--						<el-tag v-else-if="scope.row.status === 6" type="info">已收货</el-tag>-->
				<!--						<el-tag v-else-if="scope.row.status === 7" type="info">已评价</el-tag>-->
				<!--						<el-tag v-else-if="scope.row.status === 8" type="info">已关闭</el-tag>-->
				<!--						<el-tag v-else-if="scope.row.status === 9" type="info">已退货</el-tag>-->
				<!--					</template>-->
				<!--				</el-table-column>-->
				<!--				<el-table-column label="操作" min-width="180">-->
				<!--					<template v-slot="scope">-->
				<!--						<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
				<!--						<el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
				<!--					</template>-->
				<!--				</el-table-column>-->
			</el-table>

			<div class="block">
				<el-pagination
					:page-sizes="[10, 20, 40, 60, 80]" :page-size="search_form.limit" :current-page="search_form.page" layout="total, sizes, prev, pager, next, jumper"
					:total="table_data.total"
					@size-change="handle_size_change" @current-change="page_change"
				/>
			</div>
		</el-card>

		<!--    // TODO (Leo) 2022/9/30 15:18: 查看商品状态是否可以发货 + 填物流订单-->

	</div>
</template>

<script>
import localStorage from '@/utils/localStorage'
import { GetTeamUserInfo } from '@/api/admin'
import { GetDeliverList } from '@/api/manifest'
import exportXlsxPopulate from '@/utils/export-table.js'
import { getToken } from '@/utils/auth'

export default {
	name: 'order',
	data() {
		return {
			labelPosition: 'right',
			search_form: {
				id: '',
				page: 1,
				limit: 10
			},
			// 表格数据
			table_data: {
				data: [],
				total: 0
			},
			table: [
				{
					value: 'id',
					label: '序号',
					disabled: true
				},
				{
					value: 'order_id',
					label: '订单编号',
					disabled: true
				},
				{
					value: 'delivery_name',
					label: '物流公司',
					isShow: true
				},
				{
					value: 'delivery_id',
					label: '物流单号',
					isShow: true
				},
				{
					value: 'cart_msg',
					label: '商品信息',
					isShow: true
				}
			],
			upload_url: process.env.VUE_APP_BASE_API + '/v1/purchase/DeliverOrder', // 附件上传地址
			fileList: [],
			upload_header: {
				token: getToken()
			},
			upload_data: {
				admin_id: localStorage.get('admin_info').admin_id
			},

			is_manager: false, // (leo) : 是否是团队管理员
			is_member: false // (leo) : 是否是团队成员
		}
	},
	created() {
		this.hasPermission()
		this.getOrderList()
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
			this.getOrderList()
		},

		// (leo)  判断是否有权限
		hasPermission() {
			// (leo) : 判断是否是团队成员或是团队管理员
			const admin_id = String(localStorage.get('admin_info').admin_id)
			GetTeamUserInfo({ id: 5 })
				.then((res) => {
					// 判断是否是团队成员
					if (res.data.id_list.includes(admin_id)) {
						this.is_member = true
						console.warn('团队成员')
					}
					// 判断是否是团队管理员
					if (res.data.manager_id === admin_id) {
						this.is_manager = true
						console.warn('管理员')
					}
					if (this.is_member === false && this.is_manager === false) {
						this.$message.error('您没有权限访问该页面')
						this.$router.push({ path: '/welcome/index' })
					}
				})
				.catch((err) => {
					this.$message.error(err.data.msg)
				})
		},
		getOrderList() {
			console.log(this.search_form)
			GetDeliverList(this.search_form)
				.then((res) => {
					console.log(res)
					res.data.items.forEach((item) => {
						item.add_time = new Date(parseInt(item.add_time) * 1000).toLocaleString()
						item.cart_msg = ''
						item.cart_info_list.forEach((part) => {
							item.cart_msg += JSON.parse(part.cart_info).productInfo.store_name + ' * ' + part.cart_num + '；'
						})
					})
					this.table_data.data = res.data.items
					this.table_data.total = res.data.total
					console.log(this.table_data.data)
				})
				.catch((err) => {
					console.log(err)
					this.$message.error(err.data.msg)
				})
		},

		// 导出excel
		exportGlobalExcel() {
			GetDeliverList({
				id: '',
				page: '',
				limit: ''
			})
				.then((res) => {
					console.log(res)
					res.data.items.forEach((item) => {
						item.add_time = new Date(parseInt(item.add_time)).toLocaleString()
						item.cart_msg = ''
						item.cart_info_list.forEach((part) => {
							item.cart_msg += JSON.parse(part.cart_info).productInfo.store_name + ' * ' + part.cart_num + '；'
						})
					})
					const temp_obj = {
						data: res.data.items,
						total: res.data.total
					}
					exportXlsxPopulate(temp_obj, `批量发货单 ${new Date().toLocaleString()}`, this.table)
				})
				.catch((err) => {
					console.log(err)
					this.$message.error(err.data.msg)
				})
		},

		page_change(page) {
			this.search_form.page = page
			this.getOrderList()
		},

		handle_size_change(val) {
			this.search_form.limit = val
			this.getOrderList()
		}
	}
}
</script>

<style lang='scss' scoped>
.order {
  .el-card {
    margin: 20px
  }
}
.block {
  float: right;
  margin: 20px 0;
}
</style>
