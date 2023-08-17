import {
    Button,
    Divider,
    Form,
    Input,
    Upload
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { 
    FC, 
    useCallback, 
    useEffect, 
    useState 
} from 'react';
import {useSearchParams} from 'react-router-dom';

import DynamicFieldsSection from '../../NewESGMetricDataViews/components/DynamicFieldsSection';
import SharedFieldsSection from '../../NewESGMetricDataViews/components/SharedFieldsSection';

import ResourceService from '../../../../Services/ResourceService';

import {ESGMetricFactors, Standards} from '../../../../../global';

interface IEditFormProps {
    
};

/**
 * Handles both the logic and UI for editing ESG Metric Data.
 */
const ESGDataEditForm: FC = (): JSX.Element => {
    const baseUrl = process.env.API_URL || 'http://localhost';

    const [fields, setFields] = useState<ESGMetricFactors | null>();
    const [standard, setStandard] = useState<Standards | null>();
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();

    /**
     * Single standard pertaining to metric subtype. Needed mainly for input fields needed.
     */
    const getStandard = useCallback(() => {
        ResourceService.index({
            resourceName: "standards",
            params: {metric_subtype: searchParams.get("metric_subtype")}
        }).then(({ data }: {data: Standards}) => {
            setStandard(data);
            setFields(data[0].esg_metric_factors)
            // setDefaultFields()
        })

    }, [searchParams, setStandard])

    const normFile = (e: any) => {
        console.log('Upload event:', e)
        if (e?.file?.status === 'done') {
            resources.push(e.file.response)
        }
        return e && e.fileList;
    };

    const onFinish = () => {
        
    }

    // MISC
    let resources: any[] = [];
    let token = Cookies.get('XSRF-TOKEN')
    const headers = {
        'X-XSRF-TOKEN': token || ''
    }

    useEffect(() => {
        getStandard();
    }, [getStandard]);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <SharedFieldsSection 
                searchParams={searchParams}
                standards={standard}
            />

            <Divider />

            <DynamicFieldsSection fields={fields} />

            <Divider />

            <Form.Item label="Upload Supporting Documentation" tooltip="Upload any document that compliments this entry.">
                <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile}  noStyle>
                    <Upload.Dragger name="file" action={`${baseUrl}/api/resources`} withCredentials={true} headers={headers} accept=".csv,.pdf,.doc,.docx,.jpeg,.png,.jpg,.svg">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload.
                        </p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>

            <Divider />

            <Form.Item name="comments" label="Discussion and Analysis">
                <Input.TextArea />
            </Form.Item>

            <Form.Item>
                {(fields && fields?.length > 0) &&
                    <Button type="primary" htmlType="submit">Submit</Button>
                }
                {(fields && fields?.length < 1) &&
                    <div>
                        <Button type="primary" disabled>Submit</Button>
                        <p>Form not available yet</p>
                    </div>
                }
            </Form.Item>
        </Form>
    )
}

export default ESGDataEditForm;