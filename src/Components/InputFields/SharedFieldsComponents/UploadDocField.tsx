import { Form, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { FC } from 'react';

/**
 * Allows users to add documents for ESG Metric data points.
 * Seperating this into it's own component allows for better seperation of concerns and reusability between the form for adding new data and editing existing data. 
 */
const UploadDocField: FC = (): JSX.Element => {

    const normFile = (e: any) => {
        if (e?.file?.status === 'done') {
            resources.push(e.file.response)
        }
        return e && e.fileList;
    };

    const baseUrl = process.env.API_URL || 'http://localhost';
    let token = Cookies.get('XSRF-TOKEN')
    const headers = {
        'X-XSRF-TOKEN': token || ''
    }
    let resources: any[] = [];

    return (
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
    )
}

export default UploadDocField;