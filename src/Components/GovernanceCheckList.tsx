import { FC } from 'react';
import { List } from "antd";
import styled from "styled-components";
import { BorderOutlined, CheckSquareOutlined } from '@ant-design/icons'
import { find } from 'lodash'

const governanceData = [
  {
    name: 'Discussion - Anti-Corruption and Bribery',
    hasPolicy: true
  },
  {
    name: 'Discussion -  Anti-Corruption and Bribery',
    hasPolicy: true
  },
  {
    name: 'Discussion - Governance Structure',
    hasPolicy: false
  },
  {
    name: 'Discussion - Lobbying',
    hasPolicy: false
  },
  {
    name: 'Discussion - Regulatory Risk',
    hasPolicy: false
  },
  {
    name: 'Discussion - Tail Risks',
    hasPolicy: false
  }
]

const Wrapper = styled.div`
    background: #fff;
    padding: 20px;
    grid-column: 1 / 5

  `

const GovernanceCheckList: FC<{ esgMetrics: any }> = props => {
  const hasPolicy = (item:any) => {
    return !!find(props.esgMetrics, { metric_subtype: item.name })
  }
    return (
      <Wrapper>
        <h3>Key Governance Documents & Discussions</h3>
        <List
          grid={{gutter: 16, column: 3}}
          dataSource={governanceData}
          style={{fontSize: '16px'}}
          renderItem={(item: any, idx) => (
            <List.Item style={{ padding: '10px', float: 'left'}}>
              {hasPolicy(item) ?
                <CheckSquareOutlined style={{ paddingRight: '5px'}} />
                : <BorderOutlined style={{ paddingRight: '5px'}} />}
              {item.name}
            </List.Item>
          )}
        />
      </Wrapper>
    )
}

export default GovernanceCheckList