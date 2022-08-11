import { Col, Card, Input, Row, Space, Tag } from "antd";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { filter } from "lodash";

const MetricSubtypeTabs = ({ standards, report, showReport }:any) => {
  const [search, setSearch] = useState("");

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

  return (
    <div>
      <Row gutter={40}>
          <Col span={8} style={{ marginBottom: 32 }}>
              <h3>Metric Search:</h3>
              <Input placeholder="Search for metric subytype" allowClear={true} onChange={(e) => setSearch(e.target.value.toLowerCase())} />
          </Col>
      </Row>
      <Row gutter={40}>
        {(modStandards && modStandards?.length < 1) &&
            <p>No results</p>
        }
        {modStandards?.map((item: any, idx:string) => (
          <Col span={8} key={idx} style={{ marginBottom: 32 }}>
            <Link to={getLink(item)}>
              <Card
                title={item.metric_subtype}
                key={idx} 
                type='inner'
                extra={showReport && <Link
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
                {!showReport &&
                  <Row style={{paddingTop: '20px'}}>
                    <p>{item.description}</p>
                  </Row>
                }
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default MetricSubtypeTabs