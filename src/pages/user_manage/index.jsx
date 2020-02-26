import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryRule, removeRule,freezeRule,unfreezeRule } from './service';


const handleFreeze = async selectedRow => {
  try {
    await freezeRule({
      key: selectedRow
    });
    message.success('操作成功');
    return true;
  } catch (error) {
    message.error('操作失败，请重试');
    return false;
  }
};

const handleUnfreeze = async selectedRow => {
  try {
    await unfreezeRule({
      key: selectedRow
    });
    message.success('操作成功');
    return true;
  } catch (error) {
    message.error('操作失败，请重试');
    return false;
  }
};

const TableList = () => {
  const [sorter, setSorter] = useState('');
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();

  const handleRemove = async (selectedRows,action) => {
    if (!selectedRows) return true;

    try {
      await removeRule({
        key: selectedRows,
      });
      message.success('删除成功');
      if(action){
        action.reload();
      }else{
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      message.error('删除失败，请重试');
      return false;
    }
  };

  const showConfirm = async (selectedRows,action) => {
    const { confirm } = Modal;

    confirm({
      // title: 'Do you want to delete these items?',
      content: '确定删除吗？',
      onOk() {
        return handleRemove(selectedRows,action)
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: '用户id',
      dataIndex: 'openId',
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
        },
      ],
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      valueType: 'textarea',
    },
    {
      title: '报销金额合计',
      dataIndex: 'reimbursement',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: val => `${val} `,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '冻结',
          status: 'Default',
        },
        1: {
          text: '正常',
          status: 'Processing',
        },
      },
    },
    {
      title: '最近报销时间',
      dataIndex: 'latestSubmit',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {record.status===0?
            <a
              onClick={async () => {
                await handleUnfreeze([record.id]);
                actionRef.current.reload();
              }}
            >解除冻结
            </a> :
            <a
              onClick={async () => {
                await handleFreeze([record.id]);
                actionRef.current.reload();
              }}
            >冻结
            </a>
          }
          <Divider type="vertical" />
          <a onClick={async () => {
            await showConfirm([record.id]);
          }}>删除</a>

        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter;

          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        toolBarRender={(action, { selectedRows }) => [
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await showConfirm(selectedRows.map(row => row.id),action);
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  {/*<Menu.Item key="approval">批量审批</Menu.Item>*/}
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={(selectedRowKeys, selectedRows) => (
          <div>
            已选择{' '}
            <a
              style={{
                fontWeight: 600,
              }}
            >
              {selectedRowKeys.length}
            </a>{' '}
            项&nbsp;&nbsp;
            <span>
              报销金额合计 {selectedRows.reduce((pre, item) => pre + item.reimbursement, 0)}
            </span>
          </div>
        )}
        request={params => queryRule(params)}
        columns={columns}
        rowSelection={{}}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
