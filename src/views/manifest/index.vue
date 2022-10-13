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
				<el-table-column label="货单状态" min-width="125" prop="status">
					<template v-slot="scope">
						<el-tag v-if="scope.row.status === 1" type="primary">审核通过</el-tag>
						<el-tag v-else-if="scope.row.status === 3" type="danger">已批款（整张货单）</el-tag>
						<!--						<el-tag v-else-if="scope.row.status === 5" type="warning">收到货（整张货单）</el-tag>-->
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
							type="danger"
							@click="displayManifest(scope.row)"
						>查看详情
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

		<!--s批款弹窗    -->
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
						<el-table-column label="团队批款状态" min-width="180" prop="team_pay_status">
							<template v-slot="scope">
								<el-tag v-if="scope.row.team_pay_status === '1'" type="success">已批款</el-tag>
								<el-tag v-else type="danger">待批款</el-tag>
								<!--                <el-tag v-if="scope.row.team_accept_status === '1'&&scope.row.manager_accept_status === '1'" type="success">已验收</el-tag>-->
								<!--                <el-tag v-else-if="scope.row.team_pay_status === '1'&&scope.row.manager_pay_status === '1'" type="danger">待验收</el-tag>-->
								<!--                <el-tag v-else type="danger">待批款</el-tag>-->
							</template>
						</el-table-column>
						<el-table-column label="管理员批款状态" min-width="180" prop="manager_accept_status">
							<template v-slot="scope">
								<el-tag v-if="scope.row.manager_accept_status === '1'" type="success">已批款</el-tag>
								<el-tag v-else type="danger">待批款</el-tag>
							</template>
						</el-table-column>
					</el-table>
					<div class="manifest-item-btn">
						<el-button size="mini" type="primary" @click="uploadVoucher(item)">上传凭证</el-button>
						<el-button size="mini" type="primary" @click="confirmAccept(merge_list[index],1)">批款通过</el-button>
						<el-button size="mini" type="primary" @click="confirmAccept(merge_list[index],2)">批款不通过</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
		<!--e批款弹窗    -->

		<!-- s上传凭证 -->
		<el-dialog
			:before-close="handleClose"
			:visible.sync="add_visible"
			title="上传凭证"
			width="60%"
		>
			<el-form
				ref="addForm"
				:model="addForm"
				:rules="addRules"
				label-width="80px"
			>
				<el-form-item label="提交附件" prop="image">
					<el-image v-if="addForm.file_id" :src="'http://'+addForm.file_path_url" style="width: 100px;height: 100px;cursor:pointer" @click="viewFile(1)"></el-image>
					<div v-if="addForm.file_name">{{ addForm.file_name }}</div>
					<el-button v-if="addForm.file_id" type="text" size="mini" @click="removeFile(1)">删除附件</el-button>
					<el-button v-if="addForm.file_id === '' " type="primary" size="mini" @click="viewFile(1)">附件选择</el-button>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="add_visible = false">取 消</el-button>
				<el-button type="primary" @click="addSubmit('addForm')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- e上传凭证 -->
		<!-- s 附件选择 -->
		<el-dialog :visible.sync="file_visible" title="附件选择" width="70%">
			<div>
				<el-button size="mini" type="primary" @click="upload_visible = true">附件上传</el-button>
			</div>
			<el-table :data="file_table.data" style="width: 100%">
				<el-table-column prop="file_name" label="文件名" width="200"></el-table-column>
				<el-table-column prop="file_type" label="文件类型" width="100">
					<template v-slot="scope">
						{{ '图片' }}
					</template>
				</el-table-column>
				<el-table-column prop="file_path_url" label="照片" min-width="100">
					<template slot-scope="scope">
						<el-image
							ref="lazyImg"
							class="vx-lazyLoad"
							:src="'http://'+scope.row.file_path_url"
							fit="fit"
							:preview-src-list="['http://'+scope.row.file_path_url]"
							style="width: 100px; height: 100px"
						>
							<div slot="placeholder" class="image-slot">
								<i class="el-icon-loading"></i>加载中
							</div>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="create_time" label="上传时间" min-width="200"></el-table-column>
				<el-table-column label="操作" width="200">
					<template v-slot="scope">
						<el-button size="mini" type="primary" @click="select_file(scope.row)">选择</el-button>
						<el-button size="mini" type="danger" @click="delete_file(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="block" style="display:flex;flex-direction: row-reverse;margin: 20px 0">
				<el-pagination
					:current-page="file_form.page"
					:page-size="file_form.limit"
					:page-sizes="[10, 20, 30, 40]"
					:total="file_table.total"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleFileSizeChange"
					@current-change="handleFileCurrentChange"
				></el-pagination>
			</div>
		</el-dialog>
		<!-- e 附件选择 -->
		<!-- s 附件上传 -->
		<el-dialog :visible.sync="upload_visible" title="附件上传" width="50%">
			<el-upload
				ref="upload"
				class="upload-demo"
				:action="upload_url"
				:headers="upload_headers"
				:data="uploadForm"
				name="files"
				:on-success="handleSuccess"
				:on-error="handleError"
				:on-remove="handleRemove"
				:file-list="fileList"
				:limit="1"
				:on-exceed="handleExceed"
				:before-upload="beforeAvatarUpload"
			>
				<el-button size="small" type="primary">点击上传</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg jpeg png文件</div>
			</el-upload>
		</el-dialog>
		<!-- e 附件上传 -->

		<!--				action="https://jsonplaceholder.typicode.com/posts/"-->

	</div>
