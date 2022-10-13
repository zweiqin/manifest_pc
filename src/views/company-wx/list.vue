<template>
	<div class="food">
		<el-card class="box-card">
			<!-- s搜索区 -->
			<header>
				<div class="container">
					<el-button label="default" size="small" type="primary" @click="pullNewList()">重新拉取用户列表</el-button>
				</div>
			</header>
			<!-- e搜索区 -->

			<!-- s菜品显示区  -->
			<main>
				<el-table :data="table_data.data" highlight-current-row size="small" style="width: 100%">

					<el-table-column label="id" min-width="100" prop="id" />

					<el-table-column label="姓名" min-width="100" prop="name" />

					<el-table-column label="电话号码" min-width="100" prop="telephone" />

				</el-table>
			</main>

			<!--      <div class="page">-->
			<!--        <el-pagination-->
			<!--          :page-sizes="[10, 20, 30, 40]"-->
			<!--          :page-size="food_form.limit"-->
			<!--          :current-page="food_form.page"-->
			<!--          layout="total, sizes, prev, pager, next, jumper"-->
			<!--          :total="table_data.total"-->
			<!--          @size-change="handle_size_change"-->
			<!--          @current-change="page_change"-->
			<!--        />-->
			<!--      </div>-->
			<!-- e菜品显示区  -->
		</el-card>
	</div>
</template>

<script>
import { GetWxList, PullNewList } from '@/api/company_wx'

export default {
	name: 'food',
	data() {
		return {
			food_form: {
				page: 1,
				limit: 10
			},
			formLabelWidth: '120px',
			table_data: {
				data: [],
				total: 0
			},
			labelPosition: 'right',
			menu_list: [] // 菜单列表

		}
	},
	async created() {
		this.getWxList()
	},
	methods: {
		// 重新拉取所有菜品列表
		pullNewList() {
			PullNewList()
				.then((res) => {
					this.$message.success('重新拉取成功')
					this.getWxList()
				})
				.catch((err) => {
					this.$message.error(err.data.msg)
				})
		},
		// 获取所有菜品列表
		getWxList(num) {
			// this.food_form.page = num || this.food_form.page
			// const param = this.food_form
			// GetWxList(param)
			GetWxList()
				.then((res) => {
					this.table_data.data = res.data.items
					this.table_data.total = res.data.total
				})
				.catch((err) => {
					this.$message.error(err.data.msg)
				})
		}

	}
}
</script>

<style lang='scss'>
.food {
  padding: 20px;

}
</style>
