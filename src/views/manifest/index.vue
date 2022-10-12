<template>
	<div class="manifest">
		<el-card class="el-card">
			<!--s头部搜索      -->
			<div slot="header">
				<el-form :label-position="labelPosition" inline size="small">
					<el-form-item label="日期">
						<el-date-picker
							v-model="range"
							end-placeholder="结束日期"
							range-separator="至"
							start-placeholder="开始日期"
							type="daterange"
							value-format="yyyy-MM-dd"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="货单状态">
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
					<el-form-item label="货单id">
						<el-input v-model="search_form.manifest_no" placeholder="请输入货单号"></el-input>
					</el-form-item>
					<el-button size="mini" type="primary" @click="getList()">查找</el-button>
				</el-form>
			</div>
			<!--e头部搜索      -->

			<!--s货单表格      -->
			<el-table :data="table_data.data" class="el-table" stripe style="width: 100%">
				<el-table-column label="货单id" min-width="100" prop="id"></el-table-column>
				<el-table-column label="货单状态" min-width="100" prop="status">
					<template v-slot="scope">
						<el-tag v-if="scope.row.status === 1" type="primary">审核通过</el-tag>
						<el-tag v-else-if="scope.row.status === 3" type="danger">已批款（整张货单）</el-tag>
						<el-tag v-else-if="scope.row.status === 5" type="warning">收到货（整张货单）</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="货单日志" min-width="300" prop="log">
					<template v-slot="scope">
						<div class="table-log">
							<div v-for="(item,index) in scope.row.log_list" :key="index" class="table-log-item">
								<div class="log-action">{{ item.log_action }}</div>
								<div class="log-time">{{ item.log_time }}</div>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" min-width="180" prop="create_time"></el-table-column>
				<!--				<el-table-column label="完成时间" min-width="180" prop="finish_time"></el-table-column>-->
				<!--        // TODO (Leo) 2022/9/30 11:35: 上传凭证按钮权限（待付款状态，且是财务部门才可显示）-->
				<el-table-column label="操作" min-width="180">
					<template v-slot="scope">
						<el-button
							size="mini"
							type="primary"
							@click="displayManifest(scope.row)"
						>验收货单
							<!--              验收货单也就是收到货-->
						</el-button>
						<el-button
							size="mini"
							type="danger"
							@click="displayCertificate(scope.row)"
						>上传凭证
							<!--              上传凭证也就是批款-->
						</el-button>
					</template>
				</el-table-column>
				<!--e货单表格      -->
			</el-table>
			<div class="block" style="margin-top: 20px">
				<el-pagination
					:current-page="table_data.page"
					:page-size="table_data.limit"
					:page-sizes="[10, 20, 30, 40]"
					:total="table_data.total"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				>
				</el-pagination>
			</div>

		</el-card>

		<!--s验收弹窗    -->
		<el-dialog
			:visible.sync="merge_visible"
			title="验收货单"
			width="80%"
		>
			<div class="manifest-dialog-main">
				<div
					v-for="(item,index) in merge_list"
					:key="index"
					class="manifest-item"
				>
					<el-table
						:data="item.purchase_list"
						:summary-method="getSummaries"
						border
						class="el-table"
						show-summary
						style="width: 100%;margin-top: 20px"
					>
						<el-table-column label="序号" min-width="80" prop="id"></el-table-column>
						<el-table-column label="供应商" min-width="180">{{ item.name }}</el-table-column>
						<el-table-column label="货物名称" min-width="180" prop="store_name"></el-table-column>
						<!--						<el-table-column label="订单数量" min-width="100" prop="cart_num"></el-table-column>-->
						<!--						<el-table-column label="仓库数量" min-width="120" prop="store_num"></el-table-column>-->
						<el-table-column label="采购数量" min-width="100" prop="num"></el-table-column>
						<el-table-column label="采购价" min-width="100" prop="cost"></el-table-column>
						<el-table-column label="采购总价" min-width="180" prop="total_price"></el-table-column>
						<el-table-column label="货单id" min-width="180" prop="manifest_id"></el-table-column>
						<!--						<el-table-column label="创建时间" min-width="180" prop="create_time"></el-table-column>-->
						<!--         货物状态需要与后端对接-->
						<el-table-column label="货物状态" min-width="180" prop="status">
							<template v-slot="scope">
								<el-tag v-if="scope.row.team_accept_status === 1&&scope.row.manager_accept_status === 1" type="success">已验收</el-tag>
								<el-tag v-else-if="scope.row.team_pay_status === 1&&scope.row.manager_pay_status === 1" type="danger">待验收</el-tag>
								<el-tag v-else type="danger">待批款</el-tag>
							</template>
						</el-table-column>
					</el-table>
					<div class="manifest-item-btn">
						<el-button size="mini" type="primary" @click="confirmAccept(merge_list[index])">验收</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
		<!--e验收弹窗    -->

		<!--				action="https://jsonplaceholder.typicode.com/posts/"-->

	</div>
