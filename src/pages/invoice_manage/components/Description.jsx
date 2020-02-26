import React, {useState} from 'react';
import { Descriptions,Badge,Modal,Button } from 'antd';
import {imgUrl} from '../../../utils/axios'

const Description = props => {
  const { detail } = props;
  const [visible,handleVisible] = useState(false);

  const handleCancel = () => handleVisible(false);

  return (
    <>
      <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
        <Descriptions.Item label="发票代码">{detail.invoiceCode}</Descriptions.Item>
        <Descriptions.Item label="发票号码">{detail.invoiceNum}</Descriptions.Item>
        <Descriptions.Item label="总金额">{detail.invoiceMoney}</Descriptions.Item>
        <Descriptions.Item label="开票日期">{detail.invoiceDate}</Descriptions.Item>
        <Descriptions.Item label="发票类型">{detail.invoiceType}</Descriptions.Item>
        <Descriptions.Item label="卖家信息">
          {detail.sellerInfo.sellerName}
        </Descriptions.Item>
        <Descriptions.Item label="买家信息">
          {detail.purchaseInfo.purchaseName}
        </Descriptions.Item>
        <Descriptions.Item label="上传时间">{detail.uploadDate}</Descriptions.Item>
        <Descriptions.Item label="审批时间">{detail.processDate}</Descriptions.Item>
        <Descriptions.Item label="商品信息" span={3}>
          {detail.commodityInfo.map((item, index) => (
            <Descriptions bordered={false} title={item.commodityName} key={index}>
              <Descriptions.Item label="购买数量">{item.commodityNum}</Descriptions.Item>
              <Descriptions.Item label="单价">{item.commodityPrice}</Descriptions.Item>
              <Descriptions.Item label="总价">{item.commodityAmount}</Descriptions.Item>
              <Descriptions.Item label="税费">
                {item.commodityTax}
              </Descriptions.Item>
            </Descriptions>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="审批状态">
          {detail.status===0?<Badge status="processing" text="待审批" />:
            (detail.status===1?<Badge status="success" text="审批通过" />:<Badge status="default" text="退回" />)
          }
        </Descriptions.Item>
        <Descriptions.Item label="审批人">{detail.processor}</Descriptions.Item>
        <Descriptions.Item label="上传者">{detail.uploader}</Descriptions.Item>
        <Descriptions.Item label="查看原图"><Button type='primary' onClick={() => handleVisible(true)}>查看原图</Button></Descriptions.Item>
      </Descriptions>
      <Modal
        destroyOnClose
        width={1000}
        title="发票原图"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button type='primary' onClick={handleCancel}>
            取消
          </Button>,
        ]}
      >
        <img src={imgUrl+detail.imgUrl} alt='发票原图'/>
      </Modal>
    </>
  );
};

export default Description;
