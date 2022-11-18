/* IMPORT EXTERNAL MODULES */
import { Col, Card, Row, Space, Tabs, Tag } from "antd";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { flatten, filter, groupBy, map, sortBy, uniq } from "lodash";

const MetricPillarTabs = ({ standards, report, showReport }:any) => {   
  const getReportEntries = (standards: any) => {
      let codes = map(standards.items, 'metric_code')
      let metrics = filter(report.esg_metrics, function (metric: any) {
          let metricCodes = metric.metric_code.split(';').map((c:string) => c.trim())
          return metricCodes.some((c:any) => codes.indexOf(c) >= 0)
      });
      let text = `${metrics.length} Entr${metrics?.length === 1 ? 'y' : 'ies'}`
      return text
  }

  /**
   * Organizes metric codes that corresponds to metric name and groups based on reporting standard.
   * 
   * @param items 
   * @returns Array of Objects
   */
  const codesByStandard = (items: any) => {
    return map(groupBy(items, 'reporting_standard'), (data, name) => ({
        data,
        name
    }))
  }

  const groupByCat = (subMetrics:any) => {
    return sortBy(map(groupBy(subMetrics, 'esg_pillar'), (metric_names, esg_pillar) => ({
        esg_pillar: esg_pillar,
        metric_names: sortBy(map(groupBy(metric_names, 'metric_name'), (items,name) => ({items, name})), 'name')
    })), (item) => {
        const order: any = {
            'Environment': 0,
            "Social": 1,
            "Governance": 2,
            "Activity-Level": 3
        }
        return order[item.esg_pillar]
    })
  }

  const modStandards = useMemo(() => {
    return groupByCat(standards)
  }, [standards])

  const getLink = (item: any, esg_pillar: string) => {
    if (showReport) {
      return `/reports/${report.id}/metric-subtypes?metric_name=${item.name}&esg_pillar=${esg_pillar}`
    } else {
      return `/metric-subtypes?metric_name=${item.name}&esg_pillar=${esg_pillar}`
    } 
  }

  return (
    <Tabs defaultActiveKey={"0"}>
      {modStandards.map(({ esg_pillar, metric_names }, idx) => (
          <Tabs.TabPane tab={esg_pillar} key={idx}>
              <Row gutter={40}>
                {metric_names.map((item: any) => (
                  <Col lg={{span: 8}} sm={{span: 24}} key={item.name} style={{ marginBottom: 32, display: 'block' }}>
                    <Link to={getLink(item, esg_pillar)}>
                      <Card
                        title={item.name}
                        type='inner'
                        extra={showReport && <Link
                          to={getLink(item, esg_pillar)}>View</Link>}
                          actions={[
                            <div>{showReport && getReportEntries(item)}</div>,
                            <div>{showReport && '0 Pending Approval'}</div>,
                          ]}
                      >
                      <Space direction={'vertical'}>
                        <p>{item.metric_subtype}</p>
                        {codesByStandard(map(item.items)).map((standard: any, idx) => (
                            <div key={idx} >
                                <Space key={standard.id} style={{paddingRight: '20px'}}>{standard.name}</Space>
                                {map(uniq(flatten(map(standard.data, s =>(s.metric_code)))), (met: any) => (
                                <Tag key={met}>{met}</Tag>
                                ))}
                            </div>
                            )
                        )}
                      </Space>
                      {!showReport &&
                        <Row style={{paddingTop: '20px'}}>
                          <Space direction={'vertical'}>
                            <p># Subtypes: {item.items.length}</p>
                          </Space>
                        </Row>
                      }
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
          </Tabs.TabPane>
      ))}
  </Tabs>
  )
}

export default MetricPillarTabs