# Web sockets
- realtime

## vs http
- https
  -  stateless 연결 => 백엔드는 통신한 프론트를 기억하지 않음
  - 매 번 자격증명해야함
  - req가 와야만 res할당, 1:1대응 => 내가 req보내야만, 서버의 자원을 할당받음 => 실시간은 거의 불가(한없이 많은 req 보내던 배민...)
- WebSockets
  - ws:// => http랑 다른 프로토콜
  - req를 받은 서버가, req를 거절 할 지 안할지 결정
  - req를 거절하지 않을 시 연결 성립(established)
  - 연결시 서버에서는 응답자를 기억 =>연결중에는 언제든지 클라이언트에 먼저 통신 가능