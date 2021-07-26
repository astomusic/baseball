import React, { useEffect, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import styled from 'styled-components';

import Button from 'src/styles/common/Button';
import { TextArea } from 'src/styles/common/Input';
import { Title } from 'src/styles/common/Typography';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 20px;
  grid-gap: 20px;
`;

const Card = styled.div`
  background-color: #ccc;
  height: 900px;
  padding: 10px;
  box-sizing: border-box;
`;

const VideoWrapper = styled.div`
  width: 90%;
  height: 300px;
  margin: 10px auto;
  video {
    width: 100%;
    height: 100%;
  }
`;

const AnswersWrapper = styled.div`
  width: 90%;
  margin: 10px auto;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  word-break: break-all;
`;

const Test = () => {
  const [videoSrc, setVideoSrc] = useState([null, null, null, null, null]);
  const [offer1, setOffer1] = useState('');
  const [offer2, setOffer2] = useState('');
  const [offer3, setOffer3] = useState('');
  const [offer4, setOffer4] = useState('');
  const [offer5, setOffer5] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '', '']);
  const [pcs, setPcs] = useState([null, null, null, null, null]);
  const stunUrl = 'stun:stun.l.google.com:19302';

  const videoData = [
    {
      id: 1,
      title: 'video17',
      offer: offer1,
      setOffer: setOffer1,
    },
    {
      id: 2,
      title: 'video18',
      offer: offer2,
      setOffer: setOffer2,
    },
    {
      id: 3,
      title: 'video3',
      offer: offer3,
      setOffer: setOffer3,
    },
    {
      id: 4,
      title: 'video4',
      offer: offer4,
      setOffer: setOffer4,
    },
    {
      id: 5,
      title: 'video5',
      offer: offer5,
      setOffer: setOffer5,
    },
  ];

  useEffect(() => {
    const config = {
      apiKey: 'AIzaSyBUdjAc2xrvMj_-I9SC0Di1raR9xpiDkEo',
      authDomain: 'screen-test-4c209.firebaseapp.com',
      projectId: 'screen-test-4c209',
      storageBucket: 'screen-test-4c209.appspot.com',
      messagingSenderId: '570675226720',
      appId: '1:570675226720:web:5b17bb337bfd0b1e5e7b05',
      measurementId: 'G-VJE6RV4TSE',
    };

    firebase.initializeApp(config);
    const db = firebase.firestore();

    db.collection('calls')
      .doc('122')
      .onSnapshot(doc => {
        if (doc.data() && doc.data().type === 'OFFER') {
          setOffer1(doc.data().sdp);
        }
      });

    db.collection('calls')
      .doc('18')
      .onSnapshot(doc => {
        if (doc.data() && doc.data().type === 'OFFER') {
          setOffer2(doc.data().sdp);
        }
      });

    const rtcConfig = {
      // iceTransportPolicy: 'relay',
      // bundlePolicy: 'max-compat',
      // rtcpMuxPolicy: 'require',
      iceServers: [{ urls: stunUrl }],
    };

    // @ts-ignore
    const tempPcs = videoData.map(() => new RTCPeerConnection(rtcConfig));
    tempPcs.map((pc, pcIndex) => {
      pc.ontrack = e => {
        console.log('track');
        setVideoSrc(items =>
          items.map((item, itemIndex) =>
            item ? item : pcIndex === itemIndex ? e.streams[0] : null,
          ),
        );
      };
      pc.oniceconnectionstatechange = e => {
        console.log(pc.iceConnectionState);
      };
    });

    setPcs(tempPcs);
  }, []);

  const connectOffer = (pc, offer, index) => () => {
    const desc = new RTCSessionDescription({
      type: 'offer',
      sdp: offer,
    });

    pc.setRemoteDescription(desc)
      .then(() => {
        console.log('createAnswer');
        pc.createAnswer();
      })
      .then(d => pc.setLocalDescription(d))
      .catch(err => {
        console.log('test');
        console.log(err);
      });
    pc.onicecandidate = f => {
      if (f.candidate || pc.iceConnectionState !== 'connected') {
        return;
      }
      setAnswers(items =>
        items.map((item, itemIndex) =>
          item ? item : index === itemIndex ? pc.localDescription.sdp : '',
        ),
      );
      console.log(pc.localDescription.sdp);
    };
  };

  return (
    <Wrapper>
      {videoData.map((item, index) => (
        <Card key={item.id}>
          <Title size={'xs'} color={'mint'} weight={'medium'} padding={'10px 0'} textAlign={'left'}>
            {item.title}
          </Title>
          <VideoWrapper>
            <video id={item.title} src={videoSrc[index]} autoPlay playsInline />
          </VideoWrapper>
          <TextArea label={'Offer'} value={item.offer} handler={item.setOffer} />
          {answers[index] && <TextArea value={answers[index]} />}
          <Button
            solid
            theme={'mint'}
            margin={'21px 0 0 0'}
            onClick={connectOffer(pcs[index], item.offer, index)}
          >
            {'Connect Offer'}
          </Button>
        </Card>
      ))}
    </Wrapper>
  );
};

export default Test;
