import { Button, Col, Card, Input, Modal, Row, Space, Tag } from "antd";
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { filter } from "lodash";

const MetricSubtypeTabs = ({ standards, report, showReport }:any) => {
  const [search, setSearch] = useState("");
  const [metricDescription, setMetricDescription] = useState("");
  const [showDescription, setShowDescription] = useState<any>([]);

  const displayDescription = (idx: string) => {
    let arr = [...showDescription]
    arr.push(idx)
    setShowDescription(arr)
  }

  const hideDescription = (idx: any) => {
    let arr = [...showDescription]
    setShowDescription(arr.filter(x => x !== idx))
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (description:string) => {
    setMetricDescription(description)
    setIsModalOpen(true);
  }

  const handleOk = () => {
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const getReportEntries = (metricSubtype:string) => {
    let metrics = filter(report.esg_metrics, {'metric_subtype': metricSubtype});
    let text = `${metrics.length} Entr${metrics?.length === 1 ? 'y' : 'ies'}`
    return text
  }

  const modStandards = useMemo(() => {
      if (search === '') return standards;
      return filter(standards, (standard) => { return standard.metric_subtype.toLowerCase().indexOf(search) !== -1; })
  }, [standards, search])

  

  const getLink = (item: any) => {
    if (showReport) {
      return `/reports/${report.id}/metric-subtype?metric_name=${item.metric_name}&metric_subtype=${item.metric_subtype}`
    } else {
      return `/metric-subtype?metric_name=${item.metric_name}&metric_subtype=${item.metric_subtype}`
    } 
  }

  useEffect(() => {
    if (showDescription) {
     console.log(showDescription);
    }
   }, [showDescription]);

  return (
    <div>
      <Row gutter={40}>
          <Col sm={{span: 24}} lg={{span: 8}} style={{ marginBottom: 32 }}>
              <h3>Metric Search:</h3>
              <Input placeholder="Search for metric subytype" allowClear={true} onChange={(e) => setSearch(e.target.value.toLowerCase())} />
          </Col>
      </Row>
      <Row gutter={40}>
        {(modStandards && modStandards?.length < 1) &&
            <p>No results</p>
        }
        {modStandards?.map((item: any, idx:string) => (
          <Col sm={{span: 24}} lg={{span: 8}} key={idx} style={{ marginBottom: 32 }}>
            <Card
              title={item.metric_subtype}
              key={idx}
              type='inner'
              extra={<Link
                  to={getLink(item)}>View</Link>}
                  actions={[
                      <div>{showReport && getReportEntries(item.metric_subtype)}</div>,
                      <div>{showReport && '0 Pending Approval'}</div>,
                  ]}
              >
              <Space direction={'vertical'}>
                      {item.metric_code.split(',').map((code: any, idx:string) => (
                          <Tag key={idx}>{code}</Tag>
                        )
                      )}
              </Space>
              {(item.description && !showReport && !showDescription.includes(idx)) &&
                <DownOutlined style={{
                  float: 'right'
                }} onClick={(() => displayDescription(idx))} />
              }
              {(item.description && !showReport && showDescription.includes(idx)) &&
                <UpOutlined style={{
                  float: 'right'
                }} onClick={(() => hideDescription(idx))} />
              }
              {(!showReport && showDescription.includes(idx)) &&
                <Row style={{ paddingTop: '20px' }}>
                  {(item?.description && item.description.length > 500) ?
                    <div>
                      <p>{`${item.description.substring(0, 500)}...`}</p>
                      <p><Button type="link" onClick={() => showModal(item.description)}>Read more</Button></p>
                    </div>
                    :
                    <p>{item.description}</p>
                  }
                </Row>
              }
            </Card>
          </Col>
        ))}
      </Row>
      <Modal title="Metric Description" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>{metricDescription}</p>
      </Modal>
    </div>
  )
}

export default MetricSubtypeTabs