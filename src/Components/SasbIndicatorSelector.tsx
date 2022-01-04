import {FC, useCallback, useEffect, useMemo, useState} from "react";
import ResourceService from "../Services/ResourceService";
import {Card, Input, List, Space, Tag} from "antd";
import {CheckCircleFilled} from "@ant-design/icons";

const SasbIndicatorSelector: FC<{ defaultValue: any[], onUpdate?: (ids: any[]) => void, onSelect?: (standard: any) => void }> = ({
                                                                                                                                    defaultValue = [],
                                                                                                                                    onUpdate = (ids) => null,
                                                                                                                                    onSelect = () => null
                                                                                                                                }) => {

    const [indicators, setIndicators] = useState([])

    const [userInput, setUserInput] = useState('')

    const [selectedIndicators, setSelectedIndicators] = useState<any[]>([...defaultValue])

    const filteredIndicators = useMemo(() => {
        return indicators.filter(({topic, code, accounting_metric}: any) => {
            const reg = new RegExp(userInput, 'gi')
            return topic.match(reg) || accounting_metric.match(reg) || code.match(reg)
        })
    }, [indicators, userInput])

    const getIndicators = useCallback(() => {

        ResourceService.index({
            resourceName: 'sasb-standards'
        }).then(({data}) => setIndicators(data))
    }, [setIndicators])

    const selectIndicator = useCallback((id: any) => {

        onSelect(indicators.find((s: any) => s.id === id))

        const _selectedIndicators = new Set<any>([...selectedIndicators])

        if (_selectedIndicators.has(id)) {
            _selectedIndicators.delete(id)
        } else {
            _selectedIndicators.add(id)
        }
        const res = Array.from(_selectedIndicators)

        setSelectedIndicators(res)
        onUpdate(res)

    }, [selectedIndicators, onSelect, onUpdate, indicators])

    useEffect(() => {
        if (defaultValue) {
            onUpdate(defaultValue)
        }
        getIndicators()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


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
                            <div key={item.id} onClick={() => selectIndicator(item.id)}><List.Item>
                                <Card
                                    title={<div> {selectedIndicators.includes(item.id) &&
                                    <CheckCircleFilled style={{marginRight: 10, color: 'green'}}/>} {item.topic}</div>}
                                    hoverable={!selectedIndicators.includes(item.id)}>
                                    <Card.Meta title={<Tag>
                                        {item.code}
                                    </Tag>} description={item.accounting_metric}>
                                    </Card.Meta>
                                </Card>
                            </List.Item>
                            </div>
                        )}
                    />
                </div>
            </Space>
        </div>
    )

}


export default SasbIndicatorSelector