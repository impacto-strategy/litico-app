/* IMPORT EXTERNAL MODULES */
import { 
    Alert,
    Button,
    Col,
    Row,
    Tooltip,
    Upload
} from "antd";
import { DownloadOutlined, QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";

/* IMPORT INTERNAL MODULES */
import ResourceService from "../../../../Services/ResourceService"

/**
 * Interface for metric subtype that allows user to either download a blank excel form to add data in bulk or to upload a completed form.
 */
const ExcelFormOptions: FC<any> = ({headers, searchParams}): JSX.Element => {
    // COMPONENT HOOKS
    const baseUrl = process.env.API_URL || 'http://localhost:8000'
    const [defaultColumns] = useState<any>([
        'ESG Pillar',
        'Standard',
        'Metric Name',
        'Metric Subtype',
        'Metric Code',
        'Risk',
        'Value',
        'Measurement Units',
        'Numerator 1',
        'Numerator 2',
        'Numerator 3',
        'Numerator 4',
        'Numerator 5',
        'Numerator 6',
        'Numerator 7',
        'Numerator 8',
        'Denominator',
        'Description',
        'Narrative',
        'Date',
        'Organization',
        'Contact',
        'Name',
        'Address',
        'City',
        'State',
        'Basin',
        'Type A',
        'Type B'
    ])
    const [headerColumns, setHeaderColumns] = useState<any>()
    const [uploaded, setUploaded] = useState<any>(false)

    // COMPONENT FUNCTIONS
    const colHeaders = useMemo(() => {
        if (headerColumns && headerColumns.length > 0) {
            return [headerColumns.map((header :any) => header.col_header), headerColumns.map((header:any) => header.default_value)]
        } else {
            return [defaultColumns, defaultColumns.map(() => '')]
        }
    }, [defaultColumns, headerColumns])

    /**
     * This is definitely an action/side effect. I need to rename and clean this up.
     */
    const getColumns = useCallback(() => {
        ResourceService.fields(
            {
                resourceName: 'metric-types',
                params: {metric_subtype: searchParams.get("metric_subtype")}
            }
        ).then(({ data }) => {
            setHeaderColumns(data)
        })

    }, [searchParams])

    const uploadFile = (e: any) => {
        if (e?.file?.status === 'done') {
            setUploaded(true)
        }
    };

    // MISC
    useEffect(() => {
        getColumns()
    }, [getColumns])

    return (
        <>
            {/* Button interface for blank form for uploading multiple data points at once. */}
            <Row>
                <Col span={24}>
                    <span style={{ float: 'right' }} >
                        <Tooltip 
                            placement="topLeft" 
                            title={'Enter a single data point below or bulk upload using these buttons'}
                        >
                            <QuestionCircleOutlined style={{ paddingRight: '24px' }} />
                        </Tooltip>
                        <Button icon={<DownloadOutlined />}>
                            <CSVLink data={colHeaders}> Download Blank Form</CSVLink>
                        </Button>
                    </span>
                </Col>
            </Row>
            {/* Button interface for completed form for uploading multiple data points at once. */}
            <Row>
                <Col style={{ paddingTop: '20px', paddingBottom: '20px' }} span={24}>
                    <span style={{ float: 'right' }}>
                        <Upload name="files" action={`${baseUrl}/api/uploads?metric_subtype=${searchParams.get("metric_subtype")}`} onChange={uploadFile} withCredentials={true} headers={headers}>
                            <Button style={{ float: 'right' }} icon={<UploadOutlined />}>Upload Completed Form</Button>
                        </Upload>
                        {uploaded &&
                            <Alert message="Upload Successful" type="success" closable/>
                        }
                    </span>
                </Col>
            </Row>
        </>
    )
}

export default ExcelFormOptions;