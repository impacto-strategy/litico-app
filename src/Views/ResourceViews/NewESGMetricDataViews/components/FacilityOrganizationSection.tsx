import {
    Col,
    Form,
    Input,
    Row,
    Select
} from 'antd';
import { orderBy } from 'lodash';
import { 
    useCallback,
    useEffect,
    useState
} from 'react';

import ResourceService from '../../../../Services/ResourceService';

const FacilityOrganizationSection = ({standards}: any) => {
    const [facilities, setFacilities] = useState<any>();

    const getFacilities = useCallback(() => {
        ResourceService.index({
            resourceName: 'facilities'
        }).then(({ data }) => {
            let facilities = orderBy(data, 'name')
            facilities.unshift({ name: "All Facilities" })
            setFacilities(facilities)
        })
    }, [])

    const stateCodes = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
        'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
        'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
        'WI', 'WY'
    ]

    useEffect(() => {
        getFacilities()
    }, [getFacilities])

    return (
        <Row gutter={24}>
            { standards?.[0].location_type && standards?.[0].location_type === 'facility' &&
                <Col lg={{span: 12}} sm={{span: 24}}>
                    <Form.Item name="organization" label="Facility" initialValue={'All Facilities'}>
                        <Select>
                            {facilities?.map((facility: any) => (
                                <Select.Option 
                                    key={facility.id} 
                                    value={facility.name}
                                >
                                    {facility.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            }

            {standards?.[0].location_type && standards?.[0].location_type === 'organization' &&
                <Col lg={{span: 12}} sm={{span: 24}}>
                    <Form.Item name="organization" label="Organization">
                        <Input/>
                    </Form.Item>
                </Col>
            }
            <Col lg={{span: 12}} sm={{span: 24}}>
                <Form.Item name="basin" label="Basin">
                    <Select>
                            <Select.Option 
                                key={"Basin"} 
                                value={"DJ Basin"}
                            >
                                DJ Basin
                            </Select.Option>
                            <Select.Option 
                                key={"Basin"} 
                                value={"Permian"}
                            >
                                Permian
                            </Select.Option>
                            <Select.Option 
                                key={"Basin"} 
                                value={""}
                            >
                                N/A
                            </Select.Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col lg={{span: 4}} sm={{span: 24}}>
                <Form.Item name="state" label="State">
                    <Select>
                        {stateCodes.map((code: string) => (
                            <Select.Option key={code} value={code} >{code}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    )
}

export default FacilityOrganizationSection;