</template>

<script>
import { GetManifestList, GetPurchaseList, ChangeManifestStatus } from '@/api/manifest'
import localStorage from '@/utils/localStorage'

export default {
	name: 'index',
	data() {
		return {
			labelPosition: 'right',
			search_form: {
				date: '',
				page: 1,
				status: '1',
				limit: 10,
				create_time_l: '',
				create_time_r: ''
			},

			range: ['', ''],
			// 货单状态列表
			status_options: [
				{
					id: '1',
					label: '审核通过'
				},
				{
					id: '3',
					label: '已批款（整张货单）'
				},
				{
					id: '5',
					label: '收到货（整张货单）'
				}
			],
			// 货单表格数据
			table_data: {
				data: [],
				total: 0
			},

			// s货单详细列表
			merge_list: [],
			merge_visible: false
			// e货单详细列表
		}
	},
	created() {
		this.getList()
	},
	methods: {
		// 获取货单列表数据 // 列表
		getList(num) {
			this.search_form.create_time_r = this.range[0]
			this.search_form.create_time_l = this.range[1]
			this.search_form.page = num || this.search_form.page
			GetManifestList(this.search_form)
				.then((res) => {
					console.log(res)
					this.table_data.data = res.data.items
					this.table_data.total = res.data.total
				})
				.catch((err) => {
					this.$message.error(err)
				})
		},
		handleSizeChange(val) {
			this.search_form.limit = val
			this.getList()
		},
		handleCurrentChange(val) {
			this.search_form.page = val
			this.getList()
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
				// TODO：注意采购的字段在接口对接时要修改
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
		// 查看货单
		displayManifest(row) {
			// console.log(row)
			GetPurchaseList({ manifest_id: row.id })
				.then((res) => {
					console.log(res)
					res.data.forEach((supplier) => {
						supplier.purchase_list.forEach((item) => {
							item.total_price = item.num * item.cost
						})
					})
					this.merge_list = res.data
					this.merge_visible = true
				})
				.catch((err) => {
					this.$message.error(err)
				})
		},
		// s上传凭证
		// 打开上传凭证框
		displayCertificate(row) {

		},

		confirmAccept(item) {
			console.log(item)
			ChangeManifestStatus({ id: item.purchase_list[0].id, status: 5, admin_id: localStorage.get('admin_info').admin_id })
				.then((res) => {
					console.log(res)
					this.$message({
						type: 'success',
						message: '操作成功!'
					})
					this.merge_visible = false
					this.merge_list = []
					this.getList()
				})
				.catch((err) => {
					console.log(err)
					this.$message.error(err.data.data)
				})
		}
	}
}
</script>

<style lang='scss' scoped>
/* 宽高分别对应纵向滚动条和横向滚动条的宽度 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: #00000040;
}

::-webkit-scrollbar-thumb {
  background-color: #9a9a9a; /*rgba(0,0,0,1);*/
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

.manifest {
  .el-card {
    margin: 20px;
  }

  .el-table {
    .table-log {
      height: 40px;
      overflow-y: auto;

      .table-log-item {
        display: flex;
        overflow-y: auto;

        .log-action {
          width: 50%;
          text-align: left;
        }

        .log-time {
          width: 50%;
          text-align: center;
        }
      }
    }
  }

  .manifest-dialog-main {
    height: 600px;
    overflow-y: auto;
  }

  .manifest-item {
    margin-bottom: 40px;

    .manifest-item-btn {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .manifest-bottom-btn {
    //position: fixed;
    //bottom: 0;
    display: flex;
    justify-content: center;
  }
}
</style>
