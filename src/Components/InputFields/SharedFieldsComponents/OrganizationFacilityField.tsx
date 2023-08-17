import { Col, Form, Input, Select } from 'antd';
import { orderBy } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import ResourceService from '../../../Services/ResourceService';

const OrganizationFacilityField = ({ standards }: any) => {
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

    useEffect(() => {
        getFacilities()
    }, [getFacilities])

    return (
        <Col
            lg={{span: 12}}
            sm={{span: 24}}
        >
            { standards?.[0].location_type && standards?.[0].location_type === 'facility' &&
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
            }
            {standards?.[0].location_type && standards?.[0].location_type === 'organization' &&
                    <Form.Item name="organization" label="Organization">
                        <Input/>
                    </Form.Item>
            }
        </Col>
    )
}

export default OrganizationFacilityField;