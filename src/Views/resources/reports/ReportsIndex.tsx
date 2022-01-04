import {FC, useCallback, useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import ResourceService from "../../../Services/ResourceService";
import {Button, PageHeader, Skeleton, Space, Tabs} from "antd";
import {Link} from "react-router-dom";
import {groupBy, map} from "lodash";
import ReportYearViewer from "./components/ReportYearViewer";

const {TabPane} = Tabs;

const Wrapper = styled.section`
  margin: auto;
  max-width: none;
  padding-top: 20px;
  padding-bottom: 40px;

`


const ContentWrapper = styled.div`
  background: #fff;
  padding: 60px 30px;
`
const ReportsIndex: FC = () => {

    const [reports, setReports] = useState([])
    const [initLoading, setInitLoading] = useState(true)

    const organizedReports = useMemo(() => {
        return map(groupBy(reports, 'year'), (reports, year) => ({
            year,
            reports
        }))
    }, [reports])

    const getAllReports = useCallback(() => {
        ResourceService.index({
            resourceName: 'reports'
        }).then(({data}) => setReports(data))
            .finally(() => setInitLoading(false))
    }, [setReports])


    useEffect(() => {
        getAllReports()
    }, [getAllReports])


    return (
        <Wrapper>
            <Space direction="vertical" style={{width: '100%'}} size={"large"}>

                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title="Reports"
                    extra={[
                        <Link key="1" to={`/reports/new`}>
                            <Button type="primary">
                                Add New Report
                            </Button>
                        </Link>,
                    ]}
                >
                </PageHeader>

                <ContentWrapper>
                    <Skeleton active loading={initLoading}>
                        {organizedReports.length > 0 &&
                        <Tabs defaultActiveKey={organizedReports[0].year} tabPosition={'left'}>
                            {organizedReports.map(report => (
                                <TabPane tab={`${report.year}`} key={report.year}>
                                    <ReportYearViewer key={report.year} report={report}/>
                                </TabPane>
                            ))}
                        </Tabs>}
                    </Skeleton>

                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default ReportsIndex