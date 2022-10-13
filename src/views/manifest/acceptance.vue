<template>
	<div class="manifest">
		<el-card class="el-card">
			<!--s头部搜索      -->
			<div slot="header">
				<el-form :label-position="'right'" inline size="small">
					<el-form-item label="采购单号">
						<el-input v-model="search_form.search_no" placeholder="请输入采购单号"></el-input>
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
import {
	GetManifestList
} from '@/api/manifest'

export default {
	name: 'acceptance.vue',
	data() {
		return {
			search_form: {
				search_no: ''
			}

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
