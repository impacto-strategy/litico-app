import {FC} from "react";
import {
    Col,
    Row,
    Typography,
} from "antd";
import styled from "styled-components";
import {Link} from "react-router-dom";
const {Title} = Typography

type TReportYearViewer = {
    report: any | {
        year: number
        reports: any[]
    }
}

const ReportCard = styled.div<{ notStarted?: boolean }>`
  border: 1px solid #dadce0;
  border-radius: 8px;
  width: 100%;
  padding: 20px 30px;
  opacity: ${props => props.notStarted ? 0.5 : 1};
`

const ReportsViewer: FC<TReportYearViewer> = ({ report }) => {
    const isPeriodAnnual = (period: string) => period === 'YR'

    return (
        <div>
          <Row
            align={"middle"}
            gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
            <Col span={18}>
                <Row
                    gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                    {report.reports.map((rep: any) => (
                        <Col key={rep.year + '_col' + rep.period} span={4}>
                            <Link to={`/reports/${rep.id}/metric-names`}>
                                <ReportCard>
                                    <Title level={4}>{isPeriodAnnual(rep.period) ? 'EOY' : rep.period}</Title>
                                </ReportCard>
                            </Link>
                        </Col>
                    ))}

                </Row>
            </Col>
          </Row>
        </div>
    )
}

export default ReportsViewer