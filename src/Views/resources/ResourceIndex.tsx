import React, {FC, SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import {Link, useParams, useSearchParams} from "react-router-dom";
import ResourceService from "../../Services/ResourceService";
import {Button, Input, Space, Table, Drawer} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import { nodeService } from "@antv/xflow-extension/es/flowchart-node-panel";

import { DrawerProps } from "antd";

const Wrapper = styled.div`
  padding: 30px;
`

// INTERFACES
interface drawerState {
    title: string,
    placement: DrawerProps["placement"],
    formSubmitted: boolean
}

interface visibleState {
    popConfirm: boolean,
    drawer: boolean
}

const ResourceIndex: FC = () => {
    const {resourceName} = useParams()

    const [searchParam] = useSearchParams()
    const facility_name = searchParam.get('facility_name')

    const [fields, setFields] = useState([])
    const [dataSource, setDataSource] = useState([])

    const [searchText, setSearchText] = useState(facility_name ?? '')
    const [searchedColumn, setSearchedColumn] = useState(facility_name ? 'facility_name' : '')

    const [visible, setVisible] = useState<visibleState>({popConfirm: false, drawer: false})
    const [drawer, setDrawer] = useState<drawerState>({title: "Default", placement: "right", formSubmitted: false})

    const [data, setData] = useState<{[key: string]: any}>({})

    const searchInput = useRef<any>(null)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
        if (resourceName){
            const text = resourceName[0].toUpperCase() + resourceName.substring(1)

            switch(type) {
                case "Edit":
                    setData(() => {
                        const formData: {[key: string]: any} = {}
                        for (let i = 0; i < fields.length; i++){
                            formData[fields[i]["dataIndex"]] = ""
                        }
                        return formData
                    })
                    setVisible(visible => ({
                        ...visible,
                        drawer: true
                    }))
                    setDrawer(drawer => ({
                        ...drawer,
                        title: `Edit ${text}`,
                        placement: "right",
                        formSubmitted: false
                    }))
                    break
                case "Add":
                    setData(() => {
                        const formData: {[key: string]: any} = {}
                        for (let i = 0; i < fields.length; i++){
                            formData[fields[i]["dataIndex"]] = ""
                        }
                        return formData
                    })
                    setVisible(visible => ({
                        ...visible,
                        drawer: true
                    }))
                    setDrawer(drawer => ({
                        ...drawer,
                        title: `Add ${text}`,
                        placement: "left",
                        formSubmitted: false
                    }))
                    break
                case "Delete":
                    break
            }
        }
    }

    const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        setData((current) => {
            let temp = {...current}
            temp[name] = value
            return temp
        })
    }

    const clearForm = () => {

    }

    const handleSubmit = () => {
        console.log("Submitting data now")
    }

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

        // We'll need to add ability to determine if admin user or not.
        filteredFields.push({
            key: "action", 
            title: "Actions", 
            render: (record: {[key: string]: any}) => {
                return (
                    <>
                        <Button type="primary" style={{marginRight: 10}} onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClick(e, "Edit")}>
                            Edit
                        </Button>
                        <Button type="primary" style={{background: "red", border: 'red'}} onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClick(e, "Delete")}>
                            Delete
                        </Button>
                    </>
                ); 
            }, 
        });

        return filteredFields;

    }, [fields, getColumnSearchProps])

    useEffect(() => {
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


    }, [facility_name, resourceName])

    return (
        <Wrapper>
            <Button type="primary" style={{marginBottom: 16}} id={'id'} onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClick(e, "Add")}>
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
                    clearForm()
                    setVisible(visibleObj => ({
                        ...visibleObj,
                        ...{drawer: false}
                    }))
                }}
            >
                {!drawer.formSubmitted
                    ? fields.map((field: {[key: string]: any}, key: number) => {
                        return (
                            <div key={key}>
                                <label>{field.title}</label>
                                <br></br>
                                <input 
                                    type={field.type + "area"} 
                                    id={field.dataIndex} 
                                    name={field.dataIndex} 
                                    value={data[field.dataIndex]}
                                    onChange={(e) => handleChange(e)}/>
                                <br></br>
                            </div>
                        )
                    })
                    : <div>Form Submitted</div>
                }
            </Drawer>
        </Wrapper>
    )
}

export default ResourceIndex

// To DO
/*
    Add, Edit, Delete, and Admin authorization only
    - Look to making visible object more efficient
*/