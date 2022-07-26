import { FC } from 'react';
import { List } from "antd";
import styled from "styled-components";
import { CheckCircleTwoTone, StopTwoTone } from '@ant-design/icons'
import { find } from 'lodash'

const governanceData = [
  {
    name: 'Discussion - Governance Structure',
    hasPolicy: false
  },
  {
    name: 'Discussion - Anti-Corruption and Bribery',
    hasPolicy: true
  },
  {
    name: 'Discussion - Lobbying',
    hasPolicy: false
  },
  {
    name: 'Discussion -  Anti-Corruption and Bribery',
    hasPolicy: true
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
        <h2>Key Governance Documents & Discussions</h2>
        <List
          grid={{gutter: 16, column: 2}}
          dataSource={governanceData}
          renderItem={(item: any, idx) => (
            
            <List.Item style={{ padding: '10px' }}>
              {hasPolicy(item) ?
                <CheckCircleTwoTone style={{ paddingRight: '5px' }} twoToneColor="#52c41a" />
                : <StopTwoTone style={{ paddingRight: '5px' }} twoToneColor="#c41a52" />}
              {item.name}
            </List.Item>
          )}
        />
      </Wrapper>
    )
}

export default GovernanceCheckList