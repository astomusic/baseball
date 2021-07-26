import React, { useEffect, useRef, useState } from 'react';
import { from } from 'rxjs';

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

const stunUrl = 'stun:stun.l.google.com:19302';
const rtcConfig = {
  iceServers: [{ urls: stunUrl }],
};

const pcTest = new RTCPeerConnection(rtcConfig);

const Test = () => {
  const [offer1, setOffer1] = useState('');
  const [offer2, setOffer2] = useState('');
  const [offer3, setOffer3] = useState('');
  const [offer4, setOffer4] = useState('');
  const [offer5, setOffer5] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '', '']);
  const [pcs, setPcs] = useState([null, null, null, null, null]);
  const viewRef1 = useRef<HTMLVideoElement>(null);
  const viewRef2 = useRef<HTMLVideoElement>(null);
  const viewRef3 = useRef<HTMLVideoElement>(null);
  const viewRef4 = useRef<HTMLVideoElement>(null);
  const viewRef5 = useRef<HTMLVideoElement>(null);

  const videoData = [
    {
      id: 1,
      title: 'video17',
      offer: offer1,
      setOffer: setOffer1,
      ref: viewRef1,
      key: '17',
      pc: new RTCPeerConnection(rtcConfig),
    },
    {
      id: 2,
      title: 'video18',
      offer: offer2,
      setOffer: setOffer2,
      ref: viewRef2,
      key: '18',
      pc: new RTCPeerConnection(rtcConfig),
    },
    {
      id: 3,
      title: 'video3',
      offer: offer3,
      setOffer: setOffer3,
      ref: viewRef3,
      key: '19',
      pc: new RTCPeerConnection(rtcConfig),
    },
    {
      id: 4,
      title: 'video4',
      offer: offer4,
      setOffer: setOffer4,
      ref: viewRef4,
      key: '20',
      pc: new RTCPeerConnection(rtcConfig),
    },
    {
      id: 5,
      title: 'video5',
      offer: offer5,
      setOffer: setOffer5,
      ref: viewRef5,
      key: '21',
      pc: new RTCPeerConnection(rtcConfig),
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

    videoData.map(item => {
      db.collection('calls')
        .doc(item.key)
        .onSnapshot(doc => {
          if (doc.data() && doc.data().type === 'OFFER') {
            item.setOffer(doc.data().sdp);
          }
        });
    });

    const tempPcs = videoData.map(item => {
      const pc = new RTCPeerConnection(rtcConfig);
      pc.ontrack = e => {
        console.log('onTrack');
        item.ref.current.srcObject = e.streams[0];
      };
      pc.oniceconnectionstatechange = e => {
        console.log(item.pc.iceConnectionState);
      };
      return pc;
    });

    pcTest.ontrack = e => {
      console.log('onTrack');
      viewRef1.current.srcObject = e.streams[0];
    };
    pcTest.oniceconnectionstatechange = e => {
      console.log(pcTest.iceConnectionState);
    };

    setPcs(tempPcs);
  }, []);

  const connectOffer3 = (pc, offer, index, key) => () => {
    const desc = new RTCSessionDescription({
      type: 'offer',
      sdp: offer,
    });

    pcTest
      .setRemoteDescription(desc)
      .then(() => pcTest.createAnswer())
      .then(d => {
        pcTest.setLocalDescription(d);
      })
      .then(() => {
        const answer = {
          sdp: pcTest.localDescription.sdp,
          type: 'ANSWER',
        };
        const db = firebase.firestore();
        db.collection('calls')
          .doc(key)
          .set(answer)
          .then(() => {
            console.log('ANSWER_success');
          });
      })
      .catch(err => {
        console.log('error');
        console.log(err);
      });
  };

  const connectOffer2 = (pc, offer, index, key) => async () => {
    const desc = new RTCSessionDescription({
      type: 'offer',
      sdp: offer,
    });

    await pc.setRemoteDescription(desc);
    const d = await pc.createAnswer();
    await pc.setLocalDescription(d);
    console.log(pc.localDescription);
    const answer = {
      sdp: pc.localDescription.sdp,
      type: pc.localDescription.type.upperCase(),
    };
    const db = firebase.firestore();
    db.collection('calls')
      .doc(key)
      .set(answer)
      .then(() => {
        console.log('ANSWER_success');
      });

    pc.onicecandidate = f => {
      if (f.candidate || pc.iceConnectionState !== 'connected') {
        return;
      }

      console.log(pc.localDescription.sdp);
    };
  };

  const connectOffer4 = (pc, offer, index, key) => async () => {
    const desc = new RTCSessionDescription({
      type: 'offer',
      sdp: offer,
    });

    from(pc.setRemoteDescription(desc)).subscribe({
      next: () => {
        from(pc.createAnswer()).subscribe({
          next: d => {
            from(pc.setLocalDescription(d)).subscribe({
              next: () => {
                const answer = {
                  sdp: pc.localDescription.sdp,
                  type: 'ANSWER',
                };
                const db = firebase.firestore();
                db.collection('calls')
                  .doc(key)
                  .set(answer)
                  .then(() => {
                    console.log('ANSWER_success');
                  });
              },
            });
          },
        });
      },
    });
  };

  const connectOffer = (pc: RTCPeerConnection, offer: string, index: number, key: string) => () => {
    const desc = new RTCSessionDescription({
      type: 'offer',
      sdp: offer,
    });
    // pc.localDescription
    console.log(pc.localDescription);
    if (!pc.localDescription) {
      pc.setRemoteDescription(desc)
        .then(() => pc.createAnswer())
        .then(d => {
          console.log(d);
          pc.setLocalDescription(d);
        })
        .then(() => {
          console.log('re-call');
          connectOffer(pc, offer, index, key)();
        })
        .catch(err => {
          console.log('error');
          console.log(err);
        });
    } else {
      console.log('else');
      const answer = {
        sdp: pc.localDescription.sdp,
        type: 'ANSWER',
      };
      const db = firebase.firestore();
      db.collection('calls')
        .doc(key)
        .set(answer)
        .then(() => {
          console.log('ANSWER_success');
        });
    }

    // setPcs(items => items.map((item, itemIndex) => (itemIndex === index ? pc : item)));

    pc.onicecandidate = f => {
      if (f.candidate || pc.iceConnectionState !== 'connected') {
        return;
      }

      console.log('onicecandidate');

      // const db = firebase.firestore();
      // const tempMap = {
      //   serverUrl: '',
      //   sdpMid: '',
      //   sdpMLineIndex: '',
      //   sdpCandidate: f.candidate,
      //   type: 'answerCandidate',
      // };

      // db.collection('calls')
      //   .doc('17')
      //   .collection('candidate')
      //   .doc('answerCandidate')
      //   .set(tempMap)
      //   .then(() => console.log('success!'));

      // setAnswers(items =>
      //   items.map((item, itemIndex) =>
      //     item ? item : index === itemIndex ? pc.localDescription.sdp : '',
      //   ),
      // );
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
            <video ref={item.ref} id={item.title} autoPlay playsInline />
          </VideoWrapper>
          <TextArea label={'Offer'} value={item.offer} handler={item.setOffer} />
          {answers[index] && <TextArea value={answers[index]} />}
          <Button
            solid
            theme={'mint'}
            margin={'21px 0 0 0'}
            onClick={connectOffer(pcs[index], item.offer, index, item.key)}
          >
            {'Connect Offer'}
          </Button>
        </Card>
      ))}
    </Wrapper>
  );
};

export default Test;
