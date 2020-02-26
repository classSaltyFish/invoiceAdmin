import { message, Card } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CardForm from './components/CardForm';
import { queryRule, operateRule } from './service';
import styles from './style.less';
/**
 * 添加节点
 * @param fields
 */


const TableList = () => {
  const [operationKey, onOperationTabChange] = useState('all');
  const [page,pageChange] = useState(1);
  const [allData, dataChange] = useState({results:[],pagination:{}});
  const [waitReviewData, waitDataChange] = useState({results:[],pagination:{}});
  const [recordData, recordDataChange] = useState({results:[],pagination:{}});

  const handleOperation = async (operation,invoiceCode) => {
    try {
      await operateRule({operation, invoiceCode});
      message.success('操作成功');
      queryRule({key:operationKey,current:page,pageSize:9}).then(newData =>{
        if(operationKey==='all'){
          dataChange(newData);
        }else if(operationKey==='wait'){
          waitDataChange(newData);
        }else{
          recordDataChange(newData);
        }
      });
      return true;
    } catch (error) {
      message.error('操作失败请重试！');
      return false;
    }
  };

  const operationTabList = [
    {
      key: 'all',
      tab: '全部发票',
    },
    {
      key: 'wait',
      tab: '待审核发票',
    },
    {
      key: 'record',
      tab: '审核记录',
    },
  ];

  useEffect(() => {
    queryRule({key:operationKey,current:page,pageSize:9}).then(newData =>{
      if(operationKey==='all'){
        dataChange(newData);
      }else if(operationKey==='wait'){
        waitDataChange(newData);
      }else{
        recordDataChange(newData);
      }
    })
  } , [page]);

  useEffect(() => {
    if(page!==1){
      pageChange(1);
    }else{
      queryRule({key:operationKey,current:1,pageSize:9}).then(newData =>{
        if(operationKey==='all'){
          dataChange(newData);
        }else if(operationKey==='wait'){
          waitDataChange(newData);
        }else{
          recordDataChange(newData);
        }
      })
    }
  } , [operationKey])

  const contentList = {
    all: (
      <CardForm
        handleOperation={handleOperation}
        pageChange={pageChange}
        dataSource={allData}
      />
    ),
    wait: (
      <CardForm
        handleOperation={handleOperation}
        pageChange={pageChange}
        dataSource={waitReviewData}
      />
    ),
    record: (
      <CardForm
        handleOperation={handleOperation}
        pageChange={pageChange}
        dataSource={recordData}
      />
    ),
  };
  return (
    <PageHeaderWrapper title="发票管理">
      <Card
        bordered={false}
        tabList={operationTabList}
        onTabChange={onOperationTabChange}
      >
        {contentList[operationKey]}
      </Card>
    </PageHeaderWrapper>
  );
};

export default TableList;
