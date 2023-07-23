import {
    FC,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import styled from "styled-components";
import ResourceService from "../../../Services/ResourceService";
import {
    Divider, 
    PageHeader, 
    Skeleton, 
    Space, 
    Tabs
} from "antd";
import { groupBy, map, orderBy } from "lodash";
import ReportsViewer from "./components/ReportsViewer";

const { TabPane } = Tabs;

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

/**
 * Renders UI that allows user to decide what year and timeframe they want to view data for.
 */
const ReportTimeframeSelector: FC = () => {

    const [reports, setReports] = useState([])
    const [initLoading, setInitLoading] = useState(true)

    const organizedReports = useMemo(() => {
        return orderBy(map(groupBy(reports, 'year'), (reports, year) => ({
            year,
            reports
        })), 'year', 'desc')
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
                >
                </PageHeader>

                <ContentWrapper>
                    <p style={{ textAlign: 'center' }}>Access a detailed view of a Metric Category or Download Data from LITICO</p>
                    <Divider></Divider>
                    <h2 style={{textAlign: 'center', paddingBottom: '20px'}}>Select a Timeframe of Interest</h2>
                    <Skeleton active loading={initLoading}>
                        <Space style={{fontSize: '16px'}}>Year</Space>
                        {organizedReports.length > 0 &&
                            <Tabs defaultActiveKey={organizedReports[0].year} tabPosition={'left'}>
                                {organizedReports.map(report => (
                                    <TabPane tab={`${report.year}`} key={report.year}>
                                        <ReportsViewer key={report.year} report={report}/>
                                    </TabPane>
                                ))}
                            </Tabs>
                        }
                    </Skeleton>

                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default ReportTimeframeSelector;