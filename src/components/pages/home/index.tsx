import React, { useState } from 'react';

import Button from 'src/styles/common/Button';
import { Col, Container, Row } from 'src/styles/common/Grid';
import { TextArea, TextInput } from 'src/styles/common/Input';
import { Title } from 'src/styles/common/Typography';

const Home = () => {
  const [offer, setOffer] = useState('');
  const [answer, setAnswer] = useState('');
  const [chat, setChat] = useState('');
  const [chatList, setChatList] = useState([]);
  const [pc, setPc] = useState(
    new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }),
  );
  const [dc, setDc] = useState(null);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [answerDisable, setAnswerDisable] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [secretNum, setSecretNum] = useState('');
  const [incomeSecretNum, setIncomeSecretNum] = useState('');
  const [fixSecretNum, setFixSecretNum] = useState(false);
  const [guessError, setGuessError] = useState(false);
  const [secretNumError, setSecretNumError] = useState(false);
  const [disabledGuess, setDisabledGuess] = useState(true);

  pc.ondatachannel = e => {
    const ch = e.channel;
    setAnswerDisable(true);
    setShowSettings(false);
    setDc(ch);
  };

  pc.oniceconnectionstatechange = e => {
    console.log(pc.iceConnectionState);
  };

  const checkGuess = (newGuess: string) => {
    let strike = 0;
    let ball = 0;

    for (let i = 0; i < incomeSecretNum.length; i++) {
      if (newGuess[i] === incomeSecretNum[i]) {
        strike++;
      } else {
        for (let j = 0; j < incomeSecretNum.length; j++) {
          if (i !== j && newGuess[i] === incomeSecretNum[j]) {
            ball++;
          }
        }
      }
    }

    return {
      strike,
      ball,
    };
  };

  const appendGuess = (newGuess: string) => {
    const temp = [...chatList, newGuess];
    setChatList(temp);
  };

  const handleMessage = e => {
    const incomeString = e.data;
    if (incomeString.includes('key')) {
      const incomeArr = incomeString.split(':');
      setIncomeSecretNum(incomeArr[1]);
    } else {
      appendGuess(`Rival Guess : ${incomeString}`);
    }
  };

  const createOffer = () => {
    setButtonDisable(true);
    const temp = pc.createDataChannel('chat');
    setDc(temp);
    pc.createOffer().then(d => pc.setLocalDescription(d));
    pc.onicecandidate = e => {
      if (e.candidate) {
        return;
      }
      setOffer(pc.localDescription.sdp);
    };
  };

  const connectOffer = e => {
    const desc = new RTCSessionDescription({ type: 'offer', sdp: offer });
    pc.setRemoteDescription(desc)
      .then(() => pc.createAnswer())
      .then(d => pc.setLocalDescription(d))
      .catch(err => {
        console.log(err);
      });
    pc.onicecandidate = f => {
      if (f.candidate || pc.iceConnectionState !== 'connected') {
        setButtonDisable(false);
        return;
      }
      setButtonDisable(true);
      setAnswer(pc.localDescription.sdp);
    };
  };

  const handleAnswer = () => {
    setAnswerDisable(true);
    setShowSettings(false);
    if (pc.signalingState !== 'have-local-offer') {
      return;
    }
    const desc = new RTCSessionDescription({ type: 'answer', sdp: answer });
    pc.setRemoteDescription(desc)
      .then(() => {
        return openCall();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const isBaseballNum = (guess: string) => {
    const reg = /^(?!.*(.).*\1)\d{3}$/;
    return reg.test(guess);
  };

  const handleChat = e => {
    if (e.key !== 'Enter') {
      return;
    }
    if (!isBaseballNum(chat)) {
      setGuessError(true);
      return;
    }
    setGuessError(false);
    const result = checkGuess(chat);
    appendGuess(`Your Guess : ${chat} - ${result.strike}S ${result.ball}B`);
    dc.send(chat);
    setChat('');
  };

  const handleSetNum = () => {
    if (!isBaseballNum(secretNum)) {
      setSecretNumError(true);
      return;
    }
    setSecretNumError(false);
    setFixSecretNum(true);
    setDisabledGuess(false);
    dc.send(`key:${secretNum}`);
  };

  const openCall = async () => {
    const gumStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    for (const track of gumStream.getTracks()) {
      pc.addTrack(track);
    }
  };

  if (dc) {
    dc.onmessage = handleMessage;
  }

  return (
    <React.Fragment>
      <Container color={'mint'}>
        <Row>
          <Col size={12}>
            <Title size={'m'} color={'white'} weight={'medium'} padding={'10px 0'}>
              {'WebRTC Test by Baseball Game'}
            </Title>
          </Col>
        </Row>
      </Container>
      <Container color={'#f2f2f3'}>
        <Row paddingTop={'50px'} paddingBottom={'180px'}>
          <Col size={2} mobile={0} colEnd />
          <Col size={8} colEnd align={'center'}>
            {showSettings && (
              <React.Fragment>
                <Title
                  size={'xs'}
                  color={'mint'}
                  weight={'regular'}
                  padding={'0 0 30px 0'}
                  textAlign={'left'}
                >
                  {'1. (host) Create offer'}
                  <br />
                  {'2. (host) Copy/send offer string to guest'}
                  <br />
                  {'3. (guest) Paste offer string for connect offer'}
                  <br />
                  {'4. (guest) Copy/send answer string to host'}
                  <br />
                  {'5. (host) Paste answer string for connect answer'}
                  <br />
                  {'6. (all) If it is connected, you can set number for game!'}
                </Title>
                <TextArea label={'Offer'} value={offer} handler={setOffer} />
                <Button
                  solid
                  theme={'mint'}
                  margin={'21px 20px 0 0'}
                  onClick={createOffer}
                  disabled={buttonDisable}
                >
                  Create Offer
                </Button>
                <Button
                  solid
                  theme={'mint'}
                  margin={'21px 0 0 0'}
                  onClick={connectOffer}
                  disabled={buttonDisable}
                >
                  Connect Offer
                </Button>
                <TextArea label={'Answer'} value={answer} handler={setAnswer} />
                <Button
                  solid
                  theme={'mint'}
                  margin={'21px 0 0 0'}
                  onClick={handleAnswer}
                  disabled={answerDisable}
                >
                  Connect Answer
                </Button>
              </React.Fragment>
            )}
            {!showSettings && (
              <React.Fragment>
                {!fixSecretNum && (
                  <React.Fragment>
                    <TextInput
                      label={'Set Your Number(3-digits without duplication)'}
                      handler={setSecretNum}
                      value={secretNum}
                      error={secretNumError}
                    />
                    <Button solid theme={'mint'} margin={'21px 0 0 0'} onClick={handleSetNum}>
                      Set!
                    </Button>
                  </React.Fragment>
                )}
                {fixSecretNum && (
                  <Title
                    size={'xs'}
                    color={'mint'}
                    weight={'medium'}
                    padding={'10px 0'}
                    textAlign={'left'}
                  >
                    {secretNum}
                  </Title>
                )}
                {chatList.map((c, index) => {
                  const align = c.includes('Your') ? 'left' : 'right';
                  return (
                    <Title
                      key={index}
                      size={'xs'}
                      color={'black'}
                      weight={'medium'}
                      padding={'10px 0'}
                      textAlign={align}
                    >
                      {c}
                    </Title>
                  );
                })}
                <TextInput
                  label={'Guess'}
                  handler={setChat}
                  value={chat}
                  onKeyPress={handleChat}
                  error={guessError}
                  disabled={disabledGuess}
                />
              </React.Fragment>
            )}
          </Col>
          <Col size={2} mobile={0} />
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Home;
