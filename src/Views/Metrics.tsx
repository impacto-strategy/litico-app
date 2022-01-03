import React, {FC, useContext, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import ResourceService from "../Services/ResourceService";
import {groupBy, map, sortBy} from "lodash";
import {Button, Form, FormInstance, Input} from "antd";
import MetricForm from "../Components/MetricForm";

const Wrapper = styled.section`
  margin: auto;
  max-width: 1150px;
  padding-top: 20px;
  padding-bottom: 40px;

`

const Title = styled.h1`
  margin-bottom: 40px;
  font-size: 1.5rem;
  color: #333;
`


const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
                                                       title,
                                                       editable,
                                                       children,
                                                       dataIndex,
                                                       record,
                                                       handleSave,
                                                       ...restProps
                                                   }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<Input>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({[dataIndex]: record[dataIndex]});
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{margin: 0}}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{paddingRight: 24}} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};


const Metrics: FC = () => {

    const navigate = useNavigate()

    const [ipiecaStandards, setIpiecaStandards] = useState<any>([])


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '30%',
            editable: true,
        },
        {
            title: 'Value',
            dataIndex: 'value',
            editable: true
        },
        {
            title: 'Risk',
            dataIndex: 'risk',
            editable: true
        },
        {
            title: 'Narrative',
            dataIndex: 'narrative',
            editable: true
        },
    ]

    const handleAdd = (standard: any, id: any) => {

        const data = [...ipiecaStandards]


        const idx = data.indexOf(standard)

        const standards = data[idx]

        const metricInstance = standards.standards.find((item: any) => item.id === id)

        const metricIdx = standards.standards.indexOf(metricInstance)

        const newData: any = {
            name: data[idx].standards[metricIdx].name,
            value: null,
            risk: null,
            narrative: '',
            i_p_i_e_c_a_indicator_id: data[idx].standards[metricIdx].id
        };

        data[idx].standards[metricIdx].metrics.push(newData)

        setIpiecaStandards(data)
    };

    const handleSave = (row: any) => {
        const newData = [...ipiecaStandards];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setIpiecaStandards(newData)
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const _columns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });


    useEffect(() => {
        ResourceService.index({resourceName: 'ipieca-indicators'}).then(({data}) => {
            setIpiecaStandards(sortBy(map(groupBy(data, 'module'), (standards, moduleName) => {
                return {
                    moduleName,
                    standards
                }
            }), 'moduleName'))
        })
    }, [])


    const updateMetric = (metric: any) => {
        ResourceService.store({
            resourceName: 'metrics',
            fields: metric
        })
    }

    return (
        <Wrapper>
            <Title>
                2020 Metrics
            </Title>
            <div>
                {ipiecaStandards.map((std: any) => (
                    <div key={std.moduleName}>
                        <h2>{std.moduleName}</h2>
                        <hr/>
                        {std.standards.map((item: any) => (
                            <div key={item.id}>
                                <h3>{item.indicator} | {item.name}</h3>

                                <div style={{marginBottom: 40}}>

                                    <div>
                                        {item.metrics.map((metric: any, idx: number) => (
                                            <MetricForm key={idx} metric={metric} onAdd={updateMetric}/>
                                        ))}
                                    </div>

                                    <Button type="primary" onClick={() => handleAdd(std, item.id)}
                                            style={{marginTop: 16}}>
                                        Add a metric
                                    </Button>

                                </div>
                            </div>
                        ))}

                    </div>
                ))}
            </div>
        </Wrapper>
    )
}

export default Metrics