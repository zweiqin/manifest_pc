<template>
	<div class="order">
		<el-card class="el-card">
			<!--s头部搜索      -->
			<div slot="header">
				<el-form :label-position="labelPosition" inline size="small">
					<el-form-item label="日期">
						<el-date-picker
							v-model="search_form.date"
							end-placeholder="结束日期"
							range-separator="至"
							start-placeholder="开始日期"
							type="daterange"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="订单状态">
						<el-select v-model="search_form.status">
							<el-option
								v-for="item in status_options"
								:key="item.id"
								:label="item.label"
								:value="item.id"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="订单号">
						<el-input v-model="search_form.order_num" placeholder="请输入订单号"></el-input>
					</el-form-item>
					<el-button size="mini" type="primary" @click="getOrderList">查找</el-button>
				</el-form>
			</div>
			<!--e头部搜索      -->
			<!--s显示订单表格   -->
			<el-table :data="table_data.data">
				<el-table-column label="订单号" min-width="180" prop="order_num"></el-table-column>
				<el-table-column label="订单金额" min-width="180" prop="total_price"></el-table-column>
				<el-table-column label="下单时间" min-width="180" prop="create_time"></el-table-column>
				<!--        // TODO (Leo) 2022/9/30 15:22: 订单状态需要对接后端接口-->
				<el-table-column label="订单状态" min-width="180" prop="status">
					<template v-slot="scope">
						<el-tag v-if="scope.row.status === 1" type="success">已支付</el-tag>
						<el-tag v-else-if="scope.row.status === 2" type="danger">已取消</el-tag>
						<el-tag v-else-if="scope.row.status === 3" type="warning">已退款</el-tag>
						<el-tag v-else-if="scope.row.status === 4" type="info">已完成</el-tag>
						<el-tag v-else-if="scope.row.status === 5" type="info">已发货</el-tag>
						<el-tag v-else-if="scope.row.status === 6" type="info">已收货</el-tag>
						<el-tag v-else-if="scope.row.status === 7" type="info">已评价</el-tag>
						<el-tag v-else-if="scope.row.status === 8" type="info">已关闭</el-tag>
						<el-tag v-else-if="scope.row.status === 9" type="info">已退货</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="180">
					<template v-slot="scope">
						<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!--    // TODO (Leo) 2022/9/30 15:18: 查看商品状态是否可以发货 + 填物流订单-->

	</div>
</template>

<script>
import localStorage from '@/utils/localStorage'
import { GetTeamUserInfo } from '@/api/admin'

export default {
	name: 'order',
	data() {
		return {
			labelPosition: 'right',
			search_form: {
				date: [],
				status: '',
				order_num: ''
			},
			status_options: [
				{
					id: '',
					label: '全部'
				},
				{
					id: 1,
					label: '待付款'
				},
				{
					id: 2,
					label: '待发货'
				},
				{
					id: 3,
					label: '待收货'
				},
				{
					id: 4,
					label: '已完成'
				},
				{
					id: 5,
					label: '已取消'
				}
			],
			// 表格数据
			table_data: {
				data: [
					{
						order_num: '123456789',
						total_price: '100',
						create_time: '2021-09-30 15:00:00',
						status: 1
					},
					{
						order_num: '123456789',
						total_price: '100',
						create_time: '2021-09-30 15:00:00',
						status: 2
					},
					{
						order_num: '123456789',
						total_price: '100',
						create_time: '2021-09-30 15:00:00',
						status: 3
					},
					{
						order_num: '123456789',
						total_price: '100',
						create_time: '2021-09-30 15:00:00',
						status: 4
					},
					{
						order_num: '123456789',
						total_price: '100',
						create_time: '2021-09-30 15:00:00',
						status: 5
					},
					{
						order_num: '123456789',
						total_price: '100',
						create_time: '2021-09-30 15:00:00',
						status: 6
					},
					{
						order_num: '123456789',
						total_price: '100',
						create_time: '2021-09-30 15:00:00',
						status: 7
					},
					{
						order_num: '123456789',
						total_price: '100',
						create_time: '2021-09-30 15:00:00',
						status: 8
					},
					{
						order_num: '123456789',
						total_price: '100',
						create_time: '2021-09-30 15:00:00',
						status: 9
					}
				],
				total: 0
			},

			is_manager: false, // (leo) : 是否是团队管理员
			is_member: false // (leo) : 是否是团队成员
		}
	},
	created() {
		this.hasPermission()
	},
	methods: {
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
</style>
