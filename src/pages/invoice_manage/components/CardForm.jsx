import React, {useState} from 'react';
import { Modal, Card, List, Button } from 'antd';
import styles from './style.less';
import Description from "./Description";

const CardForm = props => {
  const { dataSource, pageChange, handleOperation } = props;
  const [modelVisible,handleModelVisible] = useState(false);
  const [detail,addDetail] = useState();

  const handleCancel = () => {handleModelVisible(false);addDetail({})};

  const showConfirm = async (operate,invoiceCode) => {
    const { confirm } = Modal;
    let str=operate==='pass'?'通过':'退回';
    confirm({
      content: '确认'+str+'吗？',
      onOk() {
        handleOperation(operate,invoiceCode);
      },
      onCancel() {},
    });
  };

  return (
    <div className={styles.cardList}>
      <List
        rowKey="id"
        grid={{
          gutter: 24,
          lg: 3,
          md: 2,
          sm: 1,
          xs: 1,
        }}
        dataSource={dataSource.results}
        pagination={{...dataSource.pagination,onChange: page => pageChange(page)}}
        renderItem={item => {
          if(item.status===0){
            return (
              <List.Item key={item.id}>
                <Card
                  title={(<div><span style={{fontSize:19,color:'red'}}>待报销金额</span><span style={{fontSize:27,float:'right'}}>¥{item.invoiceMoney}</span></div>)}
                  className={styles.card}
                  actions={[<a onClick={()=> {addDetail(item);handleModelVisible(true)}}>详细信息</a>, <a onClick={() => showConfirm('pass',item.invoiceCode)}>通过</a>, <a onClick={() => showConfirm('reject',item.invoiceCode)}>退回</a>]}
                >
                  <div>发票编号：<span style={{float:'right'}}>{item.invoiceNum}</span></div>
                  <div>购买方：<span style={{float:'right'}}>{item.purchaseInfo.purchaseName}</span></div>
                  <div>销售方：<span style={{float:'right'}}>{item.sellerInfo.sellerName}</span></div>
                  <div>货物或应税服务、劳务：<span style={{float:'right'}}>{item.commodityInfo[0].commodityName}</span></div>
                </Card>
              </List.Item>
            );
          }
          else if(item.status===1){
            return (
              <List.Item key={item.id}>
                <Card
                  title={(<div><span style={{fontSize:19,color:'green'}}>已报销金额</span><span style={{fontSize:27,float:'right'}}>¥{item.invoiceMoney}</span></div>)}
                  className={styles.card}
                  actions={[<a key="option1" onClick={()=> {addDetail(item);handleModelVisible(true)}}>详细信息</a>]}
                >
                  <div>发票编号：<span style={{float:'right'}}>{item.invoiceNum}</span></div>
                  <div>购买方：<span style={{float:'right'}}>{item.purchaseInfo.purchaseName}</span></div>
                  <div>销售方：<span style={{float:'right'}}>{item.sellerInfo.sellerName}</span></div>
                  <div>货物或应税服务、劳务：<span style={{float:'right'}}>{item.commodityInfo[0].commodityName}</span></div>
                </Card>
              </List.Item>
            );
          }
          return (
            <List.Item key={item.id}>
              <Card
                title={(<div><span style={{fontSize:19,color:'gray'}}>已退回发票金额</span><span style={{fontSize:27,float:'right'}}>¥{item.invoiceMoney}</span></div>)}
                className={styles.card}
                actions={[<a key="option1" onClick={()=> {addDetail(item);handleModelVisible(true)}}>详细信息</a>]}
              >
                <div>发票编号：<span style={{float:'right'}}>{item.invoiceNum}</span></div>
                <div>购买方：<span style={{float:'right'}}>{item.purchaseInfo.purchaseName}</span></div>
                <div>销售方：<span style={{float:'right'}}>{item.sellerInfo.sellerName}</span></div>
                <div>货物或应税服务、劳务：<span style={{float:'right'}}>{item.commodityInfo[0].commodityName}</span></div>
              </Card>
            </List.Item>
          );
        }}
      />
      {detail && Object.keys(detail).length ? (
        detail.status===0?
          (<Modal
            destroyOnClose
            width={1000}
            title="发票详情"
            visible={modelVisible}
            onCancel={handleCancel}
            footer={[
              <Button type="primary" size='large' onClick={() => {handleOperation('pass',detail.invoiceCode);handleCancel()}}>
                通过
              </Button>,
              <Button key="submit" type="primary" size='large' onClick={() => {handleOperation('reject',detail.invoiceCode);handleCancel()}}>
                退回
              </Button>,
              <Button size='large' onClick={handleCancel}>
                取消
              </Button>,
            ]}
          >
              <Description detail={detail}/>
          </Modal>)
              :
      (<Modal
        destroyOnClose
        width={1000}
        title="发票详情"
        visible={modelVisible}
        onCancel={handleCancel}
        footer={[
          <Button size='large' type='primary' onClick={handleCancel}>
            取消
          </Button>,
        ]}
      >
          <Description detail={detail}/>
        </Modal>
          )
        ) : null}
    </div>
  );
};

export default CardForm;
