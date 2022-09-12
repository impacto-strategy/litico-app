import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import {Link, useParams, useSearchParams, useNavigate} from "react-router-dom";
import ResourceService from "../../Services/ResourceService";
import {Button, Input, Space, Table, Drawer, Popconfirm, message} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import ResourceForm from "./ResourceForm";

import { DrawerProps } from "antd";

const Wrapper = styled.div`
  padding: 30px;
`

// INTERFACES AND TYPES
interface drawerState {
    title: string,
    placement: DrawerProps["placement"],
    formSubmitted: boolean
}

interface visibleState {
    popConfirm: boolean,
    drawer: boolean
}

interface individualField {
    title: string,
    dataIndex: string,
    index: boolean,
    type: string,
    searchable: boolean
}

type ReactButton = React.MouseEvent<HTMLButtonElement>;

let formMessage: JSX.Element;

const ResourceIndex: FC = () => {
    const {resourceName} = useParams()
    const navigate = useNavigate()

    const [searchParam] = useSearchParams()
    const facility_name = searchParam.get('facility_name')

    const [fields, setFields] = useState([])
    const [dataSource, setDataSource] = useState([])

    const [searchText, setSearchText] = useState(facility_name ?? '')
    const [searchedColumn, setSearchedColumn] = useState(facility_name ? 'facility_name' : '')

    const [visible, setVisible] = useState<visibleState>({popConfirm: false, drawer: false})
    const [drawer, setDrawer] = useState<drawerState>({title: "Default", placement: undefined, formSubmitted: false})

    const [data, setData] = useState<{[key: string]: any}>({})

    const searchInput = useRef<any>(null)

    const handleClick = async (e: ReactButton, type: string, id?: number) => {
        if (resourceName){
            const text = resourceName[0].toUpperCase() + resourceName.substring(1)

            setVisible(visible => ({
                ...visible,
                drawer: true
            }))

            switch(type) {

                case "Edit":
                    if (id) {

                        const payload = {resourceName, resourceID: id}
                        const res = await ResourceService.get(payload)

                        if (res.data) {

                            let temp: {[key: string]: any} = {}

                            fields.forEach((item: individualField) => {
                                const name = item['dataIndex']
                                temp[name] = res.data.Data[name]
                            })

                            temp['id'] = res.data.Data['id']

                            setData(temp)

                            setDrawer(drawer => ({
                                ...drawer,
                                title: `Edit ${text}`,
                                placement: "right",
                                formSubmitted: false
                            }))
                        } else {
                            message.error("Couldn't Load Data")
                        }
                    } else {
                        message.error("ID Missing in Call")
                    }
                    break
                case "Add":
                    setData(() => {
                        const formData: {[key: string]: any} = {}
                        for (let i = 0; i < fields.length; i++){
                            formData[fields[i]["dataIndex"]] = ""
                        }
                        return formData
                    })

                    setDrawer(drawer => ({
                        ...drawer,
                        title: `Add ${text}`,
                        placement: "left",
                        formSubmitted: false
                    }))
                    break
            }
        }
    }

    const handleSubmit = async (e: ReactButton) => {
        e.preventDefault();

        if (resourceName) {
            let payload: any = {
                resourceName,
                fields: data
            }

            try {
                let res;

                if (payload.fields.id) {
                    payload['resourceID'] = payload.fields.id
                    delete payload.fields.id
                    res = await ResourceService.update(payload)
                } else {
                    res = await ResourceService.store(payload)
                }

                if (res.data) {
                    formMessage = <div>Form Submitted</div>
                    getFieldsAndData()
                } else {
                    formMessage = <div>Form Submission Unsuccessful</div>
                }
                
            } catch (err) {
                console.log(err)
                formMessage = <div>Server Error, Try again later</div>
            }
        }

        setDrawer(current => ({
            ...current,
            formSubmitted: true
        }))
    }

    const handleDelete = useCallback( async (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined, id: number) => {
        if (e) {
            e.preventDefault()
        }
        if (resourceName) {
            const payload = {
                resourceID: id,
                resourceName
            }
            try {
                ResourceService.delete(payload)
                message.success("Successfully Deleted")
                getFieldsAndData()
            } catch (err) {
                console.log(err)
                message.error("Unable to delete")
            }
        }
    }, [resourceName])

    const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
        confirm();

        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)

    }, [setSearchText, setSearchedColumn]);

    const handleReset = useCallback(clearFilters => {
        clearFilters();
        setSearchText('');
    }, [setSearchText]);

    const getColumnSearchProps = useCallback(dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}: any) => (
            <div style={{padding: 8}}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    defaultValue={facility_name || ''}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({closeDropdown: false});
                            setSearchText(selectedKeys[0])
                            setSearchedColumn(dataIndex)
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: any) => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter: (value: string, record: { [x: string]: { toString: () => string; }; }) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
        render: (text: { toString: () => any; }) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    }), [facility_name, handleReset, handleSearch, searchText, searchedColumn]);

    const columns = useMemo(() => {

        let filteredFields = fields.filter(({index}) => index).map((field: any) => {
            let _field = {...field}

            if (_field.sort) {
                _field.sorter = (a: any, b: any) => {

                    if (typeof a[_field.dataIndex] === 'string') {
                        if (a[_field.dataIndex] < b[_field.dataIndex]) {
                            return -1;
                        }
                        if (a[_field.dataIndex] > b[_field.dataIndex]) {
                            return 1;
                        }
                        return 0;
                    }

                    return a[_field.dataIndex] - b[_field.dataIndex]

                }
            }

            if (_field.searchable) {
                _field = {
                    ..._field,
                    ...getColumnSearchProps(_field.dataIndex),
                }
            }


            if (_field.link_to) {
                _field.render = (text: any, record: any, index: any) => <Link
                    to={`/${_field.link_to.route}?${_field.link_to.key}=${record[_field.link_to.valueIndex]}`}>{text}</Link>
            }

            if (_field.external_ref) {
                _field.render = (text: any, record: any, index: any) => <a href={`${record[_field.external_ref.key]}`} target='blank'>{`${record[_field.external_ref.key]}`}</a>
            }

            return _field
        })

        filteredFields.push({
            key: "action", 
            title: "Actions", 
            render: (record: {[key: string]: any}) => {
                return (
                    <>
                        <Button type="primary" style={{marginRight: 10}} onClick={(e: ReactButton) => handleClick(e, "Edit", record.id)}>
                            Edit
                        </Button>

                        <Popconfirm
                            title="Delete This Row?"
                            okText="Delete"
                            onConfirm={(e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => handleDelete(e, record.id)}
                            onCancel={() => setData({})}
                        >
                            <Button 
                                type="primary" 
                                style={{background: "red", border: 'red'}} 
                            >
                                Delete
                            </Button>
                        </Popconfirm>
                    </>
                ); 
            }, 
        });

        return filteredFields;

    }, [fields, getColumnSearchProps])

    const getFieldsAndData = () => {
        setDataSource([])
        setFields([])
        if (!resourceName) {
            return
        }

        ResourceService.fields({resourceName}).then(({data}) => setFields(data))
        ResourceService.index({resourceName}).then(({data}) => setDataSource(data)).then(() => {

            if (facility_name) {
                setSearchedColumn('facility_name')
                setSearchText(facility_name)
                searchInput.current && (searchInput.current.value = facility_name)
            }
        })
    }

    useEffect(() => {
        getFieldsAndData()

        const user = localStorage.getItem("_U")
        if (!user || !user.includes("@impactostrategy.com")) {
            navigate('/dashboard')
        }
    }, [facility_name, resourceName, handleDelete])

    return (
        <Wrapper>
            <Button type="primary" style={{marginBottom: 16}} id={'id'} onClick={(e: ReactButton) => handleClick(e, "Add")}>
                Add
            </Button>
            <Table
                pagination={{
                    defaultPageSize: 50,
                    pageSize: 50
                }} columns={columns} dataSource={dataSource} rowKey={'id'}/>
            <Drawer
                title={drawer.title}
                placement={drawer.placement}
                closable={false}
                visible={visible.drawer}
                onClose={() => {
                    setData({})
                    setVisible(visibleObj => ({
                        ...visibleObj,
                        ...{drawer: false}
                    }))
                }}
            >
                <div>
                    {!drawer.formSubmitted && resourceName
                        ? <ResourceForm fields={fields} data={data} setData={setData}/>
                        : formMessage
                    }
                    {!drawer.formSubmitted &&
                        <Button 
                            type="primary" 
                            style={{marginBottom: 16}} 
                            id={'id'} 
                            onClick={(e: ReactButton) => handleSubmit(e)}
                        >
                            Submit
                        </Button>
                    }
                </div>
            </Drawer>
        </Wrapper>
    )
}

export default ResourceIndex