</template>

<script>
import { AddPhoto, GetDmcList, GetManifestList, GetPurchaseList, PayPurchase, UpdateDmc } from '@/api/manifest'
import localStorage from '@/utils/localStorage'
import { getToken } from '@/utils/auth'
import { GetTeamUserInfo } from '@/api/admin'

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
					label: '待批款'
				},
				{
					id: '3',
					label: '已批款（整张货单）'
				}
				// {
				// 	id: '5',
				// 	label: '收到货（整张货单）'
				// }
			],
			// 货单表格数据
			table_data: {
				data: [],
				total: 0
			},

			// s货单详细列表
			merge_list: [],
			merge_visible: false,
			// e货单详细列表

			// s上传凭证
			add_visible: false,
			addForm: {
				file_id: '',
				file_name: '',
				file_path_url: '',
				item: ''
			},
			addRules: {
			},

			// file_src: require('../../assets/images/zip.webp'),
			// s附件
			file_visible: false, // 附件选择对话框
			file_form: {
				page: 1,
				limit: 10,
				file_category: 1,
				status: 1,
				admin_type: 2,
				mer_id: localStorage.get('admin_info').mer_id,
				provider_id: 0
			},
			file_table: {
				data: [],
				total: 0
			},
			upload_visible: false, // 附件上传对话框
			upload_url: process.env.VUE_APP_BASE_API + '/v1/dmc/UploadDmc', // 附件上传地址
			upload_headers: {
				token: getToken()
			},
			uploadForm: {
				type: 1, // 3为压缩包
				admin_type: 2,
				mer_id: localStorage.get('admin_info').mer_id,
				provider_id: 0
			},
			fileList: [], // 附件列表

			is_manager: false, // (leo) : 是否是团队管理员
			is_member: false // (leo) : 是否是团队成员

		}
	},
	created() {
		this.hasPermission()
		this.getList()
	},
	methods: {
		// (leo)  判断是否有权限
		hasPermission() {
			// (leo) : 判断是否是团队成员或是团队管理员
			const admin_id = String(localStorage.get('admin_info').admin_id)
			GetTeamUserInfo({ id: 3 })
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
		uploadVoucher(item) {
			this.add_visible = true
			this.addForm.item = item
		},

		confirmAccept(item, num) {
			console.log(item)
			PayPurchase({ supplier_id: item.purchase_list[0].supplier_id, manifest_id: item.purchase_list[0].manifest_id, status: num, admin_id: localStorage.get('admin_info').admin_id })
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
		},

		handleClose(done) {
			this.$confirm('确认关闭？')
				.then((_) => {
					done()
				})
				.catch((_) => {
				})
		},

		// s附件选择与上传
		// 打开上传附件的对话框
		viewFile(task_type) {
			// this.task_type = task_type
			this.file_visible = true
			this.getAllFile()
		},
		// 移除附件
		removeFile(type) {
			this.addForm.file_id = ''
			this.addForm.file_name = ''
			this.addForm.file_path_url = ''
		},
		// 获取附件列表
		getAllFile() {
			GetDmcList(this.file_form)
				.then((res) => {
					this.file_table.data = res.data.Items
					this.file_table.total = res.data.total
				})
				.catch((err) => {
					this.$message.error(err.data.msg)
				})
		},
		handleFileSizeChange(val) {
			this.file_form.limit = val
			this.getAllFile()
		},
		handleFileCurrentChange(val) {
			this.file_form.page = val
			this.getAllFile()
		},
		// 选择附件
		select_file(row) {
			this.addForm.file_id = row.id
			this.addForm.file_name = row.file_name
			this.addForm.file_path_url = row.file_path_url
			this.file_visible = false
		},
		// 附件选择框中删除附件
		delete_file(row) {
			this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				UpdateDmc({ id: row.id, file_name: row.file_name, status: 0 })
					.then((res) => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						})
						this.getAllFile()
					})
					.catch((err) => {
						this.$message.error(err.data.msg)
					})
			})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		},
		// s上传附件相关函数
		handleSuccess(res, file) {
			console.warn('handleSuccess', res, file)
			if (res.status === 200) {
				this.fileList = []
				this.upload_visible = false
				this.$message({
					message: '上传成功',
					type: 'success'
				})
				this.getAllFile()
			} else {
				this.$message.error(res.msg)
				this.fileList = []
			}
		},
		handleRemove(file, fileList) {
			this.fileList = fileList
		},
		handleError(err, file) {
			this.$message({
				message: '上传失败',
				type: 'error'
			})
		},
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
		},
		beforeAvatarUpload(file) {
			const isPic = file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png')
			if (!isPic) {
				this.$message.error('上传文件只能是 jpg jpeg png 格式!')
			}
			return isPic
		},

		// 上传凭证
		addSubmit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					const params = {
						manifest_id: this.addForm.item.purchase_list[0].manifest_id,
						supplier_id: this.addForm.item.supplier_id,
						upload: this.addForm.file_path_url
					}
					AddPhoto(params)
						.then((res) => {
							this.$message({
								message: '上传凭证成功',
								type: 'success'
							})
							this.addForm.file_id = ''
							this.addForm.file_name = ''
							this.addForm.file_path_url = ''
							this.add_visible = false
						})
						.catch((err) => {
							this.$message.error(err.data.msg)
						})
				} else {
					console.log('error submit!!')
					return false
				}
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
