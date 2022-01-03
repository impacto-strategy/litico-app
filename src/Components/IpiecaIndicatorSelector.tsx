import {FC, useCallback, useEffect, useMemo, useState} from "react";
import ResourceService from "../Services/ResourceService";
import {Card, Input, List, Space, Tag} from "antd";
import {CheckCircleFilled} from '@ant-design/icons'

const IpiecaIndicatorSelector: FC<{ defaultValue: any[], onUpdate: (ids: any[]) => void }> = ({
                                                                                                  defaultValue = [],
                                                                                                  onUpdate = (ids) => null
                                                                                              }) => {

    const [indicators, setIndicators] = useState([])

    const [userInput, setUserInput] = useState('')

    const [selectedIndicators, setSelectedIndicators] = useState<any[]>([...defaultValue])

    const filteredIndicators = useMemo(() => {
        return indicators.filter(({name, indicator, module}: any) => {
            const reg = new RegExp(userInput, 'gi')
            return name.match(reg) || indicator.match(reg) || module.match(reg)
        })
    }, [indicators, userInput])

    const getIndicators = useCallback(() => {

        ResourceService.index({
            resourceName: 'ipieca-indicators'
        }).then(({data}) => setIndicators(data))

    }, [setIndicators])

    const selectIndicator = useCallback((id: any) => {
        const _selectedIndicators = new Set<any>([...selectedIndicators])

        if (_selectedIndicators.has(id)) {
            _selectedIndicators.delete(id)
        } else {
            _selectedIndicators.add(id)
        }
        const res = Array.from(_selectedIndicators)

        setSelectedIndicators(res)
        onUpdate(res)

    }, [selectedIndicators])

    useEffect(() => {
        if (defaultValue) {
            onUpdate(defaultValue)
        }
        getIndicators()
    }, [getIndicators])

    return (
        <div style={{width: '100%'}}>
            <Space direction={"vertical"} style={{width: '100%'}}>
                <div style={{width: '100%'}}>
                    <Input.Search placeholder={"Search"} onInput={ev => setUserInput(ev.currentTarget.value)}/>
                </div>
                <div>
                    <List
                        grid={{gutter: 16, column: 2}}
                        dataSource={filteredIndicators}
                        renderItem={(item: any) => (
                            <a key={item.id} onClick={() => selectIndicator(item.id)}><List.Item>
                                <Card
                                    title={<div> {selectedIndicators.includes(item.id) &&
                                    <CheckCircleFilled style={{marginRight: 10, color: 'green'}}/>} {item.name}</div>}
                                    hoverable={!selectedIndicators.includes(item.id)}>
                                    <Card.Meta title={<Tag>
                                        {item.indicator}
                                    </Tag>} description={item.module}>
                                    </Card.Meta>
                                </Card>
                            </List.Item>
                            </a>
                        )}
                    />
                </div>
            </Space>
        </div>
    )

}

export default IpiecaIndicatorSelector