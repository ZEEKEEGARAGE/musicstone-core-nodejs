import React, { useState } from "react"
import Caver from "caver-js";
import styled from "styled-components";
import sft_abi from '../../abi/SFT';
import service_abi from '../../abi/Service';

const MyStoneModal = ({ modalStone, klayPrice, modalOpen, setModalOpen, account }) => {
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const caver = new Caver(window.klaytn);

    const handleClose = () => {
        setQuantity(0);
        setPrice(0);
        setModalOpen(false);
    }
    const handleQuantityInput = (e) => {
        switch (e.target.id) {
            case "price":
                setPrice(e.target.value);
                break;
            case "quantity":
                if (Number(e.target.value) > modalStone.balance) {
                    alert(`현재 보유한 수량은 ${modalStone.balance}개 입니다.`);
                } else {
                    setQuantity(e.target.value)
                }
                break;
            default:
                break;
        }
    }

    //현재 서버에서 리스트 받아오는게 아직이라 하드코딩값 판매등록됨
    const handleSell = async () => {
        const sft = new caver.klay.Contract(sft_abi, process.env.REACT_APP_SFT_ADDRESS);
        const service = new caver.klay.Contract(service_abi, process.env.REACT_APP_SERVICE_ADDRESS);

        if (account.isConnect) {
            const tx = await sft.methods
                .isApprovedForAll(account.account, process.env.REACT_APP_SERVICE_ADDRESS)
                .call()
                .then((approved) => {
                    //아직 승인받지 않은 경우에는 setApprovalForAll 수행
                    if (!approved) {
                        alert('판매 승인을 먼저 진행해주세요.')
                        sft.methods
                            .setApprovalForAll(process.env.REACT_APP_SERVICE_ADDRESS, true)
                            .send({
                                from: account.account,
                                gas: 1000000,
                            })
                            .then(console.log)
                    } else {
                        //item 등록 현재는 서버에서 mystone 받아오는게 없어서 하드코딩된거 판매등록함
                        //1번 토큰이 제(찬영) 계정으로 민팅한거라 판매등록 테스트하려면 바꿔줘야

                        try {
                            service.methods
                                //(tokenId, unitPrice, amount)
                                .addItemToMarket(1, 10, 10)
                                .send({
                                    from: account.account,
                                    gas: 1000000,
                                })
                                .then(console.log)
                        } catch (e) {
                            console.log(e)
                        }

                        // try {
                        //     service.methods
                        //         //(itemId), amount)
                        //         .purchaseItem(0, 3)
                        //         .send({
                        //             from: account.account,
                        //  value = amount * unitPrice
                        //             value: 30,
                        //             gas: 1000000,
                        //         })
                        //         .then(console.log)
                        // } catch (e) {
                        //     console.log(e)
                        // }

                        //등록된 itemId 확인용
                        // service.methods
                        //     .getMarketItemById(0)
                        //     .call()
                        //     .then(console.log)

                        //계정이 등록한 item 확인용
                        // service.methods
                        //     .getItemsBySeller(account.account)
                        //     .call()
                        //     .then(console.log)

                        //balance 확인용
                        // sft.methods
                        //     .balanceOf(account.account, 0)
                        //     .call()
                        //     .then(console.log)

                        //mintTest용
                        // service.methods
                        //     .mintSFT(1000)
                        //     .send({
                        //         from: account.account,
                        //         gas: 1000000,
                        //     })
                        //     .then(console.log)

                    }
                })
        } else {
            alert("지갑을 연결해주세요.");
        }
    }
    return (
        <ModalOverlay display={modalOpen ? "flex" : "none"}  >
            <ModalWindow>
                <Head>
                    <Close onClick={() => handleClose()}>
                        <span>X</span>
                    </Close>
                </Head>
                <Content>
                    <Nav>
                        <Item>음원</Item>
                        <PriceQuantity>수량</PriceQuantity>
                        <PriceQuantity>가격(KLAY)</PriceQuantity>
                    </Nav>
                    <Cart>
                        <Receipt>
                            <Item>{modalStone.name} - {modalStone.musician_name}</Item>
                            <InputWrapper>
                                <QuantityInput id="quantity" type="number" min="0" value={quantity} onChange={(e) => handleQuantityInput(e)} />
                            </InputWrapper>
                            <InputWrapper>
                                <PriceInput id="price" type="number" min="0" value={price} onChange={(e) => handleQuantityInput(e)} />
                            </InputWrapper>
                        </Receipt>
                        <Total>
                            <div><h3>Total</h3></div>
                            <TotalPrice>
                                <div>{(price * quantity).toFixed(3)} KLAY</div>
                                <div>{(klayPrice * price * quantity).toFixed(0)} 원</div>
                            </TotalPrice>
                        </Total>
                    </Cart>
                    <BtnBox>
                        <BuyBtn onClick={() => handleSell()}>판매 등록</BuyBtn>
                    </BtnBox>
                </Content>
            </ModalWindow>
        </ModalOverlay >
    )
}

export default MyStoneModal;

const ModalOverlay = styled.div`
width: 100%;
height: 100%;
position: absolute;
left: 0;
top: 0;
display:${({ display }) => display};;
flex-direction: column;
align-items: center;
justify-content: center;
backdrop-filter: blur(1.5px);
`;
const ModalWindow = styled.div`
background: #333333;
box-shadow: 0 8px 32px 0 #222222;
backdrop-filter: blur( 13.5px );
-webkit-backdrop-filter: blur( 13.5px );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );

width: 450px;
height: 300px;
position: relative;
top: -100px;
padding: 10px;
`;
const Head = styled.div`
width: 100%;
height: 20px;
display:flex;
flex-direction:column;

`;
const Close = styled.div`
span{
    cursor: pointer;
    display: inline;
    float: right;
    padding-right: 10px;
    text-shadow: 1px 1px 2px gray;
}
`;
const Content = styled.div`
width: 100%;
height: 280px;
display:flex;
flex-direction: column;
`;
const Nav = styled.div`
height: 50px;
border-bottom: 0.5px solid #808080;
display:flex;
span{
    margin: 0 5px;
    text-align:center;
    line-height: 50px;
}
`;
const Item = styled.span`
width:240px;
`;
const PriceQuantity = styled.span`
width: 90px;
`;
const Cart = styled.div`
height: 150px;
border-bottom: 0.5px solid #808080;
display:flex;
flex-direction: column;
div{
    height:75px;
}
`;
const Receipt = styled.div`
display:flex;
span{
    margin: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    line-height: 75px;
}
`;
const InputWrapper = styled.span`
width: 90px;
margin: 0 5px;
display:flex;
align-items: center;
`;
const QuantityInput = styled.input`
width: 80%;
height: 25px;
margin: 0 10px;
padding: 0 5px;
text-align:right;
`;
const PriceInput = styled(QuantityInput)`
-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
`;
const Total = styled.div`
display:flex;
div{
    width:100%;
}
h3{
    padding: 0 20px;
}
`;
const TotalPrice = styled.div`
display:flex;
flex-direction:column;
div{
    padding-left: 50px;
}
`;
const BtnBox = styled.div`
width: 100%;
height: 80px;
display:flex;
justify-content:center;
align-items: center;
`
const BuyBtn = styled.button`
width: 200px;
height: 50px;
cursor:pointer;
border-radius: 10px;
`;