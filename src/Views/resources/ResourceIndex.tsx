import {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import {Link, useParams, useSearchParams} from "react-router-dom";
import ResourceService from "../../Services/ResourceService";
import {Button, Input, Space, Table} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

const Wrapper = styled.div`
  padding: 30px;
`

const ResourceIndex: FC = () => {
    const {resourceName} = useParams()

    const [searchParam] = useSearchParams()
    const facility_name = searchParam.get('facility_name')

    const [fields, setFields] = useState([])
    const [dataSource, setDataSource] = useState([])

    const [searchText, setSearchText] = useState(facility_name ?? '')
    const [searchedColumn, setSearchedColumn] = useState(facility_name ? 'facility_name' : '')

    const searchInput = useRef<any>(null)


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
        return fields.filter(({index}) => index).map((field: any) => {
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

            return _field
        })


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
            <Button type="primary" style={{marginBottom: 16}}>
                <Link to={`/${resourceName}/new`}>
                    Add
                </Link>
            </Button>
            <Table
                pagination={{
                    defaultPageSize: 50,
                    pageSize: 50
                }} columns={columns} dataSource={dataSource} rowKey={'id'}/>
        </Wrapper>
    )
}

export default ResourceIndex