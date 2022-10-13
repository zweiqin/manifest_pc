<template>
	<div class="goods">
		<el-card class="el-card">
			<!-- s头部日期选择     -->
			<div slot="header" class="header">
				<el-date-picker
					v-model="date"
					placeholder="选择日期"
					type="date"
					value-format="yyyy-MM-dd"
					@change="getGoodsList"
				>
				</el-date-picker>
				<el-button class="header-btn" type="primary" @click="createManifest()">生成当天货单</el-button>
			</div>
			<!-- e头部日期选择     -->

			<!--s货单表格部分 以商品为单位 不同订单同商品不合并   -->
			<div class="table">
				<el-table
					:data="manifest_list"
					:summary-method="getSummaries"
					border
					class="el-table"
					show-summary
					style="width: 100%;margin-top: 20px"
				>
					<el-table-column label="序号" min-width="80" prop="id"></el-table-column>
					<el-table-column label="供应商" min-width="180" prop="name"></el-table-column>
					<el-table-column label="货物名称" min-width="180" prop="store_name"></el-table-column>
					<el-table-column label="订单数量" min-width="100" prop="cart_num"></el-table-column>
					<el-table-column label="仓库数量" min-width="120" prop="store_num">
						<template v-slot="scope">
							<el-input
								v-model="scope.row.store_num"
								style="width: 100px"
								:disabled="is_confirm"
								@change="changeWarehouseNum(scope.row)"
							></el-input>
						</template>
					</el-table-column>
					<el-table-column label="采购数量" min-width="100" prop="purchase_num"></el-table-column>
					<el-table-column label="采购价" min-width="100" prop="cost"></el-table-column>
					<el-table-column label="采购总价" min-width="180" prop="total_price"></el-table-column>
					<el-table-column label="货单id" min-width="180" prop="manifest_id"></el-table-column>
					<el-table-column label="创建时间" min-width="180" prop="create_time"></el-table-column>
					<el-table-column label="货物状态" min-width="180" prop="accept_status">
						<template v-slot="scope">
							<el-tag v-if="scope.row.status === 1" type="success">成功验收</el-tag>
							<el-tag v-else type="danger">还没有验收</el-tag>
						</template>
					</el-table-column>
				</el-table>

				<!--      // (leo) 2022/9/30 10:37: 生成货单按钮权限控制，仅在货单未提交时可以保存与提交-->
				<div v-if="!is_confirm" class="foot-btn">
					<el-button class="foot-btn-item" type="primary" @click="confirmStore()">确认仓库数量</el-button>
				</div>
				<div v-else class="foot-btn">
					<el-button class="foot-btn-item" type="primary" @click="submitManifest()">提交审批</el-button>
				</div>
			</div>

		</el-card>
	</div>

</template>

<script>
import { CreateManifest, GetManifestList, ChangeManifestStatus, UpdateManifestNum } from '@/api/manifest'
import localStorage from '@/utils/localStorage'
export default {
	name: 'goods',
	data() {
		return {
			date: '',
			manifest_list: [],
			// store_disabled: false,
			is_confirm: false
		}
	},
	created() {
		// console.log(localStorage.get('admin_info'))
	},
	methods: {
		// 更改日期时获得当天货单列表（如果有的话）
		getGoodsList() {
			console.log(this.date)
		},
		// 生成货单
		createManifest() {
			this.$confirm('确定要生成货单吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// eslint-disable-next-line no-warning-comments
				// 生成货单时需要将采购数量和采购价相乘得到采购总价
				CreateManifest({ date: this.date })
					.then((res) => {
						// console.log(res)
						// this.$message.success(response_msg)
						GetManifestList({ date: this.date, status: 0 })
							.then((res) => {
								console.log(res)
								if (res.data.items.length !== 0) {
									res.data.items[0].ProductList.forEach((item) => {
										item.total_price = item.purchase_num * item.cost
									})
									this.manifest_list = res.data.items[0].ProductList
									this.$message({
										type: 'success',
										message: '生成成功!'
									})
								} else {
									this.$message({
										type: 'error',
										message: '没有数据!'
									})
								}
							})
							.catch((err) => {
								console.log(err)
								this.$message.error(err.data.data)
							})
					})
					.catch((err) => {
						console.log(err)
						this.$message.error(err.data.data)
					})
			})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消生成'
					})
				})
		},
		// 合计采购总价
		getSummaries(param) {
			const { columns, data } = param
			const sums = []
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计'
					return
				}
				// eslint-disable-next-line no-warning-comments
				// 注意采购的字段在接口对接时要修改
				if (column.property === 'total_price') {
					const values = data.map((item) => Number(item[column.property]))
					sums[index] = values.reduce((prev, curr) => {
						const value = Number(curr)
						if (!isNaN(value)) {
							return prev + curr
						}
						return prev
					}, 0)
				}
			})
			return sums
		},
		// 修改仓库数量
		changeWarehouseNum(row) {
			this.manifest_list.forEach((item) => {
				if (item.id === row.id) {
					// console.log(item.store_num, row.store_num, item.id, row.id)
					item.store_num = row.store_num
					item.purchase_num = item.cart_num - row.store_num
					// console.log(item.cart_num - row.store_num)
					item.total_price = item.purchase_num * item.cost
				}
			})
		},
		// 确认仓库数量
		confirmStore() {
			// const tempObj = JSON.parse(JSON.stringify(this.manifest_list))
			const tempObj = this.$deepClone(this.manifest_list)
			tempObj.forEach((item) => item.purchase_num = String(item.purchase_num))
			UpdateManifestNum({ data: tempObj })
				.then((res) => {
					console.log(res)
					this.is_confirm = true
					this.$message({
						type: 'success',
						message: '确认成功!'
					})
				})
				.catch((err) => {
					console.log(err)
					this.$message.error(err.data.data)
				})
		},
		// 提交审批
		submitManifest() {
			this.$confirm('确定要提交审批吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				if (this.manifest_list.length === 0) {
					return this.$message({
						type: 'error',
						message: '没有数据!'
					})
				}
				ChangeManifestStatus({ id: this.manifest_list[0].manifest_id, status: 7, admin_id: localStorage.get('admin_info').admin_id })
					.then((res) => {
						console.log(res)
						this.manifest_list = []
						this.$message({
							type: 'success',
							message: '提交成功!'
						})
					})
					.catch((err) => {
						console.log(err)
						this.$message.error(err.data.data)
					})
			})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消提交'
					})
				})
		}
	}
}
</script>

<style lang='scss' scoped>
.goods {
  .el-card {
    margin: 20px;

    .header {
      .header-btn {
        margin-left: 20px;
      }
    }

    .el-table {
      margin-bottom: 100px;
    }

    .foot-btn {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

