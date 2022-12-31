/* IMPORT EXTERNAL MODULES */
import { Col, Input, Modal, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import { filter, flatten, map } from "lodash";

/* IMPORT INTERNAL MODULES */
import MetricSubtypeCards from "./MetricSubtypeCards";

const MetricSubtypeTabs = ({ standards, report, showReport }: any) => {
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

  const metricCodes = (item: any) => {
    let codes = flatten(map(item, (i) => i['metric_code'].split(',')))
    return codes
  }

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
        {/* Generates Metric Cards */}
        {modStandards?.map((item: any, idx:string) => (
          <MetricSubtypeCards
            displayDescription={displayDescription}
            getLink={getLink}
            getReportEntries={getReportEntries}
            hideDescription={hideDescription}
            idx={idx}
            item={item}
            metricCodes={metricCodes}
            showDescription={showDescription}
            showModal={showModal}
            showReport={showReport}
          />
        ))}
      </Row>
      <Modal title="Metric Description" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>{metricDescription}</p>
      </Modal>
    </div>
  )
}

export default MetricSubtypeTabs