import styled from "styled-components";
import {createPortal} from "react-dom";
import ClickAwayListener from "react-click-away-listener";
import {FC, ReactElement} from "react";
import {CloseCircleOutlined} from '@ant-design/icons'

const portalRoot = document.getElementById('modal-root');

interface IPortal {
    children: ReactElement,
    onClose: (p: false) => void
    bgColor?: string
}


const Close = styled.div`
  font-size: 2rem;

  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 9;
  cursor: pointer;
  transform: translate(-20%, 20%);
`

const RootWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  background: rgba(0, 0, 0, 0.2);
`
const Wrapper = styled.div<{ bgColor?: string }>`
  // position: fixed;
  // top:50%;
  // left:50%;
  // transform:translate(-50%, -50%);
    // background:${props => props.bgColor || '#fff'};
`
const Modal: FC<IPortal> = ({children, bgColor, onClose = () => null}) => {
    return createPortal(
        <>
            <RootWrapper>
                <ClickAwayListener onClickAway={() => onClose(false)}>
                    <Wrapper bgColor={bgColor}>
                        <Close onClick={() => onClose(false)}>
                            <CloseCircleOutlined/>
                        </Close>
                        {children}
                    </Wrapper>
                </ClickAwayListener>
            </RootWrapper>
        </>
        , portalRoot || document.body);
}

export default Modal